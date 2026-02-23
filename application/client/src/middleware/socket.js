import io from 'socket.io-client'
import { update } from '../redux/slice';

const socketMiddleware = (store) => {
    let socket = null;
    return (next) => (action) => {
        console.log("ACTION:", action)
        switch (action.type) {
            case 'socket/connect':
                if (socket) socket.disconnect()
                socket = io('http://127.0.0.1:4044')

                socket.on('update', (data) => {
                    store.dispatch(update(data));
                });

        
            case 'socket/join':
                if (socket) socket.emit('join', action.payload);
                break;
            case 'socket/start':
                if (socket) socket.emit('start', action.payload);
                break;

        }
        return next(action);
    }
}

export default socketMiddleware;