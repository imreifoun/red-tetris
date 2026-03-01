import {createSlice} from '@reduxjs/toolkit'

export const ROWS = 20
export const COLS = 10

const initialState = {
    spec: [],
    piece: 0,
    score: 0,
    room: null,
    stack: [],
    players: [],
    loss: false,
    winner: null,
    username: null,
    started: false,
    game_over: false,
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
}

function devOnly(board) {
    if (!board || board.length === 0) return board;

    const y = board.length;
    const x = board[0].length;


    for (let i = y - 2; i < y; i++) {
        for (let j = 0; j < x; j++) {
            board[i][j] = 'yellow';
        }
    }

    return board;
}


const slice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        on_game_over: (state, action) => {
            state.game_over = action.payload.game_over
        },
        setup: (state, action) => {
            state.room = action.payload.room
            state.username = action.payload.username
        },
        starting : (state, action) => {
            state.loss = false;
            state.winner = null;
            state.started = true;
            state.stack = action.payload.stack;
            state.players = action.payload.players;
            state.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            state.board = devOnly(state.board)
        },
        on_penalty: (state, action) => {
            const count = action.payload.count;
            if (count <= 0) return;
            const penalty = Array(COLS).fill('white');
            const newBoard = state.board.slice(count);
            for (let i = 0; i < count; i++) {
                newBoard.push([...penalty]);
            }
            console.log('DEBUG 3 !!!')
            state.board = newBoard;
        },
        status: (state, action) => {
            state.players = action.payload.players;
        },
        new_spec: (state, action) => {
            state.spec = action.payload.spec
        },
        update : (state, action) => {
            state.players = action.payload.players
            state.started = action.payload.started
        },
        new_board: (state, action) => {
            state.board = action.payload.board;
            state.score = action.payload.score
        },
        new_piece: (state, action) => {
            state.piece += 1
        },
        in_rotation : (state, action) => {
            state.stack[action.payload.current].shape = action.payload.shape
        },
        in_more : (state, action) => {
            state.stack = action.payload.stack
        },
        loser: (state, action) => {
            state.loss = true
            state.game_over = true
        }
    }
})

export const {new_spec,on_penalty, status, on_game_over, loser, setup, update, new_board, new_piece, starting, in_rotation, in_more} = slice.actions
export default slice.reducer