import type { Challenge } from "./schema";

export const compilerAnalysisPasses: Challenge = {
  slug: "compiler-analysis-passes",
  patternSlug: "visitor",
  difficulty: "advanced",
  scenario:
    "You maintain a compiler AST with 8 node types. Node types change roughly once a year. Analysis passes change every quarter: type-checking, constant folding, JS codegen, WASM codegen, pretty-printing, security scanning, and a new one lands each cycle. Each pass must traverse the entire AST and produce a distinct output.",
  problem:
    "Each pass is implemented as methods on every node — node.typeCheck(), node.emitJS(), node.emitWasm(), … — so adding a pass edits all 8 node files, and the node classes are now the union of every analysis the compiler will ever have. A simple data-class like NumberLiteral has become an 800-line file.",
  codeSnippet: `class NumberLiteral {
  typeCheck() { … }
  emitJS() { … }
  emitWasm() { … }
  prettyPrint() { … }
  securityScan() { … }
  // one method per pass, forever
}`,
  options: ["visitor", "iterator", "composite", "command"],
  explanation:
    "Visitor separates operations from the node hierarchy. Each pass becomes a visitor class; adding a pass does not touch the 8 node types. The trade-off — adding a node type forces edits to every visitor — is acceptable here because nodes are stable and passes are volatile. Iterator handles traversal, not the operation. Composite is the tree structure. Command encapsulates requests for a specific receiver; it does not provide operation dispatch over a type hierarchy.",
};
