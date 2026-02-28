import path from "path";
import debug from "debug";
import express from "express";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Game } from "./structure/game.js";
import { Player } from "./structure/player.js";

const info = debug("server:info");

export function createTetrisServer({ port = 4045, host = "0.0.0.0", debugMode = false } = {}) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: "*" } });

  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.use((req, res) => res.sendFile(path.join(__dirname, "../client/dist/index.html")));

  const games = new Map();

  io.on("connection", (socket) => {
    if (debugMode) info("new connection from : ", socket.id);

    socket.on("join", (data) => {
      if (!data) return;
      const { room, username } = data;
      if (!room || !username) return;

      socket.join(room);

      if (!games.has(room)) games.set(room, new Game(room));
      const game = games.get(room);

      if (game.started) {
        socket.emit("error", "already started in this room");
        return;
      }

      const player = new Player(socket.id, username);
      game.newPlayer(player);

      io.to(room).emit("update", {
        name: room,
        players: game.players,
        started: game.started,
      });
    });

    socket.on("start", (data) => {
      if (!data) return;
      const { room } = data;
      if (!room) return;

      const game = games.get(room);
      if (game) {
        const player = game.players.find((p) => p.id === socket.id);
        if (player && player.host) {
          game.start();
          io.to(room).emit("started", {
            stack: game.stack,
            players: game.players,
          });
        }
      }
    });

    socket.on("disconnect", () => {
      games.forEach((game, room) => {
        const remaining = game.deletePlayer(socket.id);
        if (remaining === 0) {
          games.delete(room);
        } else {
          io.to(room).emit("update", {
            name: room,
            players: game.players,
            started: game.started,
          });
        }
      });
    });
  });

  return new Promise((resolve) => {
    httpServer.listen(port, host, () => {
      resolve({ app, io, httpServer, games, port, host });
    });
  });
}
