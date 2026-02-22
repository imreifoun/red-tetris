import {createSlice} from '@reduxjs/toolkit'

export const ROWS = 10
export const COLS = 20

const initialState = {
    room: null,
    players: [],
    username: null,
    started: false,
    board: Array.from({ length: 20 }, () => Array(10).fill(0)),
}

const slice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setup: (state, action) => {
            state.room = action.payload.room
            state.username = action.payload.username
        },
        update : (state, action) => {
            state.players = action.payload.players
            state.started = action.payload.started
        }
    }
})

export const {setup, update} = slice.actions
export default slice.reducer