import type { Pattern } from "./schema";

export const observer: Pattern = {
  slug: "observer",
  name: "Observer",
  category: "behavioral",
  tagline: "Notify many subscribers automatically when a subject changes.",

  introduction:
    "Observer defines a one-to-many dependency between a subject and its subscribers, so that when the subject changes state, all its subscribers are notified automatically. The subject holds a list of subscribers and knows nothing about them except that they can be notified — which means new kinds of subscriber can be added at runtime without touching the subject. It is the pattern behind every event emitter, reactive stream, and UI binding.",

  problem:
    "A market data feed publishes price ticks for thousands of tickers. Several consumers care about some of these ticks: a price alert service watching a specific user's thresholds, a portfolio valuation engine recalculating totals on every held ticker, a charting component that redraws the visible ticker, and an analytics service that samples prices for reporting. If the feed directly calls each consumer, it must know each consumer, in each environment, with each environment's slightly different threading model — and adding a new consumer means editing the feed. The feed becomes the most coupled class in the system.",

  solution:
    "Give the subject a `subscribe()` / `unsubscribe()` interface and a list of subscribers. When something changes, the subject iterates its subscribers and calls `onPrice(tick)` on each. Subscribers register themselves — the subject knows only the interface, not who implements it. Adding a new subscriber is a new class, subscribed at composition time; the subject never changes.",

  whenToUse: [
    "One object's state change should notify an unknown or varying number of others.",
    "Subscribers should be able to join or leave at runtime — they are not fixed by the class hierarchy.",
    "The subject should not know the concrete types of its listeners.",
    "Events are broadcast and consumed by independent concerns (alerts, valuation, analytics, UI).",
  ],

  whenNotToUse: [
    "There is exactly one subscriber and it will not change — a direct reference is simpler.",
    "The notification order matters and subscribers must be coordinated — that is Mediator.",
    "Notifications cascade unpredictably across subscribers (A triggers B triggers C), which makes the event graph untraceable — that is a Mediator or an explicit orchestrator problem.",
    "Subscribers must transform the event before others see it — that is a pipeline or an interceptor chain, not Observer.",
  ],

  analogy:
    "A newspaper subscription: you sign up for the paper, and every morning it arrives at your door. The publisher does not need to know your name or why you want it — only that you are a subscriber. You can cancel at any time, and the publisher does not need to reconfigure the printing press to support one fewer reader.",

  diagram: {
    content: `classDiagram
    class MarketDataFeed {
      -subscribers: Set~PriceSubscriber~
      +subscribe(sub)
      +unsubscribe(sub)
      +publish(tick)
    }
    class PriceSubscriber {
      <<interface>>
      +onPrice(tick: Tick)
    }
    class PriceAlertService
    class PortfolioValuation
    class ChartUpdater
    MarketDataFeed --> "*" PriceSubscriber : notifies
    PriceSubscriber <|.. PriceAlertService
    PriceSubscriber <|.. PortfolioValuation
    PriceSubscriber <|.. ChartUpdater`,
    description:
      "UML class diagram: MarketDataFeed holds a set of PriceSubscriber references. Any number of concrete subscribers implement the interface. publish() iterates the set and calls onPrice() on each. The feed never names a concrete subscriber.",
  },

  example: {
    language: "ts",
    code: `interface Tick {
  ticker: string;
  price: number;
  timestamp: number;
}

interface PriceSubscriber {
  onPrice(tick: Tick): void;
}

class MarketDataFeed {
  private readonly subscribers = new Set<PriceSubscriber>();

  subscribe(sub: PriceSubscriber): void {
    this.subscribers.add(sub);
  }

  unsubscribe(sub: PriceSubscriber): void {
    this.subscribers.delete(sub);
  }

  publish(tick: Tick): void {
    for (const sub of this.subscribers) {
      // Subscriber failures must not stop other subscribers.
      try {
        sub.onPrice(tick);
      } catch (err) {
        console.error("subscriber error", err);
      }
    }
  }
}

class PriceAlertService implements PriceSubscriber {
  constructor(
    private readonly userId: string,
    private readonly thresholds: Map<string, number>,
    private readonly notify: (msg: string) => void,
  ) {}

  onPrice(tick: Tick): void {
    const threshold = this.thresholds.get(tick.ticker);
    if (threshold !== undefined && tick.price > threshold) {
      this.notify(\`\${tick.ticker} crossed \${threshold} at \${tick.price}\`);
    }
  }
}

class PortfolioValuation implements PriceSubscriber {
  private readonly holdings: Map<string, number>;

  constructor(holdings: Map<string, number>) {
    this.holdings = holdings;
  }

  onPrice(tick: Tick): void {
    const qty = this.holdings.get(tick.ticker);
    if (qty !== undefined) {
      // recompute total portfolio value
    }
  }
}

const feed = new MarketDataFeed();
const alerts = new PriceAlertService("u-1", new Map([["AAPL", 200]]), console.log);
feed.subscribe(alerts);
feed.subscribe(new PortfolioValuation(new Map([["AAPL", 10]])));

feed.publish({ ticker: "AAPL", price: 201.5, timestamp: Date.now() });`,
    explanation:
      "The feed knows only PriceSubscriber. It can broadcast to any number of subscribers — the alert service, the portfolio valuation, and any new concern added later — without changing. unsubscribe() allows subscribers to detach at runtime (a chart that scrolled off-screen, a user who logged out). The try/catch around each notification ensures one failing subscriber cannot starve the others. This is the core discipline of Observer: broadcast, isolate subscribers, do not depend on them.",
  },

  advantages: [
    "Subject and subscribers are decoupled — the subject knows only the interface.",
    "Subscribers can be added or removed at runtime, without touching the subject.",
    "Broadcast to many independent concerns without the subject orchestrating them.",
    "Subscribers are individually testable — each is called with a tick and asserts its own behavior.",
  ],

  disadvantages: [
    "Subscriber ordering is not guaranteed — one subscriber cannot depend on another having run first.",
    "Errors in one subscriber can be silently swallowed (or must be handled explicitly, as above).",
    "Notifications cascade unpredictably in complex event graphs, making debugging hard.",
    "Memory leaks from forgotten subscribers are easy — subscriber sets hold strong references unless cleaned up.",
  ],

  related: [
    {
      slug: "mediator",
      note: "Both centralize communication. Observer broadcasts from one subject to many subscribers; Mediator centralizes communication among peers. Observer is one-to-many; Mediator is many-to-many through a hub.",
    },
    {
      slug: "command",
      note: "Commands carry actions; Observer carries notifications. A command queue can be observed — the two compose naturally.",
    },
    {
      slug: "state",
      note: "State transitions can trigger Observer notifications (state changed → notify), but State is about behavior changing with state, not about notifying subscribers.",
    },
  ],
};
