import type { Pattern } from "./schema";

export const interpreter: Pattern = {
  slug: "interpreter",
  name: "Interpreter",
  category: "behavioral",
  tagline: "Evaluate a small language by representing its grammar as classes.",

  introduction:
    "Interpreter, given a language, defines a representation for its grammar along with an interpreter that uses the representation to interpret sentences. In practice, this is an AST: each grammar rule is a node class, and each node knows how to evaluate itself against a context. For simple languages — configuration filters, query DSLs, rule engines — it is a compact, extensible way to build a parser and evaluator without a framework. For general-purpose languages, the pattern is too rigid and a parser generator is the right tool.",

  problem:
    "An e-commerce team needs a small filter DSL for promotions: expressions like `category = 'shoes' AND price < 100` or `stock > 0 OR featured = true`. The expressions are stored as strings in the database and evaluated per product. Naively, the rule is `eval(string)` — fast to write, but a security hazard (code injection), slow (parsing every product), and impossible to inspect or optimize (no AST). The rules need to be parsed once, validated at save time, and evaluated many times over millions of products.",

  solution:
    "Define node classes for the grammar: `Equals(field, value)`, `LessThan(field, value)`, `And(left, right)`, `Or(left, right)`, `GreaterThan(field, value)`. Each implements `interpret(product)` — evaluate the predicate against a product. A parser produces a tree from the stored string; the tree is validated at save time and cached. Evaluating a rule is `ast.interpret(product)` — no string parsing, no `eval`, no injection surface. Adding a new operator is a new node class, and a new grammar production in the parser.",

  whenToUse: [
    "A small language is central to the domain — filter rules, feature flags, access policies, math expressions.",
    "The grammar is simple and stable — a few dozen productions, not a full programming language.",
    "Expressions must be evaluated repeatedly — parse once, evaluate many times.",
    "Security is a concern — evaluating a parsed AST beats evaluating a string.",
  ],

  whenNotToUse: [
    "The grammar is complex or evolving — use a parser generator or a real expression library.",
    "Only one or two expressions exist — a hardcoded predicate is clearer and faster.",
    "Performance is critical and the expressions are simple — a hand-written evaluator may beat the class dispatch overhead, and a DSL is heavier than the problem needs.",
    "The problem is really evaluation, not grammar — a JSON Schema or a rules library handles the common cases.",
  ],

  analogy:
    "Reading a recipe: 'add 2 eggs, beat until smooth, fold in 100g flour'. Each instruction is a distinct operation, and together they form a small language. A cook interprets the sequence step by step. Re-ordering the steps is meaningfully different — the sequence is the program, and the chef knows what each instruction means.",

  diagram: {
    content: `classDiagram
    class Expression {
      <<interface>>
      +interpret(ctx: Product) boolean
    }
    class Equals {
      -field: string
      -value: string
      +interpret(ctx)
    }
    class And {
      -left: Expression
      -right: Expression
      +interpret(ctx)
    }
    class Or {
      -left: Expression
      -right: Expression
      +interpret(ctx)
    }
    class LessThan {
      -field: string
      -value: number
      +interpret(ctx)
    }
    Expression <|.. Equals
    Expression <|.. And
    Expression <|.. Or
    Expression <|.. LessThan
    And --> Expression : left, right
    Or --> Expression : left, right`,
    description:
      "UML class diagram: Expression is the common grammar node. Each concrete node implements interpret(product) against a context. Composite nodes (And, Or) hold sub-expressions and recursively interpret. The tree is the parsed rule; evaluating it is a single interpret() call.",
  },

  example: {
    language: "ts",
    code: `interface Product {
  category: string;
  price: number;
  stock: number;
  featured: boolean;
}

interface Expression {
  interpret(product: Product): boolean;
}

class Equals implements Expression {
  constructor(private readonly field: keyof Product, private readonly value: string | number | boolean) {}
  interpret(product: Product): boolean {
    return product[this.field] === this.value;
  }
}

class LessThan implements Expression {
  constructor(private readonly field: keyof Product, private readonly value: number) {}
  interpret(product: Product): boolean {
    return (product[this.field] as number) < this.value;
  }
}

class GreaterThan implements Expression {
  constructor(private readonly field: keyof Product, private readonly value: number) {}
  interpret(product: Product): boolean {
    return (product[this.field] as number) > this.value;
  }
}

class And implements Expression {
  constructor(private readonly left: Expression, private readonly right: Expression) {}
  interpret(product: Product): boolean {
    return this.left.interpret(product) && this.right.interpret(product);
  }
}

class Or implements Expression {
  constructor(private readonly left: Expression, private readonly right: Expression) {}
  interpret(product: Product): boolean {
    return this.left.interpret(product) || this.right.interpret(product);
  }
}

// Build an AST for: category = 'shoes' AND price < 100
const rule: Expression = new And(
  new Equals("category", "shoes"),
  new LessThan("price", 100),
);

// Evaluate over many products.
const products: Product[] = [
  { category: "shoes", price: 80, stock: 5, featured: true },
  { category: "shoes", price: 120, stock: 2, featured: false },
  { category: "bags", price: 90, stock: 0, featured: false },
];

const qualifying = products.filter((p) => rule.interpret(p));
// → [{ category: "shoes", price: 80, ... }]`,
    explanation:
      "Each grammar rule is a class — Equals, LessThan, And, Or — and each knows how to interpret itself against a product. Composite rules (And, Or) hold sub-expressions and recurse; terminal rules (Equals, LessThan) test a field. A parser (not shown — it would be ~100 lines for this grammar) turns 'category = \\'shoes\\' AND price < 100' into this tree, and the tree is cached and reused across millions of evaluations. Adding a 'contains' operator is one new class plus a grammar production; existing rules are untouched. The AST is inspectable — the merchant can see, edit, and re-validate a rule as data.",
  },

  advantages: [
    "Expressions become inspectable, editable data — a tree, not a string.",
    "Parsed rules can be cached and re-evaluated without reparsing.",
    "No `eval`, no injection surface — evaluation is code, not dynamic string execution.",
    "New operators are new node classes; existing rules are untouched.",
  ],

  disadvantages: [
    "Each grammar rule is a class — a grammar with dozens of rules has dozens of classes.",
    "The pattern does not include a parser — you write one, or bring a library.",
    "Deeply nested expressions can be slow to evaluate — no optimization pass by default.",
    "For anything more complex than a small expression language, a parser generator or a real language runtime is the right tool.",
  ],

  related: [
    {
      slug: "composite",
      note: "The AST is a Composite tree — And and Or are containers, Equals and LessThan are leaves. Interpreter builds its AST on Composite and adds interpret().",
    },
    {
      slug: "visitor",
      note: "Modern Interpreter is often implemented via Visitor — the AST nodes expose accept(), and operations (type-check, pretty-print, optimize) are visitor classes. Interpreter says what the AST is; Visitor says how to operate on it without changing it.",
    },
    {
      slug: "strategy",
      note: "Interpreter evaluates a rule; Strategy chooses the algorithm used for a single evaluation step. A complex rule can hold Strategy objects for its terminal operators — the two compose.",
    },
  ],
};
