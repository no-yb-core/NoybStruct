import type { Pattern } from "./schema";

export const iterator: Pattern = {
  slug: "iterator",
  name: "Iterator",
  category: "behavioral",
  tagline:
    "Traverse a collection without exposing its internal representation.",

  introduction:
    "Iterator provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation. The aggregate — an array, a tree, a linked list, a paginated API — returns an iterator with hasNext() and next() (or, in JavaScript, an object implementing `Symbol.iterator`). The client loops the iterator and knows nothing about how the elements are stored or produced.",

  problem:
    "A document model is a tree of nodes — paragraphs, sections, inline runs — but several consumers (a spell checker, an export-to-markdown converter, a search indexer) need to walk every text node in order. Each consumer implements its own recursion, with slightly different traversal orders (depth-first, breadth-first, skip-empty), and they drift. Adding a new node type — footnotes, code blocks — requires checking every traversal. Exposing the tree's children array makes the traversal order implicit and impossible to change later without breaking consumers.",

  solution:
    "Define an `Iterator<T>` interface with `hasNext()` and `next()`. Give the Document a `textNodes()` method returning an iterator that walks the tree in the traversal order the document chooses. Consumers use the same interface, unaware of the tree's structure. Adding a node type is a change to the iterator's internals — consumers do not need to know. In modern JS/TS, an object implementing `Symbol.iterator` qualifies — it can be used directly in `for...of` and spread.",

  whenToUse: [
    "An aggregate has a non-trivial internal structure — trees, graphs, linked lists, paginated data.",
    "Multiple traversals of the same aggregate are needed, and the traversal order should be a property of the aggregate.",
    "The internal representation should not leak to consumers — arrays, tree nodes, connection pools.",
    "The aggregate should support multiple simultaneous iterations — nested loops over the same collection.",
  ],

  whenNotToUse: [
    "The aggregate is already a plain array — array methods and `for...of` are the iterator.",
    "Only one traversal is needed and it is short — inlining the loop is clearer.",
    "The traversal is one-off and trivial — a helper function suffices without an interface.",
  ],

  analogy:
    "A tour guide leads a group through a museum: the guide knows the route, decides the order, and points out each exhibit. The visitors do not need to know the floor plan — they follow the guide from start to finish. If the museum reorders its exhibits, only the guide's route changes; the visitors still follow.",

  diagram: {
    content: `classDiagram
    class Iterable~T~ {
      <<interface>>
      +iterator() Iterator~T~
    }
    class Iterator~T~ {
      <<interface>>
      +hasNext() boolean
      +next() T
    }
    class Document {
      +textNodes() Iterator~Node~
    }
    class TextNodeIterator {
      -stack: Frame[]
      +hasNext() boolean
      +next() Node
    }
    Document --> TextNodeIterator : returns
    Iterable <|.. Document
    Iterator <|.. TextNodeIterator`,
    description:
      "UML class diagram: Document produces a TextNodeIterator. The iterator maintains its own state (a stack of frames for the tree walk) so multiple iterations can proceed independently. Clients loop via hasNext()/next() without seeing the tree structure.",
  },

  example: {
    language: "ts",
    code: `interface Node {
  type: "paragraph" | "section" | "text";
  text?: string;
  children?: Node[];
}

// Iterate only text nodes, depth-first, without exposing the tree.
class Document {
  constructor(private readonly root: Node) {}

  *textNodes(): Generator<string> {
    // Yield the text of every text node in document order.
    yield* this.walk(this.root);
  }

  private *walk(node: Node): Generator<string> {
    if (node.type === "text" && node.text) {
      yield node.text;
    }
    if (node.children) {
      for (const child of node.children) {
        yield* this.walk(child);
      }
    }
  }

  // Multiple independent iterations do not interfere.
  search(needle: string): { paragraph: number; offset: number }[] {
    const matches = [];
    let paragraph = 0;
    for (const text of this.textNodes()) {
      const idx = text.indexOf(needle);
      if (idx !== -1) matches.push({ paragraph, offset: idx });
      paragraph += 1;
    }
    return matches;
  }
}

// Consumers use for...of — they never see the tree.
const doc = new Document({
  type: "section",
  children: [
    { type: "paragraph", children: [{ type: "text", text: "Hello " }, { type: "text", text: "world" }] },
    { type: "paragraph", children: [{ type: "text", text: "Second paragraph" }] },
  ],
});

for (const text of doc.textNodes()) {
  console.log(text);  // "Hello ", "world", "Second paragraph"
}

// A second iteration starts fresh — no shared state.
const matches = doc.search("paragraph");`,
    explanation:
      "Document.textNodes() returns a generator — a JavaScript-native Iterator. The generator walks the tree recursively, yielding each text node's text in document order. Consumers use for...of, spread, or .map() and never see Node, children, or the recursion. Two iterations over the same Document are independent — each generator call starts a new traversal with its own state. Adding a new node type (footnote, code block) is a change to walk() and nothing else. This is Iterator in its modern, native form: the interface is standard, the implementation is hidden, the traversal order is the aggregate's decision.",
  },

  advantages: [
    "Internal representation is hidden from consumers — tree, list, page are all iterable the same way.",
    "Traversal order is a property of the aggregate, not duplicated in every consumer.",
    "Multiple simultaneous iterations are naturally supported.",
    "Works with language features — `for...of`, `...`, array methods — when the iterator implements `Symbol.iterator`.",
    "New node types affect only the iterator's internals.",
  ],

  disadvantages: [
    "One class (or generator) per traversal type — IterateTextNodes, IterateHeaders, IterateImages — the class count grows.",
    "Snapshot vs live iteration is a real distinction — mutating during iteration is undefined unless the iterator protects against it.",
    "A generator's lazy evaluation is a performance advantage in some cases and a footgun in others — an exception mid-iteration leaves the traversal half-done.",
  ],

  related: [
    {
      slug: "composite",
      note: "Composite trees are typically traversed via Iterator — the tree provides the structure, the iterator hides it. The two patterns compose in nearly every tree-shaped domain.",
    },
    {
      slug: "visitor",
      note: "Both separate traversal from processing. Iterator separates traversal from the aggregate; Visitor separates the operation from the node type. A visitor usually traverses via an iterator.",
    },
    {
      slug: "template-method",
      note: "Template Method can fix the traversal skeleton and let subclasses vary how each node is processed — an alternative to Iterator when the traversal order itself is invariant.",
    },
  ],
};
