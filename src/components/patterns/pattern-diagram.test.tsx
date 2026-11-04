import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PatternDiagram } from "@/components/patterns/pattern-diagram";



const props = {
  content: "classDiagram\n  Context --> Strategy",
  description: "A Context delegates to a Strategy interface.",
};

describe("PatternDiagram", () => {
  it("renders the description as a visible figcaption", () => {
    render(<PatternDiagram {...props} />);
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  it("marks the raw diagram source aria-hidden", () => {
    render(<PatternDiagram {...props} />);
    const pre = screen.getByText((_content, element) =>
      element?.tagName.toLowerCase() === "pre",
    );
    expect(pre).toHaveAttribute("aria-hidden", "true");
  });
});