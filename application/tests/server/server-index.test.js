import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { io as clientIO } from "socket.io-client";
import { createTetrisServer } from "../../server/app.js";

describe("server/index socket integration", () => {
  let server;
  const PORT = 4055;
  const URL = `http://127.0.0.1:${PORT}`;

  beforeAll(async () => {
    server = await createTetrisServer({ port: PORT, host: "127.0.0.1" });
  });

  afterAll(async () => {
    await new Promise((r) => server.httpServer.close(r));
  });

  it("join emits update to room", async () => {
    const socket = clientIO(URL, { transports: ["websocket"] });

    const update = await new Promise((resolve) => {
      socket.on("update", (data) => resolve(data));
      socket.emit("join", { room: "3693", username: "fred" });
    });

    expect(update.name).toBe("3693");
    expect(update.started).toBe(false);
    expect(update.players.length).toBe(1);
    expect(update.players[0].username).toBe("fred");

    socket.disconnect();
  });

  it("host can start and server emits started", async () => {
    const socket = clientIO(URL, { transports: ["websocket"] });

    // join first
    await new Promise((resolve) => {
      socket.on("update", () => resolve());
      socket.emit("join", { room: "777", username: "host" });
    });

    const started = await new Promise((resolve) => {
      socket.on("started", (data) => resolve(data));
      socket.emit("start", { room: "777" });
    });

    expect(Array.isArray(started.stack)).toBe(true);
    expect(started.stack.length).toBeGreaterThan(0);
    expect(started.players.length).toBe(1);
    expect(started.players[0].host).toBe(true);

    socket.disconnect();
  });

  it("join after started gets error", async () => {
    // room already started from previous test? use new one:
    const socket1 = clientIO(URL, { transports: ["websocket"] });
    await new Promise((resolve) => {
      socket1.on("update", () => resolve());
      socket1.emit("join", { room: "9000", username: "host" });
    });
    await new Promise((resolve) => {
      socket1.on("started", () => resolve());
      socket1.emit("start", { room: "9000" });
    });

    const socket2 = clientIO(URL, { transports: ["websocket"] });

    const err = await new Promise((resolve) => {
      socket2.on("error", (msg) => resolve(msg));
      socket2.emit("join", { room: "9000", username: "late" });
    });

    expect(String(err)).toMatch(/already started/i);

    socket1.disconnect();
    socket2.disconnect();
  });
});
