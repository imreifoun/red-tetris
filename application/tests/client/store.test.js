import { describe, it, expect } from "vitest";

describe("redux store", () => {
  it("exports a configured store with game reducer", async () => {
    const { store } = await import("../../client/src/redux/store.js");
    const state = store.getState();
    expect(state).toHaveProperty("game");
    expect(state.game).toHaveProperty("board");
  });
});
