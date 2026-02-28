import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import gameReducer from "../../client/src/redux/slice.js";

export function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({
    reducer: { game: gameReducer },
    preloadedState,
    middleware: (gDM) => gDM(), // IMPORTANT: no socket middleware in tests
  });

  const result = render(<Provider store={store}>{ui}</Provider>);
  return { store, ...result };
}
