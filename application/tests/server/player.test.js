import { describe, it, expect } from "vitest";
import { Player } from "../../server/structure/player.js";

describe("Player", () => {
  it("constructs with default flags", () => {
    const p = new Player("id1", "fred");
    expect(p.id).toBe("id1");
    expect(p.username).toBe("fred");
    expect(p.host).toBe(false);
    expect(p.lost).toBe(false);
    expect(p.ready).toBe(false);
    expect(p.board).toBe(null);
    expect(p.spectrum).toEqual([]);
    expect(p.piece).toBe(0);
  });

  it("reset() clears game state", () => {
    const p = new Player("id1", "fred");
    p.host = true;
    p.lost = true;
    p.board = [[1]];
    p.spectrum = [1, 2, 3];
    p.piece = 99;

    p.reset();

    expect(p.piece).toBe(0);
    expect(p.lost).toBe(false);
    expect(p.board).toBe(null);
    expect(p.spectrum).toEqual([]);
    // host should not be reset by reset()
    expect(p.host).toBe(true);
  });
});
