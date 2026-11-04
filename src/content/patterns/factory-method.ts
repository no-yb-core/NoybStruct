import type { Pattern } from "./schema";

export const factoryMethod: Pattern = {
  slug: "factory-method",
  name: "Factory Method",
  category: "creational",
  tagline: "Let subclasses decide which concrete product to instantiate.",

  introduction:
    "Factory Method defines an interface for creating an object, but lets subclasses decide which class to instantiate. The base class contains the algorithm that uses the product and delegates the construction decision to subclasses through an abstract creation method. The base class never names a concrete product, so new product types can be introduced without changing it.",

  problem:
    "A processing pipeline needs to handle several file formats — PDF, Markdown, plain text — and the workflow (validate, parse, summarize, archive) is identical for all of them. If the pipeline branches on the file format to construct a parser, it is coupled to every parser and must be edited whenever a format is added, even though the workflow itself is unchanged.",

  solution:
    "Extract the parser construction into an abstract `createParser()` method on an abstract `DocumentProcessor`. The base class implements the whole workflow and calls `createParser()`. Each concrete processor subclass returns its own parser. Adding a new format is a new subclass; the workflow is inherited and never touched.",

  whenToUse: [
    "A class cannot anticipate which concrete product it must create.",
    "Subclasses should specify the objects they create while the base class orchestrates.",
    "You want to avoid a growing switch over product types inside a workflow class.",
    "You want the workflow to be reusable across product families by subclassing.",
  ],

  whenNotToUse: [
    "There is only one product and no foreseeable second — a direct `new` is clearer.",
    "Product selection depends on runtime data that subclasses cannot know — consider a simple factory function or Abstract Factory instead.",
    "The product's construction is trivial (no meaningful workflow to inherit).",
  ],

  analogy:
    "A bakery's cake-icing workflow — bake, cool, ice, decorate — is identical for every cake. The decoration step is a factory method: each cake subclass supplies its own decorator. The workflow code never knows which decorator it will get.",

  diagram: {
    content: `classDiagram
    class DocumentProcessor {
      <<abstract>>
      +process(file: Buffer)
      #createParser()* DocumentParser
    }
    class DocumentParser {
      <<interface>>
      +parse(file: Buffer)
    }
    class PDFProcessor
    class MarkdownProcessor
    class PDFParser
    class MarkdownParser
    DocumentProcessor <|-- PDFProcessor
    DocumentProcessor <|-- MarkdownProcessor
    DocumentProcessor --> DocumentParser
    PDFProcessor ..> PDFParser
    MarkdownProcessor ..> MarkdownParser
    DocumentParser <|.. PDFParser
    DocumentParser <|.. MarkdownParser`,
    description:
      "UML class diagram: an abstract DocumentProcessor defines the process() workflow and an abstract createParser() factory method. Concrete subclasses override createParser() to return a specific DocumentParser. The workflow never names a concrete parser.",
  },

  example: {
    language: "ts",
    code: `interface DocumentParser {
  parse(file: Buffer): Promise<ParsedDocument>;
}

class PDFParser implements DocumentParser {
  async parse(file: Buffer): Promise<ParsedDocument> {
    // pdf parsing logic
  }
}

class MarkdownParser implements DocumentParser {
  async parse(file: Buffer): Promise<ParsedDocument> {
    return { text: file.toString("utf8"), metadata: {} };
  }
}

abstract class DocumentProcessor {
  async process(file: Buffer): Promise<Summary> {
    const parser = this.createParser();
    const doc = await parser.parse(file);
    return this.summarize(doc);
  }

  // Factory Method — subclasses decide the product.
  protected abstract createParser(): DocumentParser;

  private summarize(doc: ParsedDocument): Summary {
    return { excerpt: doc.text.slice(0, 200), wordCount: doc.text.split(/\\s+/).length };
  }
}

class PDFProcessor extends DocumentProcessor {
  protected createParser(): DocumentParser {
    return new PDFParser();
  }
}

class MarkdownProcessor extends DocumentProcessor {
  protected createParser(): DocumentParser {
    return new MarkdownParser();
  }
}

// Caller picks the processor; the workflow is inherited.
const summary = await new PDFProcessor().process(pdfBuffer);`,
    explanation:
      "DocumentProcessor owns the workflow and never names a concrete parser. Each subclass supplies only its product through createParser(). Adding EPUB support means writing EPUBProcessor and EPUBParser — the base workflow does not change, and existing processors are not at risk.",
  },

  advantages: [
    "Decouples the workflow from concrete product classes.",
    "New products are added by subclassing, without editing the workflow.",
    "The workflow is written once and inherited — no duplication across variants.",
    "The factory method is a natural extension point for tests (returning fakes).",
  ],

  disadvantages: [
    "Requires a subclass per product, even when the workflow has one step.",
    "Introduces an abstract class into a language where composition is often preferable.",
    "The creation decision is fixed at subclass selection time — dynamic per-call creation needs a different pattern.",
  ],

  related: [
    {
      slug: "abstract-factory",
      note: "Factory Method creates one product; Abstract Factory creates families of related products consistently.",
    },
    {
      slug: "template-method",
      note: "Factory Method is often used inside a Template Method: the workflow is fixed, one step is overridden.",
    },
    {
      slug: "prototype",
      note: "Both defer object creation; Prototype avoids subclassing by cloning an existing instance instead.",
    },
  ],
};