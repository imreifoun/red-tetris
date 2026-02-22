import {configureStore} from '@reduxjs/toolkit'
import GameSlice from './slice'
import socketMiddleware from '../middleware/socket'

export const store = configureStore({
    reducer : {
        game: GameSlice
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(socketMiddleware)
    }
})

