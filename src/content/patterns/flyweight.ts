import type { Pattern } from "./schema";

export const flyweight: Pattern = {
  slug: "flyweight",
  name: "Flyweight",
  category: "structural",
  tagline: "Share intrinsic state across many instances to save memory.",

  introduction:
    "Flyweight uses sharing to support large numbers of fine-grained objects efficiently. The pattern splits an object's state into two parts: intrinsic state (shared, immutable, stored once) and extrinsic state (per-instance, passed in by the caller). When thousands — or millions — of similar objects would otherwise each carry a copy of the same data, factoring the shared part into a flyweight and holding only a reference per instance reduces memory by orders of magnitude.",

  problem:
    "A map renderer draws tens of thousands of icons — coffee shops, schools, hospitals — each with the same SVG, size, and color category. Storing the SVG path, dimensions, and color palette on every marker duplicates the same data per instance: 20,000 coffee shops each holding the same 8 KB SVG is 160 MB of identical bytes. The renderer runs out of memory on dense metropolitan areas, and the browser tab crashes.",

  solution:
    "Introduce a `MarkerStyle` flyweight that holds the intrinsic (shared) data: the SVG path, dimensions, color palette. A `MarkerStyleFactory` caches styles by key so there is exactly one instance per style. Each `MapMarker` instance holds only a reference to the shared style plus its extrinsic data (coordinates, label). Memory scales with the number of distinct styles, not the number of markers.",

  whenToUse: [
    "A very large number of objects share most of their state, differing only in a small part.",
    "The shared state is immutable and can be cached by key.",
    "Memory or allocation cost is the bottleneck — usually after profiling shows it, not before.",
    "Objects are conceptually distinct but structurally identical in most fields.",
  ],

  whenNotToUse: [
    "The number of objects is small — the factory adds indirection for no memory win.",
    "The 'shared' state is not immutable — mutable shared state creates aliasing bugs.",
    "The extrinsic state is large and per-instance anyway — little is actually saved.",
    "The cache would grow unbounded — flyweight factories must be bounded or evicted.",
  ],

  analogy:
    "A printing press uses one metal type block for the letter 'e' and prints thousands of pages with it. The block (intrinsic state) is shared; the position on each page (extrinsic state) is supplied per print. A typesetter who carved a new 'e' for every character would need thousands of identical blocks.",

  diagram: {
    content: `classDiagram
    class MapMarker {
      -lat: number
      -lng: number
      -label: string
      -style: MarkerStyle
      +render(ctx)
    }
    class MarkerStyle {
      <<flyweight>>
      +svgPath: string
      +width: number
      +height: number
      +color: string
    }
    class MarkerStyleFactory {
      -cache: Map~string,MarkerStyle~
      +get(key) MarkerStyle
    }
    MapMarker --> MarkerStyle : references
    MarkerStyleFactory --> MarkerStyle : caches`,
    description:
      "UML class diagram: MarkerStyle holds intrinsic (shared) data. MapMarker holds extrinsic data plus a reference to a MarkerStyle. MarkerStyleFactory caches one instance per key so thousands of markers share a handful of styles.",
  },

  example: {
    language: "ts",
    code: `class MarkerStyle {
  constructor(
    readonly svgPath: string,
    readonly width: number,
    readonly height: number,
    readonly color: string,
  ) {}
}

class MarkerStyleFactory {
  private cache = new Map<string, MarkerStyle>();

  get(styleKey: string): MarkerStyle {
    const existing = this.cache.get(styleKey);
    if (existing) return existing;

    const style = this.create(styleKey);
    this.cache.set(styleKey, style);
    return style;
  }

  private create(styleKey: string): MarkerStyle {
    // In real code this parses a bundled SVG; here it is illustrative.
    const [name, color] = styleKey.split(":");
    return new MarkerStyle(\`/icons/\${name}.svg\`, 24, 24, color);
  }

  get size(): number {
    return this.cache.size;
  }
}

class MapMarker {
  constructor(
    readonly lat: number,
    readonly lng: number,
    readonly label: string,
    readonly style: MarkerStyle,
  ) {}
}

// A million markers, a handful of styles.
const styles = new MarkerStyleFactory();
const markers: MapMarker[] = [];
for (let i = 0; i < 1_000_000; i++) {
  const style = styles.get(
    i % 10 === 0 ? "school:blue" : i % 3 === 0 ? "hospital:red" : "cafe:brown",
  );
  markers.push(new MapMarker(10 + i * 0.001, 20 + i * 0.001, \`M\${i}\`, style));
}

console.log(styles.size);  // 3, not 1_000_000`,
    explanation:
      "The factory ensures only three MarkerStyle instances exist regardless of how many markers are created. Each MapMarker holds the same intrinsic data (SVG path, size, color) by reference, plus its own extrinsic data (coordinates, label). Memory for the shared data is bounded by distinct styles, not by marker count — a common case where a few hundred KB of styles serve a million objects.",
  },

  advantages: [
    "Massive memory reduction when many objects share intrinsic state.",
    "The factory enforces that shared state is genuinely shared and immutable.",
    "Object creation cost for the shared part is paid once per style, not per instance.",
    "Encourages thinking about what is genuinely per-instance.",
  ],

  disadvantages: [
    "Adds a factory and a level of indirection to the code.",
    "Correctness depends on the shared state being truly immutable — mutable flyweights cause cross-instance bugs.",
    "The cache can grow unbounded if not bounded or evicted by key policy.",
    "Premature use is a real trap: flyweight is only worth it after profiling shows allocation pressure.",
  ],

  related: [
    {
      slug: "singleton",
      note: "Singleton restricts the number of instances to one. Flyweight restricts the number of instances to one per key, allowing many shared instances but one per distinct style.",
    },
    {
      slug: "composite",
      note: "Composite trees can use Flyweight for leaf nodes — many identical leaves share their data.",
    },
    {
      slug: "state",
      note: "State objects are frequently implemented as flyweights — a small number of state objects, shared by many context instances.",
    },
  ],
};
