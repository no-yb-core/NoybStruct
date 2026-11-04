import type { Pattern } from "./schema";

export const state: Pattern = {
  slug: "state",
  name: "State",
  category: "behavioral",
  tagline: "Change an object's behavior as its internal state changes.",

  introduction:
    "State lets an object alter its behavior when its internal state changes. The object appears to change class — its methods behave differently depending on which state object it currently holds. The essential ingredient is that transitions between states are driven by the object (or its states), not by the client: the caller says `order.pay()`, not `order.setState(new PaidState())`. This distinguishes State from Strategy, where the client chooses the algorithm.",

  problem:
    "An order has a lifecycle: pending → paid → shipped → delivered, with cancellations allowed from pending and paid, not from shipped or delivered. Every order method — `pay()`, `ship()`, `cancel()`, `refund()` — must check the current status before doing anything, and every new status means editing every method. The order class grows into a list of conditional guards that obscure the lifecycle. The state machine exists only in the collective memory of these conditionals.",

  solution:
    "Introduce an `OrderState` interface with the lifecycle methods. Concrete states — `PendingState`, `PaidState`, `ShippedState`, `DeliveredState`, `CancelledState` — implement the allowed transitions and throw or reject the disallowed ones. `Order` holds a `state` reference and delegates each method to it. Transitions happen inside the state objects (the state constructs the next state and hands it back to the order). Callers see `order.pay()`, not `order.setState(new PaidState())`.",

  whenToUse: [
    "An object's behavior depends on its state, and the lifecycle is explicit and non-trivial.",
    "Transitions between states should be centrally defined, not scattered across conditionals.",
    "New states should be addable without editing every method on the context.",
    "The lifecycle is the domain's core — an order, a document workflow, a connection, a job.",
  ],

  whenNotToUse: [
    "There are two states and one transition — a boolean is enough and simpler.",
    "The state is immutable — a value-based field with no behavioral transitions is just data.",
    "The client must control which state is active — that is Strategy, not State.",
    "The states share no common interface — the pattern requires the abstraction to hold.",
  ],

  analogy:
    "A vending machine: when it is 'empty', pressing the button says 'restock me'. When it is 'with-coins', pressing the button dispenses. When it is 'out-of-order', pressing the button does nothing. The machine's behavior changes with its state, and the state transitions happen as a result of the button — not because the customer chose a different machine.",

  diagram: {
    content: `classDiagram
    class Order {
      -state: OrderState
      +pay()
      +ship()
      +cancel()
      +transitionTo(next: OrderState)
    }
    class OrderState {
      <<interface>>
      +pay(order)
      +ship(order)
      +cancel(order)
    }
    class PendingState
    class PaidState
    class ShippedState
    class DeliveredState
    class CancelledState
    Order --> OrderState
    OrderState <|.. PendingState
    OrderState <|.. PaidState
    OrderState <|.. ShippedState
    OrderState <|.. DeliveredState
    OrderState <|.. CancelledState`,
    description:
      "UML class diagram: Order holds an OrderState and exposes lifecycle methods that delegate. Each concrete state implements the allowed transitions and rejects the disallowed ones. Transitions are initiated by the state objects, which ask the order to change to the next state.",
  },

  example: {
    language: "ts",
    code: `interface OrderState {
  pay(order: Order): void;
  ship(order: Order): void;
  cancel(order: Order): void;
}

class Order {
  private state: OrderState;

  constructor(initial: OrderState = new PendingState()) {
    this.state = initial;
  }

  pay(): void { this.state.pay(this); }
  ship(): void { this.state.ship(this); }
  cancel(): void { this.state.cancel(this); }

  /** @internal — states call this to transition. */
  transitionTo(next: OrderState): void {
    this.state = next;
  }

  /** @internal — for state objects to inspect. */
  currentStateName(): string {
    return this.state.constructor.name;
  }
}

class PendingState implements OrderState {
  pay(order: Order): void { order.transitionTo(new PaidState()); }
  ship(): void { throw new Error("cannot ship an unpaid order"); }
  cancel(order: Order): void { order.transitionTo(new CancelledState()); }
}

class PaidState implements OrderState {
  pay(): void { throw new Error("order already paid"); }
  ship(order: Order): void { order.transitionTo(new ShippedState()); }
  cancel(order: Order): void { order.transitionTo(new CancelledState()); }
}

class ShippedState implements OrderState {
  pay(): void { throw new Error("order already paid"); }
  ship(): void { throw new Error("order already shipped"); }
  cancel(): void { throw new Error("cannot cancel a shipped order"); }
}

class DeliveredState implements OrderState {
  pay(): void { throw new Error("order already delivered"); }
  ship(): void { throw new Error("order already delivered"); }
  cancel(): void { throw new Error("cannot cancel a delivered order"); }
}

class CancelledState implements OrderState {
  pay(): void { throw new Error("order was cancelled"); }
  ship(): void { throw new Error("order was cancelled"); }
  cancel(): void { throw new Error("order already cancelled"); }
}

// Caller says what happened — not which state to move to.
const order = new Order();
order.pay();     // Pending → Paid
order.ship();    // Paid → Shipped
// order.cancel(); // throws — Shipped state disallows cancel`,
    explanation:
      "The Order class has no conditionals — its methods delegate to the current state. Each state decides which transitions are allowed and constructs the next state. The caller never names a state; it says 'pay', 'ship', 'cancel', and the state machine enforces the lifecycle. Adding a 'refund' transition from Delivered but not from Shipped is one method added to two states — no change to Order, no change to existing states. This is what State buys that a boolean field cannot.",
  },

  advantages: [
    "Lifecycle transitions live in one place per state — no scattered conditionals.",
    "Invalid transitions are rejected at the state level, not checked repeatedly at the edges.",
    "Adding a new state is a new class, not an edit to a growing switch.",
    "The state machine is explicit and testable — each state is tested independently.",
  ],

  disadvantages: [
    "Introduces a class per state — the class count grows with the lifecycle complexity.",
    "State transitions are internal — callers may be surprised by what `order.pay()` changes.",
    "State objects may need access to context internals (like `transitionTo` above), so the boundary is not always clean.",
    "For small lifecycles, State is more machinery than needed.",
  ],

  related: [
    {
      slug: "strategy",
      note: "Structurally identical — an interface and a delegate — but the intent differs. Strategy is chosen by the client; State is chosen by the object (or its states) in response to its own methods.",
    },
    {
      slug: "observer",
      note: "State transitions often trigger Observer notifications — an order moving to Paid tells the email service, the analytics service, etc. State and Observer compose naturally.",
    },
    {
      slug: "memento",
      note: "Memento captures the object's state for restoration; State defines what the state *does*. A Memento snapshot could capture the current State object reference, but the two solve different problems.",
    },
    {
      slug: "singleton",
      note: "Stateless states (a ShippedState with no fields) can be shared as singletons — the Flyweight pattern applied to State objects. Useful when many orders exist and the state set is small.",
    },
  ],
};
