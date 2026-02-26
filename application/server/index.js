import path from 'path';
import debug from "debug";
import express from 'express';
import {Server} from 'socket.io';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import {Game} from './structure/game.js'
import {Player} from './structure/player.js'
import { createTetrisServer } from './app.js';


createTetrisServer({ port: 4045, host: "0.0.0.0", debugMode: true });
const DEBUG = true
const PORT = 4044
const HOST = '0.0.0.0'

const info = debug('server:info'), error = debug('server:error')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin : "*"
    }
})

app.use(express.static(path.join(__dirname, '../client/dist')))

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const games = new Map()

io.on('connection', (socket) => {
    info('new connection from : ', socket.id)

    socket.on('join', (data) => {
        if (!data) return;
        const {room, username} = data
        if (!room || !username) return;
        if (DEBUG) {info('room : ', room);info('username : ', username)}
        
        socket.join(room)
        info(`[+] ${username} (${socket.id}) joining : ${room}`)

        if (!games.has(room)) games.set(room, new Game(room));
        const game = games.get(room);

        if (game.started) {
            socket.emit('error', 'already started in this room');
            return;
        }
        
        const player = new Player(socket.id, username);
        game.newPlayer(player);

        io.to(room).emit('update', {
            name: room,
            players: game.players,
            started: game.started
        });
    })

    socket.on('start', (data) => {
        if (!data) 
            return;
        const {room} = data
        if (!room) 
            return;
        if (DEBUG) {info('start room : ', room);}
        const game = games.get(room);
        if (game) {
            const player = game.players.find(p => p.id === socket.id);
            if (player && player.host) {
                game.start();
                io.to(room).emit('started', {
                    stack: game.stack,
                    players: game.players
                });
            }
        }

    })
    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
        games.forEach((game, room) => {
            const remaining = game.deletePlayer(socket.id);
            if (remaining === 0) {
                games.delete(room);
            } else {
                io.to(room).emit('update', {
                    name: room,
                    players: game.players,
                    started: game.started
                });
            }
        });
    });
})

httpServer.listen(PORT, () => {
    info(`server now is running on http://${HOST}:${PORT}`)
})




//info(app)




