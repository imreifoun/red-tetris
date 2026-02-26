import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";

import App from "../../client/src/App.jsx";
import gameReducer from "../../client/src/redux/slice.js";

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "setInterval").mockImplementation(() => 0);
    vi.spyOn(globalThis, "clearInterval").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.location.hash = "";
  });

  it("when hash matches, dispatches setup + socket actions and shows game UI", async () => {
    window.location.hash = "#123@areifoun";

    const store = configureStore({
      reducer: { game: gameReducer },
      middleware: (gDM) => gDM(), // no socket middleware in tests
    });

    const spy = vi.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // UI should appear after setup updates state
    await waitFor(() => {
      expect(screen.getByText("TETRIS")).toBeInTheDocument();
    }, { timeout: 3000 });

    // check the important dispatches happened (spy is active BEFORE render)
    expect(spy.mock.calls.some(([a]) => a.type === "game/setup")).toBe(true);
    expect(spy.mock.calls.some(([a]) => a.type === "socket/connect")).toBe(true);
    expect(spy.mock.calls.some(([a]) => a.type === "socket/join")).toBe(true);
  });
});
