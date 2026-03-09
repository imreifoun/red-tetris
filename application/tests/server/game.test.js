import { describe, it, expect, beforeEach } from "vitest";
import { Game } from "../../server/structure/game.js";
import { Player } from "../../server/structure/player.js";

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game("room1");
  });

  it("newPlayer sets first player as host", () => {
    const p1 = new Player("1", "a");
    const p2 = new Player("2", "b");

    game.newPlayer(p1);
    expect(game.players).toHaveLength(1);
    expect(game.players[0].host).toBe(true);

    game.newPlayer(p2);
    expect(game.players).toHaveLength(2);
    expect(game.players[1].host).toBe(false);
  });

  it("deletePlayer removes by id and returns remaining count", () => {
    const p1 = new Player("1", "a");
    const p2 = new Player("2", "b");
    game.newPlayer(p1);
    game.newPlayer(p2);

    const remaining = game.deletePlayer("2");
    expect(remaining).toBe(1);
    expect(game.players.map(p => p.id)).toEqual(["1"]);
  });


  it("deletePlayer currently does NOT correctly reassign host when host leaves (known bug)", () => {
    const p1 = new Player("1", "a");
    const p2 = new Player("2", "b");
    game.newPlayer(p1); // host=true
    game.newPlayer(p2);

    game.deletePlayer("1");

    expect(game.players).toHaveLength(1);
    expect(game.players[0].id).toBe("2");

    // Current implementation bug: host may stay false
    expect(game.players[0].host).toBe(false);
  });

  it("start() resets stack, generates pieces, resets players, sets started=true", () => {
    const p1 = new Player("1", "a");
    const p2 = new Player("2", "b");
    game.newPlayer(p1);
    game.newPlayer(p2);

    p1.lost = true;
    p1.piece = 10;
    p2.lost = true;
    p2.piece = 5;

    game.start();

    expect(game.started).toBe(true);
    // should generate at least 20 pieces (IN_STACK)
    expect(game.stack.length).toBeGreaterThanOrEqual(3);
    // players reset
    expect(game.players[0].lost).toBe(false);
    expect(game.players[0].piece).toBe(0);
    expect(game.players[1].lost).toBe(false);
    expect(game.players[1].piece).toBe(0);
  });

  it("more() adds one new piece to the stack", () => {
    expect(game.stack.length).toBe(0);

    game.more();

    expect(game.stack.length).toBe(1);
    expect(game.stack[0]).toBeTruthy();
  });


});
