import type { Pattern } from "./schema";

export const command: Pattern = {
  slug: "command",
  name: "Command",
  category: "behavioral",
  tagline:
    "Encapsulate a request as an object, so it can be queued, logged, or undone.",

  introduction:
    "Command encapsulates a request as a standalone object — the receiver, the operation, and its parameters — so the request can be passed around, stored, queued, logged, or reversed. The caller (invoker) does not know what the request does or who performs it; it just calls execute(). This is what makes undo/redo possible at all, and what enables job queues, macro recording, and transactional operations.",

  problem:
    "A text editor's toolbar has buttons for bold, italic, cut, paste, undo. Wiring each button directly to the model method works until the product needs: (a) undo, (b) a command palette that lists available actions, (c) macro recording to replay a sequence, (d) a remote collaborative editing protocol that ships operations to other clients. Each feature needs the *action as a value* — but with direct method calls, the action is a stack frame, not data. Every feature has to be built by intercepting the model in a different way.",

  solution:
    "Wrap each editor action in a Command interface with `execute()` and `undo()`. A `BoldCommand` holds the selection and the document, and its `execute()` applies the bold. An `UndoStack` is a list of commands; `undo()` pops a command and calls `command.undo()`. A palette lists commands; a macro is a list of commands; a remote protocol serializes commands. The invoker — toolbar button, palette entry, macro — only ever calls `execute()` and `undo()`.",

  whenToUse: [
    "You need undo/redo — reversible operations are impossible without capturing the action as an object.",
    "Operations must be queued, logged, or replayed — job queues, event sourcing, macros.",
    "The caller must not know the receiver or the operation — a command palette, a workflow engine, a scripting API.",
    "Transactions or composite operations must group several actions into one.",
  ],

  whenNotToUse: [
    "There is no undo, no queue, and no need to treat the action as data — a direct call is simpler.",
    "Every operation is a one-line call to a method — wrapping it in a class adds ceremony.",
    "Commands need heavy context that would be awkward to carry — the receiver holds the state, not the command.",
  ],

  analogy:
    "A restaurant order is a command: written on a ticket, passed to the kitchen, queued, prepared, and — if the customer changes their mind before cooking — cancellable. The waiter (invoker) does not cook; the kitchen (receiver) does. The ticket is what makes the order queueable, prioritizable, and auditable.",

  diagram: {
    content: `classDiagram
    class Command {
      <<interface>>
      +execute()
      +undo()
    }
    class BoldCommand {
      -doc: Document
      -selection: Range
      +execute()
      +undo()
    }
    class UndoStack {
      -history: Command[]
      -redo: Command[]
      +run(cmd: Command)
      +undo()
      +redo()
    }
    Command <|.. BoldCommand
    UndoStack --> Command : stores`,
    description:
      "UML class diagram: Command has execute() and undo(). BoldCommand captures the receiver and parameters. UndoStack invokes commands and stores them for reversal. The invoker (UndoStack) never knows which operation it ran.",
  },

  example: {
    language: "ts",
    code: `interface Command {
  execute(): void;
  undo(): void;
}

class Document {
  content = "";
  applyBold(range: [number, number]): void { /* ... */ }
  removeBold(range: [number, number]): void { /* ... */ }
  cut(range: [number, number]): string {
    const removed = this.content.slice(...range);
    this.content = this.content.slice(0, range[0]) + this.content.slice(range[1]);
    return removed;
  }
  insert(at: number, text: string): void {
    this.content = this.content.slice(0, at) + text + this.content.slice(at);
  }
}

class BoldCommand implements Command {
  constructor(
    private readonly doc: Document,
    private readonly range: [number, number],
  ) {}
  execute(): void { this.doc.applyBold(this.range); }
  undo(): void { this.doc.removeBold(this.range); }
}

class CutCommand implements Command {
  private removed = "";
  constructor(
    private readonly doc: Document,
    private readonly range: [number, number],
  ) {}
  execute(): void {
    this.removed = this.doc.cut(this.range);
  }
  undo(): void {
    this.doc.insert(this.range[0], this.removed);
  }
}

class UndoStack {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  run(cmd: Command): void {
    cmd.execute();
    this.undoStack.push(cmd);
    this.redoStack = [];
  }

  undo(): void {
    const cmd = this.undoStack.pop();
    if (!cmd) return;
    cmd.undo();
    this.redoStack.push(cmd);
  }

  redo(): void {
    const cmd = this.redoStack.pop();
    if (!cmd) return;
    cmd.execute();
    this.undoStack.push(cmd);
  }
}

const doc = new Document();
doc.content = "Hello world";
const stack = new UndoStack();

stack.run(new BoldCommand(doc, [0, 5]));
stack.run(new CutCommand(doc, [6, 11]));  // "Hello "
stack.undo();                              // restores "world"
stack.undo();                              // removes bold
stack.redo();                              // re-bolds`,
    explanation:
      "Each action is an object holding its receiver, its parameters, and the state needed to reverse it — CutCommand stashes the removed text on execute, so undo can reinsert it exactly. The UndoStack knows only execute() and undo(); it can run any Command without knowing what the command does. The same Command objects drive toolbar buttons, keyboard shortcuts, and a command palette — every surface reduces to 'execute the command'.",
  },

  advantages: [
    "Actions become first-class objects — storable, queueable, replayable, loggable.",
    "Undo/redo is built on top of the pattern, not invented per feature.",
    "Invokers are decoupled from receivers — toolbar code has no knowledge of the model.",
    "Composite commands group operations into macros and transactions.",
    "Commands can be serialized — for remote execution or audit logs.",
  ],

  disadvantages: [
    "Every action becomes a class — the class count grows quickly in feature-rich applications.",
    "Undoing state-changing operations requires capturing prior state, which the receiver must cooperate on.",
    "Command history holds references — memory grows, and cleanup of large commands needs explicit design.",
  ],

  related: [
    {
      slug: "chain-of-responsibility",
      note: "Both decouple sender from receiver. Command encapsulates one request; Chain lets a request pass through a series of potential handlers. A chain is often invoked by a command.",
    },
    {
      slug: "memento",
      note: "Memento captures state to restore later; Command captures the operation to reverse. Undo systems often use both — Command to undo the operation, Memento if the operation's inverse is unknown.",
    },
    {
      slug: "observer",
      note: "Both turn behavior into objects. Observer broadcasts events to subscribers; Command encapsulates a request for a specific receiver. A command queue can be observed.",
    },
  ],
};
