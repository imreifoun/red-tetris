import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SidePanelUI from "../../client/src/components/PlayersUI.jsx";

describe("SidePanelUI", () => {
  it("renders next, score, and controls lines", () => {
    render(<SidePanelUI />);

    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();

    expect(screen.getByText(/Hard drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Soft drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Rotate/i)).toBeInTheDocument();
    expect(screen.getByText(/Move/i)).toBeInTheDocument();
  });
});
