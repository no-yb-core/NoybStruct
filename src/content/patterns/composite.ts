import type { Pattern } from "./schema";

export const composite: Pattern = {
  slug: "composite",
  name: "Composite",
  category: "structural",
  tagline: "Treat single objects and groups of objects uniformly through a tree.",

  introduction:
    "Composite composes objects into tree structures to represent part-whole hierarchies. The pattern lets clients treat individual leaves and compositions of leaves uniformly — a single file and a folder both answer `getSize()`, even though the folder computes its answer from its children. Composite is what makes recursive structures (file systems, UI trees, expression ASTs, document outlines) traversable without special-casing 'is this a container?'.",

  problem:
    "A file system browser must show and total sizes for files and directories. Files know their size; directories sum their children. If Directory and File have different interfaces, every call site — the tree display, the disk usage report, the export — must branch on whether a given node is a file or a folder. Adding a new container type (zip archives, mounted volumes) forces edits in every such call site.",

  solution:
    "Declare a `FileSystemNode` interface with `getName()` and `getSize()`. `File` implements it with the file's size. `Directory` implements it by holding a list of `FileSystemNode` children and returning the sum of their sizes. Both implement the same interface, so callers traverse a tree of them uniformly — without ever asking what type a node is.",

  whenToUse: [
    "The domain is genuinely a tree or part-whole hierarchy (file systems, UI trees, ASTs, outlines).",
    "Clients should treat single objects and groups of objects uniformly.",
    "Operations should be recursive over a structure without branching on container vs leaf.",
    "New node types should be addable without touching traversal code.",
  ],

  whenNotToUse: [
    "The hierarchy is one level deep — an array or map is enough, and Composite adds ceremony.",
    "Leaves and containers genuinely need different operations — forcing a shared interface hides important differences.",
    "The tree is small, static, and traversed once — the abstraction earns nothing.",
  ],

  analogy:
    "An army has divisions, brigades, battalions, and soldiers. A commander can ask any of them for its headcount — a soldier returns one, a battalion returns the sum of its squads — without needing to know which level of the hierarchy they are asking. The report request is the same at every level.",

  diagram: {
    content: `classDiagram
    class FileSystemNode {
      <<interface>>
      +getName() string
      +getSize() number
    }
    class File {
      -size: number
      +getSize() number
    }
    class Directory {
      -children: FileSystemNode[]
      +add(node)
      +getSize() number
    }
    FileSystemNode <|.. File
    FileSystemNode <|.. Directory
    Directory --> "0..*" FileSystemNode : contains`,
    description:
      "UML class diagram: FileSystemNode declares getName() and getSize(). File returns its own size. Directory holds children of type FileSystemNode and computes size by recursively summing each child. Both are usable wherever a FileSystemNode is expected.",
  },

  example: {
    language: "ts",
    code: `interface FileSystemNode {
  getName(): string;
  getSize(): number;
}

class File implements FileSystemNode {
  constructor(private readonly name: string, private readonly size: number) {}
  getName(): string {
    return this.name;
  }
  getSize(): number {
    return this.size;
  }
}

class Directory implements FileSystemNode {
  private readonly children: FileSystemNode[] = [];

  constructor(private readonly name: string) {}

  add(node: FileSystemNode): void {
    this.children.push(node);
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  // Recursive traversal — same interface at every level.
  *walk(): Generator<FileSystemNode> {
    yield this;
    for (const child of this.children) {
      if (child instanceof Directory) {
        yield* child.walk();
      } else {
        yield child;
      }
    }
  }
}

const root = new Directory("project");
root.add(new File("README.md", 1024));

const src = new Directory("src");
src.add(new File("index.ts", 2048));
src.add(new File("utils.ts", 512));
root.add(src);

console.log(root.getSize());  // 3584 — computed recursively, no special-casing
for (const node of root.walk()) {
  console.log(node.getName(), node.getSize());
}`,
    explanation:
      "Callers hold a FileSystemNode and call getSize() without knowing whether it is a File or a Directory. Directory.getSize() sums children of the same interface, so nesting works to any depth without changing the call site. New node types (a MountedVolume, a ZipArchiveFile) become new implementations of FileSystemNode — the walk() generator and the callers do not change.",
  },

  advantages: [
    "Uniform treatment of leaves and containers simplifies traversal code.",
    "Recursive structures are expressed naturally — the tree defines its own size, count, or traversal.",
    "New node types are added without touching the interface or existing callers.",
    "The client's code becomes dramatically simpler and shorter.",
  ],

  disadvantages: [
    "The shared interface may force unnecessary methods on leaves (e.g., add() on a File, which must throw or be a no-op).",
    "Type safety is weakened where leaf and container truly differ — clients may need instanceof checks for container-specific behavior.",
    "Deeply nested trees risk stack overflow on recursion without an explicit stack or generator.",
  ],

  related: [
    {
      slug: "decorator",
      note: "Both use a common interface and recursion. Decorator wraps a single object to add behavior; Composite holds many children to build a tree.",
    },
    {
      slug: "iterator",
      note: "Composite trees are often traversed via Iterator — the walk() generator above is a hand-rolled example.",
    },
    {
      slug: "visitor",
      note: "Visitor separates operations over a Composite tree from the node classes themselves, useful when many unrelated operations must traverse the same tree.",
    },
  ],
};