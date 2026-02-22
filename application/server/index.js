import path from 'path';
import debug from "debug";
import express from 'express';
import {Server} from 'socket.io';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const PORT = 4044
const HOST = '0.0.0.0'

const info = debug('server:info'), error = debug('server:error')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static(path.join(__dirname, '../client/dist')))

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

io.on('connection', (socket) => {
    info('new connection from : ', socket.id)
})

httpServer.listen(PORT, () => {
    info(`server now is running on http://${HOST}:${PORT}`)
})




//info(app)




