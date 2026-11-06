import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedCounter } from "./animated-counter";

describe("AnimatedCounter", () => {
  it("renders the initial numeric value", () => {
    render(<AnimatedCounter value={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders with prefix and suffix", () => {
    render(<AnimatedCounter value={50} prefix="+" suffix=" XP" />);
    expect(screen.getByText("+50 XP")).toBeInTheDocument();
  });

  it("formats large numbers with locale commas", () => {
    render(<AnimatedCounter value={12500} suffix=" XP" />);
    expect(screen.getByText("12,500 XP")).toBeInTheDocument();
  });
});
