import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransitionLink } from "./transition-link";

// Mock next/navigation useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("TransitionLink", () => {
  it("renders an anchor element with expected href", () => {
    render(<TransitionLink href="/library">Explore Codex</TransitionLink>);
    const link = screen.getByRole("link", { name: "Explore Codex" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/library");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <TransitionLink href="/workshop" onClick={handleClick}>
        Workshop
      </TransitionLink>,
    );
    const link = screen.getByRole("link", { name: "Workshop" });
    await user.click(link);
    expect(handleClick).toHaveBeenCalled();
  });
});
