import { describe, it, expect, vi } from "vitest";

import reducer, {
  setup,
  update,
  new_board,
  starting,
  status,
  new_spec,
  new_piece,
  in_rotation,
  in_more,
  loser,
  on_game_over,
  on_penalty,
  ROWS,
  COLS,
} from "../../client/src/redux/slice.js";

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

describe("game slice (full)", () => {
  it("setup sets room and username", () => {
    const state = reducer(undefined, setup({ room: "3693", username: "fred" }));
    expect(state.room).toBe("3693");
    expect(state.username).toBe("fred");
  });

  it("update sets players and started", () => {
    const state = reducer(undefined, update({ players: ["p1"], started: true }));
    expect(state.players).toEqual(["p1"]);
    expect(state.started).toBe(true);
  });

  it("new_board sets board and score", () => {
    const board = emptyBoard();
    board[0][0] = "red";
    const state = reducer(undefined, new_board({ board, score: 42 }));
    expect(state.board[0][0]).toBe("red");
    expect(state.score).toBe(42);
  });

  it("on_game_over toggles game_over", () => {
    const state = reducer(undefined, on_game_over({ game_over: true }));
    expect(state.game_over).toBe(true);
  });

  it("starting resets state parts, sets started, and applies devOnly (last 2 rows yellow)", () => {
    const stack = [{ shape: [[1]], color: "cyan" }];
    const players = [{ id: "1", username: "fred" }];

    const state = reducer(undefined, starting({ stack, players }));

    expect(state.loss).toBe(false);
    expect(state.winner).toBe(null);
    expect(state.started).toBe(true);
    expect(state.stack).toEqual(stack);
    expect(state.players).toEqual(players);

    // devOnly paints bottom 2 rows yellow
    expect(state.board[ROWS - 1][0]).toBe("yellow");
    expect(state.board[ROWS - 2][COLS - 1]).toBe("yellow");
    // row above should still be 0
    expect(state.board[ROWS - 3][0]).toBe(0);
  });

  it("status replaces players only", () => {
    const s1 = reducer(undefined, status({ players: ["a", "b"] }));
    expect(s1.players).toEqual(["a", "b"]);
  });

  it("new_spec sets spec", () => {
    const state = reducer(undefined, new_spec({ spec: [1, 2, 3] }));
    expect(state.spec).toEqual([1, 2, 3]);
  });

  it("new_piece increments piece counter", () => {
    const s1 = reducer(undefined, new_piece());
    const s2 = reducer(s1, new_piece());
    expect(s2.piece).toBe(2);
  });

  it("in_rotation updates shape at stack[current]", () => {
    const base = reducer(undefined, starting({ stack: [{ shape: [[0]] }], players: [] }));
    const rotated = [[1, 1], [0, 1]];
    const state = reducer(base, in_rotation({ current: 0, shape: rotated }));
    expect(state.stack[0].shape).toEqual(rotated);
  });

  it("in_more replaces stack", () => {
    const base = reducer(undefined, starting({ stack: [{ shape: [[0]] }], players: [] }));
    const newStack = [{ shape: [[9]] }, { shape: [[8]] }];
    const state = reducer(base, in_more({ stack: newStack }));
    expect(state.stack).toEqual(newStack);
  });

  it("loser sets loss=true and game_over=true", () => {
    const state = reducer(undefined, loser());
    expect(state.loss).toBe(true);
    expect(state.game_over).toBe(true);
  });

  it("on_penalty: count<=0 returns without changing board", () => {
    const base = reducer(undefined, new_board({ board: emptyBoard(), score: 0 }));
    const state = reducer(base, on_penalty({ count: 0 }));
    expect(state.board).toEqual(base.board);
  });

  it("on_penalty: adds white penalty rows at bottom and slices top", () => {
    // Make a board with a marker in first row so we can see it gets sliced
    const board = emptyBoard();
    board[0][0] = "X";
    const base = reducer(undefined, new_board({ board, score: 0 }));

    // silence that DEBUG console.log in reducer
    vi.spyOn(console, "log").mockImplementation(() => {});

    const state = reducer(base, on_penalty({ count: 2 }));

    // top 2 rows removed => old row[0] should be gone
    expect(state.board[0][0]).not.toBe("X");

    // bottom 2 rows should be all 'white'
    expect(state.board[ROWS - 1]).toEqual(Array(COLS).fill("white"));
    expect(state.board[ROWS - 2]).toEqual(Array(COLS).fill("white"));
  });
});