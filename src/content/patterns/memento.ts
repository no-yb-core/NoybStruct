import type { Pattern } from "./schema";

export const memento: Pattern = {
  slug: "memento",
  name: "Memento",
  category: "behavioral",
  tagline:
    "Capture and restore an object's state without breaking encapsulation.",

  introduction:
    "Memento captures an object's internal state in an opaque snapshot so it can be restored later — without exposing the object's private fields to anything that might restore it. The originator (the object being snapshotted) creates the memento; the caretaker (the object holding the history) stores it; only the originator can read it. The caretaker cannot inspect or mutate the memento's contents. This is the pattern behind undo history, save points, and transactional rollback where the restoring layer must not depend on internal representation.",

  problem:
    "A canvas editor supports undo. The naive approach is to have the undo manager call editor.serialize() to get the full state, and editor.deserialize(state) to restore. That works until the state's internal shape becomes complex — selection, layer order, filter pipeline, viewport — and every consumer that wants history (the undo stack, the autosave timer, the collaboration sync service, the crash-recovery log) needs to know the state's shape. They all reach into the editor's internals, breaking encapsulation and coupling every history-consumer to every internal change.",

  solution:
    "Introduce a `CanvasSnapshot` class with an opaque payload. `Canvas.save()` returns a snapshot (it holds a private copy of the state — the editor knows how to build and consume it). `Canvas.restore(snapshot)` applies the snapshot. An `UndoHistory` holds a stack of snapshots and calls `canvas.restore()` — it never inspects a snapshot. The snapshot is a value from the caretaker's perspective; from the originator's perspective, it is a portable copy of its own state.",

  whenToUse: [
    "You need undo, redo, or save-point restoration of an object's state.",
    "The state's internal shape should not leak to the layer managing history.",
    "Snapshots must be cheaper than full object cloning (memento can store a delta or a serialized form).",
    "Transactions or checkpoints need a stable state to return to on failure.",
  ],

  whenNotToUse: [
    "The object's state is a single primitive — a copy is trivial and the pattern is overhead.",
    "Snapshots are large and frequent — storing full state per change is prohibitive; use Command's inverse operations instead, or a delta encoding.",
    "The state is immutable and shared by construction — persistence via value semantics already covers you.",
  ],

  analogy:
    "A save state in a video game: you press 'save', the game writes a compact record of your position, inventory, and progress, and later 'load' restores it. The save file is a Memento — the game engine can read it, but the file manager that stores saves has no idea what is inside, and cannot corrupt it by inspecting it.",

  diagram: {
    content: `classDiagram
    class Canvas {
      -state: CanvasState
      +save() CanvasSnapshot
      +restore(snapshot: CanvasSnapshot)
    }
    class CanvasSnapshot {
      <<immutable>>
      -payload: CanvasState
      +__readBy(canvas) CanvasState
    }
    class UndoHistory {
      -stack: CanvasSnapshot[]
      +push(s: CanvasSnapshot)
      +pop() CanvasSnapshot
    }
    Canvas --> CanvasSnapshot : creates
    UndoHistory --> CanvasSnapshot : stores opaquely`,
    description:
      "UML class diagram: Canvas creates snapshots via save() and restores them via restore(). CanvasSnapshot is opaque to the UndoHistory — the caretaker stores references without inspecting contents. Only Canvas can read the payload. UndoHistory is generic over snapshots; Canvas is the only originator.",
  },

  example: {
    language: "ts",
    code: `interface CanvasState {
  strokes: ReadonlyArray<{ path: string; color: string }>;
  viewport: { x: number; y: number; zoom: number };
}

// Opaque to everyone except Canvas.
class CanvasSnapshot {
  /** @internal — read only by Canvas. */
  readonly payload: CanvasState;

  /** @internal — Canvas constructs snapshots directly. */
  constructor(payload: CanvasState) {
    this.payload = payload;
  }
}

class Canvas {
  private state: CanvasState = {
    strokes: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  };

  draw(path: string, color: string): void {
    this.state = {
      ...this.state,
      strokes: [...this.state.strokes, { path, color }],
    };
  }

  pan(x: number, y: number): void {
    this.state = {
      ...this.state,
      viewport: { ...this.state.viewport, x, y },
    };
  }

  save(): CanvasSnapshot {
    // Deep-copy enough that later mutations of this.state cannot touch the snapshot.
    return new CanvasSnapshot({
      strokes: this.state.strokes,
      viewport: { ...this.state.viewport },
    });
  }

  restore(snapshot: CanvasSnapshot): void {
    this.state = {
      strokes: snapshot.payload.strokes,
      viewport: { ...snapshot.payload.viewport },
    };
  }
}

class UndoHistory {
  private stack: CanvasSnapshot[] = [];

  push(s: CanvasSnapshot): void {
    this.stack.push(s);
  }

  pop(): CanvasSnapshot | undefined {
    return this.stack.pop();
  }
}

// Usage
const canvas = new Canvas();
const history = new UndoHistory();

history.push(canvas.save());
canvas.draw("M0,0 L100,100", "#000");
canvas.draw("M0,50 L100,50", "#f00");
canvas.pan(50, 20);

const last = history.pop();
if (last) canvas.restore(last);  // back to blank canvas`,
    explanation:
      "CanvasSnapshot is a value object — it holds a payload the caller cannot read except through Canvas.restore(). UndoHistory is completely generic over snapshots — it pushes and pops, and never sees CanvasState. The snapshot copies only the mutable parts of state (viewport); the strokes array is treated as immutable, so a shallow copy suffices. Adding autosave or crash recovery is a new caretaker that stores CanvasSnapshot without knowing what is inside. The key discipline: the caretaker cannot inspect or mutate the snapshot, so internal representation changes never leak.",
  },

  advantages: [
    "Encapsulation is preserved — the caretaker stores snapshots without inspecting them.",
    "Snapshots can be cheap — the originator controls what is copied and what is shared (immutable).",
    "Multiple caretakers (undo, autosave, sync, crash recovery) can coexist without cooperation.",
    "Restoration is a single originator method — the state cannot be half-restored.",
  ],

  disadvantages: [
    "Full snapshots can be expensive for large state — every snapshot pays the copy cost.",
    "TypeScript cannot enforce 'opaque' — `payload` is a public field and any caller can read it; discipline is required.",
    "Snapshot bloat — history stacks that never prune grow unbounded.",
    "Snapshot validity is not checked — restoring an old-format snapshot into a new-format originator is a migration problem the pattern does not solve.",
  ],

  related: [
    {
      slug: "command",
      note: "Command is the alternative undo strategy — instead of snapshots, commands store inverse operations. Memento restores from full state; Command replays inverse actions. Choose Memento for cheap-to-snapshot state, Command for cheap-to-invert operations.",
    },
    {
      slug: "prototype",
      note: "Both capture state by copying. Prototype captures a template for future derivation; Memento captures a point to restore. Both require careful attention to deep vs shallow copies.",
    },
    {
      slug: "state",
      note: "State defines what an object *does* in each state; Memento captures the object's full state to restore. A Memento snapshot can include the current State object reference, but the two solve different problems.",
    },
  ],
};
