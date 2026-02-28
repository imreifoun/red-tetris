import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SetupUI from "../../client/src/components/SetupUI.jsx";


describe("SetupUI", () => {
  it("shows instructions when room/user not in URL", () => {
    render(<SetupUI />);
    expect(screen.getByText(/Room Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/#room@username/i)).toBeInTheDocument();
  });
});
