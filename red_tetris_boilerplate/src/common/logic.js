export const ROWS = 20;
export const COLS = 10;

export const PIECES = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: 'cyan'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'blue'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'orange'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'yellow'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 'green'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'purple'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 'red'
    }
};

// Rotates a 2D matrix 90 degrees clockwise.
export const rotate = (matrix) => {
    const size = matrix.length;
    const result = Array.from({ length: size }, () => Array(size).fill(0));
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            result[x][size - 1 - y] = matrix[y][x];
        }
    }
    return result;
};


// Checks if a piece can be placed at the given coordinates on the board.
export const isValidMove = (board, shape, x, y) => {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] !== 0) {
                const boardX = x + col;
                const boardY = y + row;

                if (
                    boardX < 0 ||
                    boardX >= COLS ||
                    boardY >= ROWS ||
                    (boardY >= 0 && board[boardY][boardX] !== 0)
                ) {
                    return false;
                }
            }
        }
    }
    return true;
};

// Inserts a piece into the board and returns a new board.
export const insertPiece = (board, shape, x, y, value) => {
    const newBoard = board.map(row => [...row]);
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] !== 0) {
                const boardX = x + col;
                const boardY = y + row;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    newBoard[boardY][boardX] = value;
                }
            }
        }
    }
    return newBoard;
};

// Clears full lines from the board and returns the new board and line count.
export const clearLines = (board) => {
    const filteredBoard = board.filter(row => row.some(cell => cell === 0));
    const cleared = ROWS - filteredBoard.length;
    const newLines = Array.from({ length: cleared }, () => Array(COLS).fill(0));
    return {
        board: [...newLines, ...filteredBoard],
        cleared
    };
};


// Generates the spectrum of a board (height of each column).
export const getSpectrum = (board) => {
    const spectrum = Array(COLS).fill(0);
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            if (board[y][x] !== 0) {
                spectrum[x] = ROWS - y;
                break;
            }
        }
    }
    return spectrum;
};

// Creates an empty game board.
export const createEmptyBoard = () => {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};
