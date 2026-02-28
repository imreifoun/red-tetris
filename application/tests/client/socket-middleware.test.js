import { describe, it, expect, vi, beforeEach } from "vitest";

describe("socket middleware", () => {
  let socket;
  let ioMock;

  beforeEach(async () => {
    vi.resetModules();

    socket = {
      disconnect: vi.fn(),
      on: vi.fn(),
      emit: vi.fn(),
    };

    ioMock = vi.fn(() => socket);

    vi.doMock("socket.io-client", () => ({
      default: ioMock,
    }));
  });

  function makeStore() {
    return { dispatch: vi.fn(), getState: vi.fn(() => ({})) };
  }

  it("connect creates socket and registers update listener", async () => {
    const { default: socketMiddleware } = await import("../../client/src/middleware/socket.js");

    const store = makeStore();
    const next = vi.fn();
    const mw = socketMiddleware(store)(next);

    mw({ type: "socket/connect" });

    expect(ioMock).toHaveBeenCalledWith("http://127.0.0.1:4044");
    expect(socket.on).toHaveBeenCalled();
    expect(socket.on.mock.calls.some((c) => c[0] === "update")).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  it("join emits join after connect", async () => {
    const { default: socketMiddleware } = await import("../../client/src/middleware/socket.js");

    const store = makeStore();
    const next = vi.fn();
    const mw = socketMiddleware(store)(next);

    mw({ type: "socket/connect" });
    mw({ type: "socket/join", payload: { room: "3693", username: "fred" } });

    expect(socket.emit.mock.calls.some((c) => c[0] === "join")).toBe(true);
    expect(
      socket.emit.mock.calls.some((c) => c[0] === "join" && c[1]?.room === "3693" && c[1]?.username === "fred")
    ).toBe(true);
  });

  it("start emits start after connect", async () => {
    const { default: socketMiddleware } = await import("../../client/src/middleware/socket.js");

    const store = makeStore();
    const next = vi.fn();
    const mw = socketMiddleware(store)(next);

    mw({ type: "socket/connect" });
    mw({ type: "socket/start", payload: { room: "3693" } });

    expect(
      socket.emit.mock.calls.some((c) => c[0] === "start" && c[1]?.room === "3693")
    ).toBe(true);
  });

  it("update event dispatches redux update action", async () => {
    const { default: socketMiddleware } = await import("../../client/src/middleware/socket.js");
    const { update } = await import("../../client/src/redux/slice.js");

    const store = makeStore();
    const next = vi.fn();
    const mw = socketMiddleware(store)(next);

    mw({ type: "socket/connect" });

    const handler = socket.on.mock.calls.find((c) => c[0] === "update")?.[1];
    expect(handler).toBeTypeOf("function");

    handler({ players: ["x"], started: true });

    expect(store.dispatch).toHaveBeenCalledWith(update({ players: ["x"], started: true }));
  });
});
