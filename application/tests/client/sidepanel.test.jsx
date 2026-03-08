import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import PlayersUI from "../../client/src/components/PlayersUI.jsx";
import gameReducer from "../../client/src/redux/slice.js";

describe("SidePanelUI (currently PlayersUI)", () => {
  it("renders players title and allows basic render with Provider", () => {
    const store = configureStore({
      reducer: { game: gameReducer },
      preloadedState: {
        game: {
          room: "3693",
          username: "fred",
          started: false,
          players: [],
          stack: [],
          board: Array.from({ length: 20 }, () => Array(10).fill(0)),
        },
      },
      middleware: (gDM) => gDM(), // keep it simple in tests
    });

    render(
      <Provider store={store}>
        <PlayersUI />
      </Provider>
    );

    // assert something that definitely exists in PlayersUI
    expect(screen.getByText(/Players/i)).toBeInTheDocument();
  });
});