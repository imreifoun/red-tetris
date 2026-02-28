import { describe, it, expect } from "vitest";
import reducer, { setup, update, new_board, ROWS, COLS } from "../../client/src/redux/slice.js";

describe("redux slice: game", () => {
  it("setup sets room and username", () => {
    const state = reducer(undefined, setup({ room: "3693", username: "areifoun" }));
    expect(state.room).toBe("3693");
    expect(state.username).toBe("areifoun");
  });

  it("update sets players and started", () => {
    const initial = reducer(undefined, { type: "@@INIT" });
    const next = reducer(initial, update({ players: ["a", "b"], started: true }));
    expect(next.players).toEqual(["a", "b"]);
    expect(next.started).toBe(true);
  });

  it("new_board replaces board", () => {
    const initial = reducer(undefined, { type: "@@INIT" });
    const board = Array.from({ length: ROWS }, () => Array(COLS).fill(7));
    const next = reducer(initial, new_board({ board }));
    expect(next.board[0][0]).toBe(7);
    expect(next.board).toHaveLength(ROWS);
    expect(next.board[0]).toHaveLength(COLS);
  });
});
