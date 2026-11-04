import type { Pattern } from "./schema";

export const visitor: Pattern = {
  slug: "visitor",
  name: "Visitor",
  category: "behavioral",
  tagline: "Add operations across a type hierarchy without changing the types.",

  introduction:
    "Visitor separates an operation from the object structure it operates on. The structure is a set of stable node types — an AST, a document tree, a configuration model — and the operation is a class implementing a `Visitor` interface with one `visit(node)` method per node type. Adding a new operation is a new visitor; the node types are untouched. The cost: adding a new node type forces every visitor to add a method. Visitor trades extensibility of operations against extensibility of types.",

  problem:
    "A compiler front-end has an AST of nodes: NumberLiteral, BinaryExpression, Identifier, IfStatement. The compiler needs many operations over the tree: type-checking, constant folding, code generation to JavaScript, code generation to WebAssembly, pretty-printing, lint rules. If each operation is a method on each node — node.typeCheck(), node.emitJS(), node.emitWasm(), node.prettyPrint(), node.lint() — then every node knows about every backend, and adding an operation edits every node. The node classes, which should be pure data, become the union of every operation the system will ever have.",

  solution:
    "Give each node an `accept(visitor)` method that calls `visitor.visitX(this)` — that is the visitor pattern's dispatch trick. Introduce a `Visitor<T>` interface with one method per node type. Each operation is a class — TypeCheckerVisitor, JSCompilerVisitor, WasmCompilerVisitor — implementing every visit method. Adding a new operation is a new visitor class; the nodes are untouched. Adding a new node type is a new method on the interface, which forces every visitor to implement it — a real cost, but the code that would need it is localized and reviewable.",

  whenToUse: [
    "Many unrelated operations must be performed over a stable set of node types.",
    "The node types are not expected to change often — the operation set changes instead.",
    "Operations should not pollute the node classes — nodes are pure data.",
    "An operation needs to accumulate state across nodes — a visitor is a natural accumulator.",
  ],

  whenNotToUse: [
    "Node types are expected to grow — every new node forces edits to every visitor.",
    "There are only one or two operations — a method on the node or a switch over type is simpler.",
    "The nodes have genuinely different interfaces per type — the visitor's uniform dispatch becomes awkward.",
    "The operation needs to mutate the tree structurally — visitor dispatch is read-oriented.",
  ],

  analogy:
    "A museum exhibit is visited by different specialists: a curator, a conservator, a security auditor, a photographer. Each visits every exhibit, but each does something different — the exhibit is closed to modification, the visitors rotate through. Adding a new specialist (say, a translator for audio guides) does not change any exhibit. Adding a new exhibit requires every specialist to know how to handle it.",

  diagram: {
    content: `classDiagram
    class Visitor~R~ {
      <<interface>>
      +visitNumber(n: NumberLiteral) R
      +visitBinary(b: BinaryExpression) R
      +visitIdentifier(i: Identifier) R
    }
    class Node {
      <<interface>>
      +accept(visitor: Visitor) R
    }
    class NumberLiteral {
      +value: number
      +accept(visitor)
    }
    class BinaryExpression {
      +left: Node
      +op: string
      +right: Node
      +accept(visitor)
    }
    class EvaluateVisitor {
      +visitNumber(n)
      +visitBinary(b)
      +visitIdentifier(i)
    }
    Visitor <|.. EvaluateVisitor
    Node <|.. NumberLiteral
    Node <|.. BinaryExpression
    BinaryExpression --> Node : children`,
    description:
      "UML class diagram: Node declares accept(visitor), which routes to the correct visit method. Each concrete node calls the corresponding visitX(this) on the visitor. Visitors implement every visit method — one class per operation. Adding an operation is a new visitor; adding a node type forces every visitor to add a method.",
  },

  example: {
    language: "ts",
    code: `// Node hierarchy — pure data plus a dispatch hook.
interface Node {
  accept<R>(visitor: Visitor<R>): R;
}

class NumberLiteral implements Node {
  constructor(readonly value: number) {}
  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitNumber(this);
  }
}

class BinaryExpression implements Node {
  constructor(
    readonly left: Node,
    readonly op: "+" | "-" | "*" | "/",
    readonly right: Node,
  ) {}
  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinary(this);
  }
}

class Identifier implements Node {
  constructor(readonly name: string) {}
  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitIdentifier(this);
  }
}

// The visitor contract — one method per node type.
interface Visitor<R> {
  visitNumber(n: NumberLiteral): R;
  visitBinary(b: BinaryExpression): R;
  visitIdentifier(i: Identifier): R;
}

// Operation 1 — evaluate with an environment.
class EvaluateVisitor implements Visitor<number> {
  constructor(private readonly env: Map<string, number>) {}
  visitNumber(n: NumberLiteral): number {
    return n.value;
  }
  visitBinary(b: BinaryExpression): number {
    const l = b.left.accept(this);
    const r = b.right.accept(this);
    switch (b.op) {
      case "+": return l + r;
      case "-": return l - r;
      case "*": return l * r;
      case "/": return l / r;
    }
  }
  visitIdentifier(i: Identifier): number {
    const v = this.env.get(i.name);
    if (v === undefined) throw new Error(\`unknown identifier: \${i.name}\`);
    return v;
  }
}

// Operation 2 — render to a string. Same nodes, different visitor.
class PrettyPrintVisitor implements Visitor<string> {
  visitNumber(n: NumberLiteral): string { return String(n.value); }
  visitBinary(b: BinaryExpression): string {
    return \`(\${b.left.accept(this)} \${b.op} \${b.right.accept(this)})\`;
  }
  visitIdentifier(i: Identifier): string { return i.name; }
}

// Build a small AST — the node classes have no evaluation logic.
const ast = new BinaryExpression(
  new BinaryExpression(new NumberLiteral(2), "+", new NumberLiteral(3)),
  "*",
  new Identifier("x"),
);

const env = new Map([["x", 10]]);
console.log(ast.accept(new EvaluateVisitor(env)));      // (2+3)*10 = 50
console.log(ast.accept(new PrettyPrintVisitor()));       // ((2 + 3) * x)`,
    explanation:
      "The node classes are data plus a one-line accept() — no arithmetic, no printing. Adding a WasmCompilerVisitor or a LintVisitor is a new class; no node changes. The double-dispatch trick — accept(visitor) on the node calls the correct visitX on the visitor — is what makes this work in a language without pattern matching; the node type is known at dispatch time, and the visitor provides the operation. The trade-off is explicit: adding a new node (say, UnaryExpression) forces a new method on Visitor, which forces every visitor to implement it. That is the real cost of Visitor, and it is why the pattern is used when nodes are stable and operations grow.",
  },

  advantages: [
    "Operations are classes — testable in isolation, composable, independently deployable.",
    "Node classes remain pure data — they do not grow into a union of every operation.",
    "Adding a new operation is a new class; no existing code changes.",
    "An operation can accumulate state as it traverses (a counter, a symbol table).",
  ],

  disadvantages: [
    "Adding a new node type forces every visitor to add a method — a real and potentially painful cost.",
    "The visitor interface is a coupling point — every operation is visible in one interface.",
    "Double dispatch is harder to debug than a straightforward method call.",
    "Some operations that genuinely need internal node access cannot be expressed without breaking encapsulation (nodes must expose fields).",
  ],

  related: [
    {
      slug: "iterator",
      note: "Iterator separates traversal from the aggregate; Visitor separates the operation from the node types. A visitor typically traverses via an iterator or a recursion, and operates via accept().",
    },
    {
      slug: "composite",
      note: "Visitor trees are almost always Composite trees — the accept() method is the entry point, and the visitor recurses through children. The two patterns are frequently used together.",
    },
    {
      slug: "interpreter",
      note: "Interpreter's AST is visited by grammar operations — type-checking, evaluation, pretty-printing. In modern designs, Interpreter is often implemented as a Visitor over the AST, plus a parser.",
    },
  ],
};
