import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import reducer from "../../client/src/redux/slice";
import GameOverUI from "../../client/src/components/GameOverUI.jsx";

describe("GameOverUI", () => {
  it("renders game over screen", () => {
    const store = configureStore({
      reducer: {
        game: reducer
      }
    });

    render(
      <Provider store={store}>
        <GameOverUI />
      </Provider>
    );

    expect(screen.getByText(/game over/i)).toBeInTheDocument();
  });
});