import io from 'socket.io-client'
import { in_more, starting, update, status, on_penalty } from '../redux/slice';

const MACHINE_IP = import.meta.env.VITE_MACHINE_IP
const PORT = import.meta.env.VITE_SOCKET_PORT || "4044"

const socketMiddleware = (store) => {
    let socket = null;

    const setupListeners = (socket) => {
        socket.on('update', (data) => {
            store.dispatch(update(data));
        });

        socket.on('starting', (data) => {
            store.dispatch(starting(data));
        });

        socket.on('more', (data) => {
            store.dispatch(in_more(data));
        });

        socket.on('status', (data) => {
            store.dispatch(status(data));
        });

        socket.on('on_penalty', (data) => {
            store.dispatch(on_penalty(data));
        });
    };

    return (next) => (action) => {
        switch (action.type) {
            case 'socket/connect':
                if (socket) socket.disconnect();
                socket = io(`http://${MACHINE_IP}:${PORT}`);
                setupListeners(socket);
                break;
            case 'socket/join':
                if (socket) socket.emit('join', action.payload);
                break;
            case 'socket/status':
                if (socket) socket.emit('status', action.payload);
                break;
            case 'socket/more':
                if (socket) socket.emit('more', action.payload);
                break;
            case 'socket/start':
                if (socket) socket.emit('start', action.payload);
                break;
            case 'socket/penalty':
                if (socket) socket.emit('penalty', action.payload);
                break;
        }
        return next(action);
    };
};

export default socketMiddleware;