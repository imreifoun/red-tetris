import { describe, it, expect } from "vitest";
import {
    ROWS,
    COLS,
    rotate,
    isValidMove,
    insertPiece,
    clearLines,
    getSpectrum,
    createEmptyBoard,
    PIECES

 } from "../../common/logic";


 describe("common/logic", () => {
  it("createEmptyBoard returns a 20x10 board filled with 0", () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(ROWS);
    expect(board[0]).toHaveLength(COLS);
    expect(board.flat().every((v) => v === 0)).toBe(true);
  });

  it("rotate rotates a matrix 90 degrees clockwise", () => {
    const m = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const r = rotate(m);
    expect(r).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  it("isValidMove returns false when piece would go out of bounds (left wall)", () => {
    const board = createEmptyBoard();
    const shape = PIECES.O.shape; // 2x2 block
    expect(isValidMove(board, shape, -1, 0)).toBe(false);
  });

  it("isValidMove returns true for a valid placement", () => {
    const board = createEmptyBoard();
    const shape = PIECES.O.shape;
    expect(isValidMove(board, shape, 4, 0)).toBe(true);
  });

  it("insertPiece returns a NEW board and inserts value where shape has 1s", () => {
    const board = createEmptyBoard();
    const shape = PIECES.O.shape;
    const value = 9;

    const next = insertPiece(board, shape, 4, 0, value);

    // original board unchanged
    expect(board.flat().every((v) => v === 0)).toBe(true);

    // inserted cells are value
    expect(next[0][4]).toBe(value);
    expect(next[0][5]).toBe(value);
    expect(next[1][4]).toBe(value);
    expect(next[1][5]).toBe(value);
  });

  it("clearLines clears full rows and returns cleared count", () => {
    const board = createEmptyBoard();

    // make bottom row full
    const fullRow = Array(COLS).fill(1);
    const almost = board.slice(0, ROWS - 1).concat([fullRow]);

    const result = clearLines(almost);

    expect(result.cleared).toBe(1);
    // new top row should be empty
    expect(result.board[0].every((v) => v === 0)).toBe(true);
    // board size preserved
    expect(result.board).toHaveLength(ROWS);
    expect(result.board[0]).toHaveLength(COLS);
  });

  it("getSpectrum returns column heights", () => {
    const board = createEmptyBoard();
    // put a block at row 19 (bottom) col 0 => height 1
    board[ROWS - 1][0] = 1;
    // put a block at row 10 col 1 => height ROWS-10 = 10
    board[10][1] = 1;

    const s = getSpectrum(board);
    expect(s).toHaveLength(COLS);
    expect(s[0]).toBe(1);
    expect(s[1]).toBe(ROWS - 10);
  });

  it("isValidMove returns false on collision with existing blocks", () => {
  const board = createEmptyBoard();
  board[0][0] = 5; // occupied
  const shape = PIECES.O.shape; // uses (0,0) and (1,0) etc
  expect(isValidMove(board, shape, 0, 0)).toBe(false);
});

it("clearLines clears multiple full rows", () => {
  const board = createEmptyBoard();
  const full = Array(COLS).fill(1);
  const b = board.slice(0, ROWS - 2).concat([full, full]);
  const result = clearLines(b);
  expect(result.cleared).toBe(2);
  expect(result.board[0].every((v) => v === 0)).toBe(true);
  expect(result.board[1].every((v) => v === 0)).toBe(true);
});
});