import {createSlice} from '@reduxjs/toolkit'

export const ROWS = 20
export const COLS = 10

const initialState = {
    room: null,
    stack: [],
    players: [],
    username: null,
    started: false,
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
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
        },
        new_board: (state, action) => {
            state.board = action.payload.board;
        },
    }
})

export const {setup, update, new_board} = slice.actions
export default slice.reducer