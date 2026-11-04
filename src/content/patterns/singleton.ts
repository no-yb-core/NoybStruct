import type { Pattern } from "./schema";

export const singleton: Pattern = {
  slug: "singleton",
  name: "Singleton",
  category: "creational",
  tagline: "Guarantee one instance of a class with a controlled access point.",

  introduction:
    "Singleton ensures a class has exactly one instance and provides a global access point to it. It is the most misused GoF pattern: in most modern applications, dependency injection is preferable, and 'global state via a static' is an antipattern. Singleton earns its place only when the resource is genuinely unique per process (a configuration snapshot, an in-process logger) and when a global access point is genuinely desired.",

  problem:
    "A process needs one canonical, read-only configuration object derived from environment variables and used by dozens of modules. Each module could construct its own, but then every module pays the load cost, they can diverge if the environment changes mid-run, and there is no single place to refresh or inspect it. A shared global variable works but breaks testability — every test sees the same mutable value.",

  solution:
    "Give the class a private constructor and a static `getInstance()` that lazily constructs and caches the instance on first call. Callers obtain the instance through `getInstance()` and never construct one directly. If tests need isolation, they inject a stub via a setter or construct the class through a test-only factory.",

  whenToUse: [
    "Exactly one instance must exist per process, and multiple would cause incorrect behavior.",
    "The instance is expensive to construct and must be reused (a configuration snapshot loaded once).",
    "A single access point is genuinely desired by callers, not imposed by them.",
    "The resource cannot be safely duplicated (hardware handles, process-wide caches).",
  ],

  whenNotToUse: [
    "The resource can be instantiated per request — DI with a request-scoped container is cleaner.",
    "You want convenience access, not uniqueness — a module-level export is simpler and equally testable.",
    "Multiple instances would be correct — passing them explicitly is preferable.",
    "The instance holds mutable state shared across threads or async tasks — race conditions are hard to reason about and rare to catch.",
  ],

  analogy:
    "A printing press in a small office: there is exactly one press, and everyone uses the same one because a second press would be wasteful and would produce inconsistent output. A larger print shop with multiple presses does not need a Singleton — it needs a print queue.",

  diagram: {
    content: `classDiagram
    class AppConfig {
      -instance: AppConfig
      -constructor()
      +getInstance() AppConfig
      +apiUrl: string
      +logLevel: LogLevel
      +featureFlags: ReadonlyMap
    }
    AppConfig --> AppConfig : caches single instance`,
    description:
      "UML class diagram: AppConfig has a private constructor and a static getInstance() that lazily creates and returns the one instance. Callers never call the constructor; they hold the shared instance.",
  },

  example: {
    language: "ts",
    code: `type LogLevel = "debug" | "info" | "warn" | "error";

class AppConfig {
  private static instance: AppConfig | undefined;

  private constructor(
    readonly apiUrl: string,
    readonly logLevel: LogLevel,
    readonly featureFlags: Readonly<Record<string, boolean>>,
  ) {}

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = AppConfig.load();
    }
    return AppConfig.instance;
  }

  /** @internal — for tests only. Do not call in application code. */
  static _resetForTests(): void {
    AppConfig.instance = undefined;
  }

  private static load(): AppConfig {
    return new AppConfig(
      process.env.API_URL ?? "http://localhost:3000",
      (process.env.LOG_LEVEL as LogLevel) ?? "info",
      JSON.parse(process.env.FEATURE_FLAGS ?? "{}"),
    );
  }
}

// Anywhere in the application:
const config = AppConfig.getInstance();
fetch(\`\${config.apiUrl}/v1/users\`);

// In a test:
beforeEach(() => AppConfig._resetForTests());`,
    explanation:
      "The constructor is private, so the only way to obtain an AppConfig is getInstance(), which loads it once from the environment and caches it. Every caller shares the same snapshot — no divergence, no repeated I/O. The _resetForTests() escape hatch lets each test isolate itself without leaking the singleton into the next test, which is the main practical mitigation for Singleton's testability problem.",
  },

  advantages: [
    "Guarantees a single instance by construction.",
    "Lazily loads expensive state on first use, not at module load.",
    "A single access point makes it easy to inspect or refresh the resource in one place.",
    "Simple to implement in languages with static members.",
  ],

  disadvantages: [
    "Introduces global state — any module can call getInstance() and become silently coupled to it.",
    "Complicates testing: state persists between tests unless a reset hook exists.",
    "Prevents per-test configuration unless specifically engineered for it.",
    "The laziness is one-shot; a Singleton loaded from a bad environment can only be corrected by restart.",
  ],

  related: [
    {
      slug: "abstract-factory",
      note: "Abstract Factory is often implemented as a Singleton to guarantee one active family per process.",
    },
    {
      slug: "facade",
      note: "A Facade is sometimes a Singleton — one instance exposing a simplified surface — but the two patterns solve different problems.",
    },
    {
      slug: "flyweight",
      note: "Flyweight shares instances among many callers but does not restrict their number; Singleton restricts the number to one.",
    },
  ],
};
