import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "../../client/src/redux/slice.js";
import PlayersUI from "../../client/src/components/PlayersUI.jsx";

function renderWithGameState(gameState) {
  const store = configureStore({
    reducer: { game: reducer },
    preloadedState: { game: gameState },
  });

  return render(
    <Provider store={store}>
      <PlayersUI />
    </Provider>
  );
}

function makeBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

describe("PlayersUI branches", () => {
  it("shows Start Game button when current user is host and game not started", () => {
    renderWithGameState({
      room: "123",
      username: "fred",
      started: false,
      players: [
        { id: "1", username: "fred", host: true, score: 0, spectrum: Array(10).fill(0) },
      ],
      board: makeBoard(),
      stack: [],
      piece: 0,
      score: 0,
      spec: [],
      loss: false,
      game_over: false,
    });

    expect(screen.getByRole("button", { name: /start game/i })).toBeInTheDocument();
  });

  it("hides Start Game button when game already started, even if current user is host", () => {
    renderWithGameState({
      room: "123",
      username: "fred",
      started: true,
      players: [
        { id: "1", username: "fred", host: true, score: 0, spectrum: Array(10).fill(0) },
      ],
      board: makeBoard(),
      stack: [],
      piece: 0,
      score: 0,
      spec: [],
      loss: false,
      game_over: false,
    });

    expect(screen.queryByRole("button", { name: /start game/i })).toBeNull();
  });

  it("hides Start Game button when current user is not host and game not started", () => {
    renderWithGameState({
      room: "123",
      username: "fred",
      started: false,
      players: [
        { id: "1", username: "fred", host: false, score: 0, spectrum: Array(10).fill(0) },
      ],
      board: makeBoard(),
      stack: [],
      piece: 0,
      score: 0,
      spec: [],
      loss: false,
      game_over: false,
    });

    expect(screen.queryByRole("button", { name: /start game/i })).toBeNull();
  });
});