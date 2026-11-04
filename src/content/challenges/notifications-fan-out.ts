import type { Challenge } from "./schema";

export const notificationsFanOut: Challenge = {
  slug: "notifications-fan-out",
  patternSlug: "observer",
  difficulty: "beginner",
  scenario:
    "A stock-watchlist dashboard shows live prices. When a price ticks, three independent reactions must fire: the notification bell checks alerts, the chart re-renders the visible ticker, and the analytics service records the sample. New reaction sources are added every quarter.",
  problem:
    "The price feed currently calls each reaction by name — bell.check(), chart.redraw(), analytics.record(). Adding a fourth reaction means editing the feed and knowing about one more subsystem. The feed is becoming the most coupled class in the codebase.",
  codeSnippet: `feed.onTick = (tick) => {
  bell.check(tick);
  chart.redraw(tick);
  analytics.record(tick);
  // next quarter: a 4th line, then a 5th…
};`,
  options: ["observer", "mediator", "command", "strategy"],
  explanation:
    "Observer decouples the feed from its reactions. The feed holds a set of subscribers and calls onPrice() on each; new reactions subscribe themselves. Mediator would centralize coordination logic; the feed here is a broadcaster, not a coordinator. Command turns actions into objects — useful, but the problem is notification, not queuing. Strategy swaps a single algorithm; there are many independent reactions.",
};
