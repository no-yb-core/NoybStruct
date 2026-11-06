"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bell, Cpu, Layers, Send } from "lucide-react";

type PatternTab = "strategy" | "observer" | "factory";

export function InteractiveHeroDemo() {
  const [activeTab, setActiveTab] = useState<PatternTab>("strategy");

  // Strategy Demo state
  const [strategy, setStrategy] = useState<"express" | "ground" | "freight">(
    "express",
  );

  // Observer Demo state
  const [events, setEvents] = useState<
    { id: string; name: string; time: string }[]
  >([]);
  const [emitting, setEmitting] = useState(false);

  // Factory Demo state
  const [factoryType, setFactoryType] = useState<"pdf" | "csv" | "json">(
    "json",
  );

  const handleEmitObserver = () => {
    if (emitting) return;
    setEmitting(true);
    const id = Math.random().toString(36).slice(2, 7);
    const now = new Date().toLocaleTimeString();
    setEvents((prev) => [
      { id, name: "OrderCompleted", time: now },
      ...prev.slice(0, 3),
    ]);
    setTimeout(() => {
      setEmitting(false);
    }, 600);
  };

  return (
    <div className="relative mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-md border border-border bg-card/80 p-5 sm:p-7 shadow-xl backdrop-blur-sm">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-forest animate-pulse dark:bg-gold" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Interactive Architecture Simulation
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Patterns in Motion
          </h3>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 rounded-sm border border-border bg-secondary/60 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("strategy")}
            className={`rounded-xs px-3 py-1.5 font-medium transition-all ${
              activeTab === "strategy"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Strategy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("observer")}
            className={`rounded-xs px-3 py-1.5 font-medium transition-all ${
              activeTab === "observer"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Observer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("factory")}
            className={`rounded-xs px-3 py-1.5 font-medium transition-all ${
              activeTab === "factory"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Factory
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="pt-6">
        {activeTab === "strategy" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Visual Node Diagram */}
            <div className="flex flex-col justify-between rounded-sm border border-border/80 bg-secondary/30 p-4">
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  1. Runtime Strategy Selection
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStrategy("express")}
                    className={`rounded border p-2 text-left text-xs transition-all ${
                      strategy === "express"
                        ? "border-forest bg-forest/10 text-foreground font-semibold dark:border-gold dark:bg-gold/10"
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold">Express</div>
                    <div className="text-[10px] text-muted-foreground">
                      Next-day air
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrategy("ground")}
                    className={`rounded border p-2 text-left text-xs transition-all ${
                      strategy === "ground"
                        ? "border-forest bg-forest/10 text-foreground font-semibold dark:border-gold dark:bg-gold/10"
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold">Ground</div>
                    <div className="text-[10px] text-muted-foreground">
                      3-5 days
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrategy("freight")}
                    className={`rounded border p-2 text-left text-xs transition-all ${
                      strategy === "freight"
                        ? "border-forest bg-forest/10 text-foreground font-semibold dark:border-gold dark:bg-gold/10"
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold">Freight</div>
                    <div className="text-[10px] text-muted-foreground">
                      Bulk pallet
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Diagram Nodes */}
              <div className="my-5 flex items-center justify-between gap-2 text-xs">
                <div className="flex-1 rounded border border-border bg-card p-2.5 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Client Context
                  </span>
                  <span className="font-semibold font-mono">OrderService</span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <motion.div
                  key={strategy}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="flex-1 rounded border border-forest bg-forest/10 p-2.5 text-center shadow-xs dark:border-gold dark:bg-gold/10"
                >
                  <span className="text-[10px] font-mono text-forest dark:text-gold block">
                    Active Strategy
                  </span>
                  <span className="font-semibold font-mono capitalize">
                    {strategy}Shipping
                  </span>
                </motion.div>
              </div>

              {/* Live Output */}
              <div className="rounded border border-border/80 bg-background/80 p-3 text-xs">
                <div className="flex justify-between text-muted-foreground text-[11px] font-mono">
                  <span>Computed Cost:</span>
                  <span className="font-bold text-foreground">
                    {strategy === "express"
                      ? "$48.50"
                      : strategy === "ground"
                        ? "$14.20"
                        : "$6.80"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px] font-mono mt-1">
                  <span>Transit Time:</span>
                  <span className="font-bold text-foreground">
                    {strategy === "express"
                      ? "24 hours"
                      : strategy === "ground"
                        ? "3 business days"
                        : "10-14 days"}
                  </span>
                </div>
              </div>
            </div>

            {/* Code Implementation snippet */}
            <div className="flex flex-col justify-between rounded-sm border border-border/80 bg-background/60 p-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2 text-[11px] text-muted-foreground">
                <span>strategy-dispatch.ts</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                  Polymorphic
                </span>
              </div>
              <pre className="my-3 overflow-x-auto text-[11px] leading-relaxed text-foreground/90">
                <code>{`// Client delegates dynamically:
class OrderService {
  constructor(private strategy: ShippingStrategy) {}

  calculate(order: Order) {
    // Injected at runtime:
    return this.strategy.quote(order);
  }
}

// Active: ${strategy === "express" ? "ExpressShippingStrategy" : strategy === "ground" ? "GroundShippingStrategy" : "FreightShippingStrategy"}`}</code>
              </pre>
              <p className="text-[11px] font-sans text-muted-foreground">
                Allows swapping algorithms independently from clients that use
                them.
              </p>
            </div>
          </div>
        )}

        {activeTab === "observer" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-sm border border-border/80 bg-secondary/30 p-4">
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  1. Subject Broadcast
                </span>
                <button
                  type="button"
                  onClick={handleEmitObserver}
                  disabled={emitting}
                  className="flex w-full items-center justify-center gap-2 rounded bg-forest px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-gold dark:text-ink"
                >
                  <Send
                    className={`size-3.5 ${emitting ? "animate-spin" : ""}`}
                  />
                  <span>Publish &ldquo;OrderCompleted&rdquo; Event</span>
                </button>
              </div>

              {/* Observers listening */}
              <div className="my-4 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                  Subscribed Observers (3)
                </span>
                <div className="grid gap-2">
                  <div
                    className={`flex items-center justify-between rounded border p-2 text-xs transition-all ${
                      emitting
                        ? "border-forest bg-forest/10 scale-[1.01] dark:border-gold dark:bg-gold/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="size-3.5 text-forest dark:text-gold" />
                      <span className="font-mono font-medium">
                        NotificationService
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      SMS / Email
                    </span>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded border p-2 text-xs transition-all ${
                      emitting
                        ? "border-forest bg-forest/10 scale-[1.01] dark:border-gold dark:bg-gold/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="size-3.5 text-forest dark:text-gold" />
                      <span className="font-mono font-medium">
                        AnalyticsLedger
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Metrics pipeline
                    </span>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded border p-2 text-xs transition-all ${
                      emitting
                        ? "border-forest bg-forest/10 scale-[1.01] dark:border-gold dark:bg-gold/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="size-3.5 text-forest dark:text-gold" />
                      <span className="font-mono font-medium">
                        InventoryService
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Stock decrement
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded border border-border/80 bg-background/80 p-2.5 text-xs">
                <span className="font-mono text-[10px] text-muted-foreground block">
                  Real-time Broadcast Log:
                </span>
                {events.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">
                    Click &ldquo;Publish&rdquo; to broadcast an event.
                  </span>
                ) : (
                  <div className="mt-1 space-y-1">
                    {events.map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between font-mono text-[10px]"
                      >
                        <span className="text-forest dark:text-gold">
                          ✓ {e.name}
                        </span>
                        <span className="text-muted-foreground">{e.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-sm border border-border/80 bg-background/60 p-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2 text-[11px] text-muted-foreground">
                <span>observer-pattern.ts</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                  One-to-Many
                </span>
              </div>
              <pre className="my-3 overflow-x-auto text-[11px] leading-relaxed text-foreground/90">
                <code>{`class OrderSubject {
  private observers: Observer[] = [];

  attach(observer: Observer) {
    this.observers.push(observer);
  }

  notify(event: OrderEvent) {
    // Decoupled broadcast:
    for (const observer of this.observers) {
      observer.update(event);
    }
  }
}`}</code>
              </pre>
              <p className="text-[11px] font-sans text-muted-foreground">
                Defines a subscription mechanism to notify multiple objects
                automatically.
              </p>
            </div>
          </div>
        )}

        {activeTab === "factory" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-sm border border-border/80 bg-secondary/30 p-4">
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  1. Creator Requested Type
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFactoryType("json")}
                    className={`rounded border p-2 text-left text-xs transition-all ${
                      factoryType === "json"
                        ? "border-forest bg-forest/10 text-foreground font-semibold dark:border-gold dark:bg-gold/10"
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold">JSON</div>
                    <div className="text-[10px] text-muted-foreground">
                      Raw API feed
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFactoryType("csv")}
                    className={`rounded border p-2 text-left text-xs transition-all ${
                      factoryType === "csv"
                        ? "border-forest bg-forest/10 text-foreground font-semibold dark:border-gold dark:bg-gold/10"
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold">CSV</div>
                    <div className="text-[10px] text-muted-foreground">
                      Tabular sheet
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFactoryType("pdf")}
                    className={`rounded border p-2 text-left text-xs transition-all ${
                      factoryType === "pdf"
                        ? "border-forest bg-forest/10 text-foreground font-semibold dark:border-gold dark:bg-gold/10"
                        : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold">PDF</div>
                    <div className="text-[10px] text-muted-foreground">
                      Print dossier
                    </div>
                  </button>
                </div>
              </div>

              {/* Factory Instantiation Node */}
              <div className="my-5 flex items-center justify-between gap-2 text-xs">
                <div className="flex-1 rounded border border-border bg-card p-2.5 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Creator Factory
                  </span>
                  <span className="font-semibold font-mono">ReportFactory</span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <motion.div
                  key={factoryType}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="flex-1 rounded border border-forest bg-forest/10 p-2.5 text-center shadow-xs dark:border-gold dark:bg-gold/10"
                >
                  <span className="text-[10px] font-mono text-forest dark:text-gold block">
                    Concrete Product
                  </span>
                  <span className="font-semibold font-mono uppercase">
                    {factoryType}Exporter
                  </span>
                </motion.div>
              </div>

              <div className="rounded border border-border/80 bg-background/80 p-3 text-xs">
                <div className="flex justify-between text-muted-foreground text-[11px] font-mono">
                  <span>MIME Encoding:</span>
                  <span className="font-bold text-foreground">
                    {factoryType === "json"
                      ? "application/json"
                      : factoryType === "csv"
                        ? "text/csv"
                        : "application/pdf"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[11px] font-mono mt-1">
                  <span>Compression:</span>
                  <span className="font-bold text-foreground">
                    {factoryType === "json"
                      ? "Gzip chunked"
                      : factoryType === "csv"
                        ? "UTF-8 CRLF"
                        : "Vector PostScript"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-sm border border-border/80 bg-background/60 p-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2 text-[11px] text-muted-foreground">
                <span>factory-method.ts</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                  Creational
                </span>
              </div>
              <pre className="my-3 overflow-x-auto text-[11px] leading-relaxed text-foreground/90">
                <code>{`abstract class ReportCreator {
  // Factory Method:
  abstract createExporter(): Exporter;

  exportData(data: Data) {
    const exporter = this.createExporter();
    return exporter.render(data);
  }
}

// Subclasses decide class instantiation.`}</code>
              </pre>
              <p className="text-[11px] font-sans text-muted-foreground">
                Delegates object creation to subclasses without coupling clients
                to concrete classes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
