import type { Pattern } from "./schema";

export const abstractFactory: Pattern = {
  slug: "abstract-factory",
  name: "Abstract Factory",
  category: "creational",
  tagline: "Create families of related objects that must be consistent.",

  introduction:
    "Abstract Factory provides an interface for creating families of related or dependent objects without specifying their concrete classes. When several objects must be used together and mixing them would silently break the system — an SVG axis with a Canvas legend, say — the factory ensures the whole family is chosen together.",

  problem:
    "A chart renderer needs an axis, a legend, and a tooltip that all agree on the rendering backend. If callers construct each part individually, nothing stops them from picking an SVG axis with a Canvas legend, producing a chart that silently fails to display. Scattering `if (backend === 'svg')` across the renderer does not help: the constraint is that the three parts must match, not that each is independently valid.",

  solution:
    "Declare a `ChartFactory` interface with one creation method per part of the family. Concrete factories — `SVGChartFactory`, `CanvasChartFactory` — implement every method consistently. The renderer receives a factory and calls its methods; the family is chosen once, at composition time, and mixing parts becomes impossible.",

  whenToUse: [
    "A system must be independent of how its products are created and composed.",
    "Multiple families of related products must be used together consistently.",
    "The family choice is made once, at configuration or composition time.",
    "You want to enforce the invariant that parts of a family match — never mixing backends.",
  ],

  whenNotToUse: [
    "There is only one family, or families do not need to be kept consistent.",
    "Products do not depend on each other — separate factories or direct construction is simpler.",
    "The product set is large and changing — the factory interface becomes a maintenance burden, and a different composition strategy may fit better.",
  ],

  analogy:
    "A furniture showroom sells coordinated sets: a Victorian chair matches the Victorian sofa and table, and a Modern chair matches the Modern set. You cannot mix a Victorian chair with a Modern sofa — the showroom hands you one coordinated family.",

  diagram: {
    content: `classDiagram
    class ChartFactory {
      <<interface>>
      +createAxis(config) Axis
      +createLegend(config) Legend
      +createTooltip(config) Tooltip
    }
    class SVGChartFactory
    class CanvasChartFactory
    class ChartRenderer {
      -factory: ChartFactory
      +render(data)
    }
    ChartFactory <|.. SVGChartFactory
    ChartFactory <|.. CanvasChartFactory
    ChartRenderer --> ChartFactory`,
    description:
      "UML class diagram: a ChartFactory interface declares one creation method per product in the family. SVGChartFactory and CanvasChartFactory each implement the full family. ChartRenderer holds a factory and calls all three creation methods, receiving a consistent family.",
  },

  example: {
    language: "ts",
    code: `interface Axis { render(): void; }
interface Legend { render(): void; }
interface Tooltip { render(): void; }

interface ChartFactory {
  createAxis(config: AxisConfig): Axis;
  createLegend(config: LegendConfig): Legend;
  createTooltip(config: TooltipConfig): Tooltip;
}

class SVGChartFactory implements ChartFactory {
  createAxis(config: AxisConfig): Axis {
    return new SVGAxis(config);
  }
  createLegend(config: LegendConfig): Legend {
    return new SVGLegend(config);
  }
  createTooltip(config: TooltipConfig): Tooltip {
    return new SVGTooltip(config);
  }
}

class CanvasChartFactory implements ChartFactory {
  createAxis(config: AxisConfig): Axis {
    return new CanvasAxis(config);
  }
  createLegend(config: LegendConfig): Legend {
    return new CanvasLegend(config);
  }
  createTooltip(config: TooltipConfig): Tooltip {
    return new CanvasTooltip(config);
  }
}

class ChartRenderer {
  constructor(private factory: ChartFactory) {}

  render(data: DataSet): void {
    // All three parts come from the same factory — they are guaranteed to match.
    const axis = this.factory.createAxis({ ticks: 5 });
    const legend = this.factory.createLegend({ position: "top" });
    const tooltip = this.factory.createTooltip({ follow: true });
    axis.render();
    legend.render();
    tooltip.render();
  }
}

// Composition time picks the family; the renderer is family-agnostic.
const renderer = new ChartRenderer(
  useSVG ? new SVGChartFactory() : new CanvasChartFactory(),
);`,
    explanation:
      "ChartRenderer cannot accidentally mix an SVG axis with a Canvas legend, because it only ever calls one factory. Adding WebGL support means writing one WebGLChartFactory that implements every creation method — the renderer never changes. The family is a closed unit, and consistency is enforced by the type system, not by a runtime check.",
  },

  advantages: [
    "Guarantees that related products are used together — mixing families is impossible by construction.",
    "Isolates concrete product classes from client code.",
    "Swapping families is a single change at composition time.",
    "The factory interface documents exactly which products must agree.",
  ],

  disadvantages: [
    "Adding a new product to every family requires editing every factory implementation.",
    "Introduces a factory interface and one class per family per product.",
    "Overkill when families have a single product, or when products never depend on each other.",
  ],

  related: [
    {
      slug: "factory-method",
      note: "Both handle product creation. Factory Method defers one product choice to a subclass; Abstract Factory delegates a whole family to a factory object.",
    },
    {
      slug: "builder",
      note: "Both assemble complex objects. Builder constructs one object step by step; Abstract Factory returns a family in one call.",
    },
    {
      slug: "singleton",
      note: "Abstract Factory is often implemented as a Singleton when only one family is active at a time.",
    },
  ],
};
