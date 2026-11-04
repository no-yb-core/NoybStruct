import type { Pattern } from "./schema";

export const adapter: Pattern = {
  slug: "adapter",
  name: "Adapter",
  category: "structural",
  tagline: "Translate one interface into another the client already expects.",

  introduction:
    "Adapter converts the interface of a class into another interface the client expects. It lets classes work together that otherwise could not because of incompatible interfaces. The adapter owns the translation — every call into the adapter is rewritten into the calls the legacy or third-party code understands — so the client never has to know two APIs at once.",

  problem:
    "A product ships with a modern `AnalyticsTracker` interface — trackEvent(name, props) — used across the entire application. A critical vendor is integrated only through a legacy SDK with a very different shape: `log(message: string, level: number)` and `send()` batched calls. The application cannot be rewritten to the SDK's vocabulary, and the SDK cannot be forked to match the app's. Duplicating the translation at every call site would scatter the mismatch across hundreds of files.",

  solution:
    "Write an `AnalyticsAdapter` that implements `AnalyticsTracker` and holds a reference to the legacy SDK. Each method on the adapter translates one high-level call into the exact sequence of SDK calls needed. The rest of the application depends only on `AnalyticsTracker` — it can be swapped to a fake in tests, and replacing the legacy SDK later means changing only the adapter.",

  whenToUse: [
    "Integrating a third-party or legacy API whose shape you cannot change.",
    "Migrating an interface incrementally — old and new implementations must coexist.",
    "Wrapping an SDK behind a project-owned interface to isolate it for tests or future replacement.",
    "Reusing a class that already works but exposes the wrong shape for your domain.",
  ],

  whenNotToUse: [
    "You own both interfaces — refactor them to a shared shape instead of adapting.",
    "The mismatch is only in a single method — a small wrapper function may be enough.",
    "The adapter would need to leak the wrapped type for callers to use it — the abstraction is failing, not the interface.",
  ],

  analogy:
    "A travel power adapter lets a US laptop plug into a European wall socket. The laptop and the socket are both fine — the adapter rewrites the physical interface between them without touching either.",

  diagram: {
    content: `classDiagram
    class AnalyticsTracker {
      <<interface>>
      +trackEvent(name: string, props: object)
    }
    class AnalyticsAdapter {
      -legacy: LegacySdk
      +trackEvent(name, props)
    }
    class LegacySdk {
      +log(message: string, level: number)
      +send()
    }
    AnalyticsTracker <|.. AnalyticsAdapter
    AnalyticsAdapter --> LegacySdk`,
    description:
      "UML class diagram: AnalyticsAdapter implements the modern AnalyticsTracker interface and delegates to LegacySdk, translating each trackEvent() call into log()+send() sequences. The rest of the application depends only on AnalyticsTracker.",
  },

  example: {
    language: "ts",
    code: `interface AnalyticsTracker {
  trackEvent(name: string, props: Record<string, unknown>): void;
}

// Legacy SDK shape — cannot change, not maintained by us.
class LegacySdk {
  private buffer: string[] = [];

  log(message: string, level: number): void {
    this.buffer.push(JSON.stringify({ message, level }));
  }

  send(): void {
    if (this.buffer.length === 0) return;
    // flush to the vendor endpoint
    this.buffer = [];
  }
}

class AnalyticsAdapter implements AnalyticsTracker {
  private readonly legacy: LegacySdk;

  constructor(legacy: LegacySdk) {
    this.legacy = legacy;
  }

  trackEvent(name: string, props: Record<string, unknown>): void {
    // Translate high-level event to the SDK's two-step API.
    const message = \`event:\${name} \${JSON.stringify(props)}\`;
    this.legacy.log(message, 2); // 2 = INFO in the legacy enum
    this.legacy.send();
  }
}

// Application code depends only on the interface.
const tracker: AnalyticsTracker = new AnalyticsAdapter(new LegacySdk());
tracker.trackEvent("checkout_started", { cartValue: 42.5, currency: "USD" });`,
    explanation:
      "The adapter owns the entire translation between the modern trackEvent() call and the SDK's log()+send() sequence, including the level enum. The rest of the codebase only sees AnalyticsTracker — it can be swapped to a fake in tests, and replacing the SDK later means changing one file. If the SDK changes its log levels, only the adapter is edited.",
  },

  advantages: [
    "Isolates third-party or legacy APIs behind a project-owned interface.",
    "Enables incremental migration — old and new implementations coexist during the transition.",
    "Tests can substitute a fake tracker without touching the legacy SDK.",
    "Keeps the caller's domain vocabulary, not the vendor's.",
  ],

  disadvantages: [
    "Adds an indirection layer for every adapted call.",
    "Some impedance mismatches cannot be fully hidden — an adapter can leak complexity when the interfaces are truly incompatible.",
    "Encourages keeping bad legacy APIs around — sometimes the right move is to rewrite, not to adapt.",
  ],

  related: [
    {
      slug: "facade",
      note: "Adapter changes the interface; Facade simplifies a group of interfaces. Adapter preserves a client's expectations, Facade hides an entire subsystem.",
    },
    {
      slug: "bridge",
      note: "Both decouple interfaces from implementations; Adapter adapts a foreign interface to an expected one, Bridge splits a designed interface into two independently-varying halves.",
    },
    {
      slug: "decorator",
      note: "Both wrap an object. Decorator adds behavior while keeping the interface; Adapter changes the interface.",
    },
  ],
};