import type { Pattern } from "./schema";

export const strategy: Pattern = {
  slug: "strategy",
  name: "Strategy",
  category: "behavioral",
  tagline: "Swap interchangeable algorithms behind a common interface.",

  introduction:
    "Strategy lets you define a family of algorithms, encapsulate each one, and make them interchangeable. The client picks a strategy at runtime, but never depends on how that strategy works internally. Replacing conditional branching over algorithm variants with a strategy object makes the algorithm replaceable and the caller simpler.",

  problem:
    "A class needs to support several variants of an algorithm — different compression methods, different sorting criteria, different tax rules per region. If you implement every variant inside one class, you end up with a growing switch statement, a class that is hard to test in isolation, and callers that must know which variant to invoke. Adding a new variant means editing the class and risking a regression in the variants that already worked.",

  solution:
    "Extract each variant into its own class implementing a shared Strategy interface. The calling class holds a reference to a Strategy, delegates the algorithm to it, and never names the concrete implementations. Callers can substitute strategies at runtime, the class shrinks to its real responsibility (orchestration), and each strategy can be unit-tested in isolation.",

  whenToUse: [
    "You have several interchangeable variants of an algorithm and want to choose one at runtime.",
    "You want to replace a switch or if/else chain that branches on algorithm variants.",
    "Strategies need to be tested, shared, or reused independently of the caller.",
    "The algorithm is a policy (pricing, routing, compression) that should be selectable or configurable.",
  ],

  whenNotToUse: [
    "There is exactly one algorithm, and no plausible second one on the roadmap.",
    "The variants differ only in data, not behavior — use a lookup table or configuration instead.",
    "The cost of a new interface, class per variant, and dependency injection outweighs the variation.",
  ],

  analogy:
    "A traveller choosing how to reach the airport — taxi, train, or bus — is the context; the means of transport is the strategy. The trip planner does not care how the traveller gets there, only that the chosen vehicle can carry them.",

  diagram: {
    content: `classDiagram
    class Context {
      -strategy: Strategy
      +setStrategy(Strategy)
      +execute()
    }
    class Strategy {
      <<interface>>
      +algorithm(data)
    }
    class ConcreteStrategyA {
      +algorithm(data)
    }
    class ConcreteStrategyB {
      +algorithm(data)
    }
    Context --> Strategy
    Strategy <|.. ConcreteStrategyA
    Strategy <|.. ConcreteStrategyB`,
    description:
      "UML class diagram: a Context holds a Strategy interface. Two concrete strategies implement the interface. Context delegates algorithm() to whichever strategy is currently set.",
  },

  example: {
    language: "ts",
    code: `interface CompressionStrategy {
  compress(input: Buffer): Promise<Buffer>;
  name: string;
}

class GzipCompression implements CompressionStrategy {
  name = "gzip";
  async compress(input: Buffer) {
    return gzip(input);
  }
}

class BrotliCompression implements CompressionStrategy {
  name = "br";
  async compress(input: Buffer) {
    return brotliCompress(input);
  }
}

class NoCompression implements CompressionStrategy {
  name = "identity";
  async compress(input: Buffer) {
    return input;
  }
}

class AssetPipeline {
  constructor(private strategy: CompressionStrategy) {}

  setStrategy(strategy: CompressionStrategy) {
    this.strategy = strategy;
  }

  async process(asset: Buffer): Promise<Buffer> {
    return this.strategy.compress(asset);
  }
}

// Caller chooses a strategy; AssetPipeline never knows which.
const pipeline = new AssetPipeline(new BrotliCompression());
await pipeline.process(buffer);
pipeline.setStrategy(new GzipCompression());`,
    explanation:
      "AssetPipeline depends only on the CompressionStrategy interface. Each compression algorithm is a self-contained class, testable on its own. Adding Zstd means writing a new class and passing it in — no change to AssetPipeline, no growing switch statement, no risk to existing callers.",
  },

  advantages: [
    "Replaces conditionals over algorithm variants with polymorphic delegation.",
    "Strategies are independently testable and can be swapped at runtime.",
    "New variants are added without modifying the context.",
    "Composition is preferred over inheritance for algorithm variation.",
  ],

  disadvantages: [
    "Callers must know which strategy to supply, or a factory must pick one.",
    "Introduces an interface and one class per variant, even for small algorithms.",
    "Overhead is rarely significant, but on hot paths it is non-zero.",
    "Does not by itself prevent an explosion of strategy classes for combinatorial policies.",
  ],

  related: [
    {
      slug: "state",
      note: "Structurally identical; differs in intent — State transitions are driven by the object itself, Strategy is chosen by the client.",
    },
    {
      slug: "command",
      note: "Both encapsulate behavior behind an interface; Command also carries the parameters and receiver needed to execute it.",
    },
    {
      slug: "template-method",
      note: "Template Method varies parts of an algorithm via inheritance; Strategy varies the whole algorithm via composition.",
    },
  ],
};