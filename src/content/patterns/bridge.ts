import type { Pattern } from "./schema";

export const bridge: Pattern = {
  slug: "bridge",
  name: "Bridge",
  category: "structural",
  tagline: "Split an abstraction from its implementation so both can vary.",

  introduction:
    "Bridge decouples an abstraction from its implementation so the two can vary independently. When you notice two independent dimensions of variation — say, shape and rendering backend — keeping them in a single class hierarchy multiplies every variant across every dimension. Bridge factors the hierarchy into two branches: an abstraction that holds a reference to an implementation, and an implementation side that is free to grow on its own.",

  problem:
    "A drawing library needs to support circles and rectangles, each rendered to SVG, Canvas, or a terminal. Building each as a subclass of a common Shape would produce CircleSVG, CircleCanvas, CircleTerminal, RectangleSVG, RectangleCanvas, RectangleTerminal — six classes for two shapes and three backends. Adding a new shape triples the work; adding a backend triples it again. The two concerns — what to draw, and how to draw it — are entangled in one hierarchy.",

  solution:
    "Introduce a `Renderer` interface (implementation side) with the primitive drawing operations: drawCircle, drawRect. Introduce an abstract `Shape` (abstraction side) that holds a Renderer. Concrete shapes — Circle, Rectangle — implement draw() by calling primitive renderer operations. Concrete renderers — SVGRenderer, CanvasRenderer — implement the primitives. Adding a shape is one new class; adding a backend is one new class.",

  whenToUse: [
    "Two independent dimensions of variation exist (shape × renderer, format × protocol, message × transport).",
    "You want to avoid subclass explosion across combinatorial axes.",
    "You want to swap implementations at runtime (e.g., SVG in a test, Canvas in production).",
    "You want an abstraction to be extended without forcing every new variant to learn every implementation.",
  ],

  whenNotToUse: [
    "Only one dimension of variation exists — a plain class hierarchy is simpler.",
    "There is only one implementation and no plausible second — a direct dependency is fine.",
    "The abstraction and implementation are inherently coupled (the abstraction needs to know implementation-specific details to work).",
  ],

  analogy:
    "A television remote and the television itself: a TV manufacturer can ship many remotes (basic, advanced, accessibility) without redesigning the TV, and many TVs (CRT, LCD, OLED) without redesigning the remote — as long as they agree on the interface between them.",

  diagram: {
    content: `classDiagram
    class Shape {
      <<abstract>>
      #renderer: Renderer
      +draw()*
    }
    class Circle {
      +draw()
    }
    class Rectangle {
      +draw()
    }
    class Renderer {
      <<interface>>
      +drawCircle(x, y, r)
      +drawRect(x, y, w, h)
    }
    class SVGRenderer
    class CanvasRenderer
    Shape <|-- Circle
    Shape <|-- Rectangle
    Shape --> Renderer
    Renderer <|.. SVGRenderer
    Renderer <|.. CanvasRenderer`,
    description:
      "UML class diagram: an abstract Shape holds a Renderer interface, and concrete shapes (Circle, Rectangle) call primitive renderer methods. Concrete renderers (SVG, Canvas) implement the primitives. Shapes and renderers evolve independently.",
  },

  example: {
    language: "ts",
    code: `interface Renderer {
  drawCircle(x: number, y: number, radius: number): void;
  drawRect(x: number, y: number, width: number, height: number): void;
}

class SVGRenderer implements Renderer {
  drawCircle(x: number, y: number, radius: number): void {
    console.log(\`<circle cx="\${x}" cy="\${y}" r="\${radius}" />\`);
  }
  drawRect(x: number, y: number, width: number, height: number): void {
    console.log(\`<rect x="\${x}" y="\${y}" width="\${width}" height="\${height}" />\`);
  }
}

class CanvasRenderer implements Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}
  drawCircle(x: number, y: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  drawRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeRect(x, y, width, height);
  }
}

abstract class Shape {
  constructor(protected renderer: Renderer) {}
  abstract draw(): void;
}

class Circle extends Shape {
  constructor(renderer: Renderer, private x: number, private y: number, private r: number) {
    super(renderer);
  }
  draw(): void {
    this.renderer.drawCircle(this.x, this.y, this.r);
  }
}

class Rectangle extends Shape {
  constructor(renderer: Renderer, private x: number, private y: number, private w: number, private h: number) {
    super(renderer);
  }
  draw(): void {
    this.renderer.drawRect(this.x, this.y, this.w, this.h);
  }
}

// Pick the pair at runtime — shapes and renderers are orthogonal.
const renderer: Renderer = useSVG ? new SVGRenderer() : new CanvasRenderer(ctx);
new Circle(renderer, 10, 10, 5).draw();
new Rectangle(renderer, 0, 0, 100, 50).draw();`,
    explanation:
      "Two shapes × two renderers = four combinations, but only four classes exist — not four shape-renderer pairs. Adding a third shape (Triangle) means writing one new class. Adding a third renderer (TerminalRenderer) means writing one new class. The same Circle instance can be rendered to SVG or Canvas by passing a different renderer at construction time, without touching Circle.",
  },

  advantages: [
    "Avoids subclass explosion when two independent dimensions of variation exist.",
    "Abstractions and implementations evolve independently, each reviewable and testable in isolation.",
    "Implementations can be swapped at runtime — including for tests.",
    "Cleanly separates 'what' (shape, format, message) from 'how' (renderer, encoder, transport).",
  ],

  disadvantages: [
    "Introduces two parallel hierarchies and one extra indirection.",
    "Only pays off when both dimensions genuinely vary; a single-variation problem gets unnecessary complexity.",
    "The initial design cost is higher — you have to identify the two axes correctly up front.",
  ],

  related: [
    {
      slug: "adapter",
      note: "Adapter adapts an existing incompatible interface; Bridge designs two interfaces up front so both can vary independently.",
    },
    {
      slug: "strategy",
      note: "Bridge is structurally similar to Strategy (composition over an interface), but Bridge separates an abstraction hierarchy from an implementation hierarchy, while Strategy substitutes a single algorithm.",
    },
    {
      slug: "abstract-factory",
      note: "Abstract Factory can create the paired Renderer + Shape combinations; Bridge defines how they compose once created.",
    },
  ],
};
