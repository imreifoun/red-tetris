import { describe, it, expect, vi } from "vitest";

describe("server/index.js entry", () => {
  it("starts server by calling createTetrisServer", async () => {
    vi.resetModules();

    const start = vi.fn(() => Promise.resolve({ httpServer: { close: vi.fn() } }));

    vi.doMock("../../server/app.js", () => ({
      createTetrisServer: start,
    }));

    await import("../../server/index.js");

    expect(start).toHaveBeenCalled();
  });
});
