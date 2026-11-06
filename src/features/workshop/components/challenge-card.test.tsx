import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ChallengeCard } from "./challenge-card";
import type { Challenge } from "@/content/challenges/schema";

const sampleChallenge: Challenge = {
  slug: "notifications-fan-out",
  difficulty: "beginner",
  patternSlug: "observer",
  scenario: "Decoupling event dispatchers",
  problem:
    "Order service is tightly coupled to 5 third-party notification APIs.",
  codeSnippet: "class OrderService {}",
  options: ["observer", "strategy", "adapter", "factory-method"],
  explanation: "Observer allows decoupled pub/sub events.",
};

const patternNames: Record<string, string> = {
  observer: "Observer",
  strategy: "Strategy",
  adapter: "Adapter",
  "factory-method": "Factory Method",
};

describe("ChallengeCard keyboard shortcuts", () => {
  it("selects options via keys 1, 2, 3, 4", async () => {
    const handleSelect = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <ChallengeCard
        challenge={sampleChallenge}
        options={sampleChallenge.options}
        patternNames={patternNames}
        phase="choosing"
        selectedPatternSlug={null}
        submitted={undefined}
        evaluation={undefined}
        onSelect={handleSelect}
        onSubmit={handleSubmit}
        onNext={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    fireEvent.keyDown(window, { key: "1" });
    expect(handleSelect).toHaveBeenCalledWith("observer");

    fireEvent.keyDown(window, { key: "2" });
    expect(handleSelect).toHaveBeenCalledWith("strategy");

    fireEvent.keyDown(window, { key: "3" });
    expect(handleSelect).toHaveBeenCalledWith("adapter");

    fireEvent.keyDown(window, { key: "4" });
    expect(handleSelect).toHaveBeenCalledWith("factory-method");
  });

  it("submits answer on Enter when an option is selected", async () => {
    const handleSubmit = vi.fn();

    render(
      <ChallengeCard
        challenge={sampleChallenge}
        options={sampleChallenge.options}
        patternNames={patternNames}
        phase="choosing"
        selectedPatternSlug="observer"
        submitted={undefined}
        evaluation={undefined}
        onSelect={vi.fn()}
        onSubmit={handleSubmit}
        onNext={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    fireEvent.keyDown(window, { key: "Enter" });
    expect(handleSubmit).toHaveBeenCalled();
  });
});
