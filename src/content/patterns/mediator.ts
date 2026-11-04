import type { Pattern } from "./schema";

export const mediator: Pattern = {
  slug: "mediator",
  name: "Mediator",
  category: "behavioral",
  tagline: "Centralize many-to-many communication through one hub object.",

  introduction:
    "Mediator defines an object that encapsulates how a set of objects interact. Peers do not reference each other directly; they reference the mediator, which is responsible for coordinating them. When many components need to react to each other — form fields that validate together, dialog buttons that enable based on multiple inputs — direct peer references turn an n×n interaction graph into an unmaintainable web. Mediator replaces it with a star: every peer knows one hub, and the hub knows every peer.",

  problem:
    "A signup dialog has a name field, an email field, a password field, a strength indicator, a terms checkbox, a submit button, and a cancel button. The submit button should be enabled only when name is non-empty, email contains '@', password meets policy, and terms is checked. The password strength updates as the password changes and disables submit on 'weak'. Direct wiring: each field holds references to the other six and updates them on change. The result is a component that must know every other component's API, is impossible to test in isolation, and breaks every time a field is added.",

  solution:
    "Introduce a `SignupMediator` that holds references to all the peers and implements the coordination: `onFieldChanged()` re-evaluates every constraint and updates the relevant peers. Each peer — fields, checkbox, buttons — takes the mediator in its constructor and calls `mediator.onFieldChanged()` on input. Peers no longer reference each other; they reference only the mediator. Adding a new field is one peer class and one method on the mediator. Testing a peer is independent of the others — you inject a fake mediator.",

  whenToUse: [
    "Many objects communicate in complex, changing patterns — n-to-n interactions are hard to reason about.",
    "Coordination logic is scattered across peers and needs a home.",
    "Peers should not know about each other, only about the coordination protocol.",
    "The interaction pattern is likely to change — a mediator localizes the change.",
  ],

  whenNotToUse: [
    "There are two objects — a direct reference is simpler and clearer.",
    "The interaction is a simple pipeline — a Chain of Responsibility fits better.",
    "The mediator becomes a god object that contains all the logic — that is the anti-pattern Mediator tries to prevent, so use it carefully.",
  ],

  analogy:
    "An air traffic control tower: planes do not negotiate directly with each other for runway access — they talk to the tower, which coordinates landings, takeoffs, and holds. Every plane knows one frequency; the tower knows every plane. Removing the tower would require every pilot to talk to every other pilot at once.",

  diagram: {
    content: `classDiagram
    class Mediator {
      <<interface>>
      +notify(sender: Peer, event: string)
    }
    class SignupMediator {
      -name: NameField
      -email: EmailField
      -password: PasswordField
      -strength: StrengthIndicator
      -terms: TermsCheckbox
      -submit: SubmitButton
      +notify(sender, event)
    }
    class Peer {
      <<interface>>
      +setMediator(m: Mediator)
    }
    class NameField
    class EmailField
    class PasswordField
    class SubmitButton
    Mediator <|.. SignupMediator
    Peer <|.. NameField
    Peer <|.. EmailField
    Peer <|.. PasswordField
    Peer <|.. SubmitButton
    SignupMediator --> "*" Peer : coordinates`,
    description:
      "UML class diagram: SignupMediator holds references to every peer. Peers hold only a Mediator reference and call notify() when their state changes. The coordination logic lives in one place — the mediator.",
  },

  example: {
    language: "ts",
    code: `interface Mediator {
  notify(sender: Peer, event: string): void;
}

abstract class Peer {
  protected mediator!: Mediator;
  setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}

class NameField extends Peer {
  value = "";
  setValue(v: string): void {
    this.value = v;
    this.mediator.notify(this, "changed");
  }
}

class EmailField extends Peer {
  value = "";
  setValue(v: string): void {
    this.value = v;
    this.mediator.notify(this, "changed");
  }
}

class PasswordField extends Peer {
  value = "";
  setValue(v: string): void {
    this.value = v;
    this.mediator.notify(this, "changed");
  }
}

class StrengthIndicator extends Peer {
  strength: "weak" | "medium" | "strong" = "weak";
  show(s: "weak" | "medium" | "strong"): void {
    this.strength = s;
  }
}

class TermsCheckbox extends Peer {
  checked = false;
  setChecked(v: boolean): void {
    this.checked = v;
    this.mediator.notify(this, "changed");
  }
}

class SubmitButton extends Peer {
  enabled = false;
  setEnabled(v: boolean): void {
    this.enabled = v;
  }
}

class SignupMediator implements Mediator {
  constructor(
    private readonly name: NameField,
    private readonly email: EmailField,
    private readonly password: PasswordField,
    private readonly strength: StrengthIndicator,
    private readonly terms: TermsCheckbox,
    private readonly submit: SubmitButton,
  ) {}

  notify(sender: Peer, event: string): void {
    if (event !== "changed") return;

    if (sender === this.password) {
      this.strength.show(this.computeStrength(this.password.value));
    }

    const valid =
      this.name.value.trim().length > 0 &&
      this.email.value.includes("@") &&
      this.strength.strength !== "weak" &&
      this.terms.checked;
    this.submit.setEnabled(valid);
  }

  private computeStrength(pwd: string): "weak" | "medium" | "strong" {
    if (pwd.length < 8) return "weak";
    if (/[A-Z]/.test(pwd) && /\\d/.test(pwd)) return "strong";
    return "medium";
  }
}`,
    explanation:
      "Every peer holds the mediator, not each other. NameField.setValue notifies the mediator and does nothing else. The mediator owns the coordination — 'when password changes, update strength indicator; when anything changes, re-evaluate submit validity'. Adding a 'confirm password' field is a new Peer and one line in the mediator; no existing peer changes. Testing NameField is trivial — inject a fake mediator and assert notify() was called. The god-object risk is real but is contained: the mediator's job is coordination, not business logic, and it can be decomposed if it grows too large.",
  },

  advantages: [
    "Reduces a many-to-many graph to a star — every peer knows one hub.",
    "Coordination logic is centralized and testable as a unit.",
    "Peers become independent — adding or removing one is a small change to the mediator.",
    "Testing a peer requires only a fake mediator, not the other seven peers.",
  ],

  disadvantages: [
    "The mediator can become a god object if coordination logic grows unbounded.",
    "Every peer must go through the mediator even for trivial interactions.",
    "The mediator is a single point of change — modifying its coordination affects every peer.",
    "Debugging requires following the notify() calls into a single dense method.",
  ],

  related: [
    {
      slug: "observer",
      note: "Both centralize communication. Observer is one subject broadcasting to many subscribers; Mediator is many peers coordinating through one hub. A mediator often uses Observer internally.",
    },
    {
      slug: "facade",
      note: "Both provide a centralized interface. Facade simplifies a subsystem for external callers; Mediator coordinates internal peers. Facade does not add behavior; Mediator does.",
    },
    {
      slug: "chain-of-responsibility",
      note: "Both decouple senders from handlers. Chain forwards linearly until one handler takes it; Mediator coordinates many peers centrally. Chain is a line, Mediator is a star.",
    },
  ],
};
