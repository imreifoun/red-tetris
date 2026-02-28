import { describe, it, expect, vi, afterEach } from "vitest";
import { Piece } from "../../server/structure/piece.js";
import { PIECES } from "../../common/logic.js";

describe("Piece", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("randomPiece returns a valid piece key", () => {
    const key = Piece.randomPiece();
    expect(Object.keys(PIECES)).toContain(key);
  });

  it("constructor sets fields based on PIECES map", () => {
    // force flip=0 so no rotation happens
    vi.spyOn(Math, "random").mockReturnValue(0); // flip = 0
    const p = new Piece("T");
    expect(p.type).toBe("T");
    expect(p.color).toBe(PIECES.T.color);
    expect(p.wind).toBe(PIECES.T.wind);
    expect(p.shape).toEqual(PIECES.T.shape);
  });

  it("constructor may rotate shape when flip is truthy", () => {
    // We want:
    // flip = 1  => Math.random()*2 -> 1.x floored => 1
    // range = 1 => Math.random()*5 -> 1.x floored => 1 (one rotation)
    const spy = vi.spyOn(Math, "random");
    spy.mockReturnValueOnce(0.9); // flip=1
    spy.mockReturnValueOnce(0.3); // range=1 (floor(1.5)=1) actually 0.3*5=1.5 -> 1
    // Any further Math.random calls (if any)
    spy.mockReturnValue(0);

    const p = new Piece("L");
    // shape should not equal original (very likely after 1 rotation)
    expect(p.shape).not.toEqual(PIECES.L.shape);
  });
});
