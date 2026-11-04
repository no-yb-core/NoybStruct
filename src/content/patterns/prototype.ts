import type { Pattern } from "./schema";

export const prototype: Pattern = {
  slug: "prototype",
  name: "Prototype",
  category: "creational",
  tagline: "Clone a pre-configured instance instead of building from scratch.",

  introduction:
    "Prototype creates new objects by cloning an existing, pre-configured instance rather than invoking a constructor. When construction is expensive, requires many dependent objects, or the caller only knows a template it wants a variation of, cloning a prototype is simpler and safer than reconstructing — provided the clone is a genuine deep copy.",

  problem:
    "A form system needs dozens of similar forms — onboarding, KYC, support ticket — that share field order, validators, and layout but differ in a handful of fields. Reconstructing each form from a constructor means duplicating the shared setup at every call site and risking drift. Copying an existing form by reference causes a worse bug: edits to the copy silently mutate the original and every other form derived from it.",

  solution:
    "Give every clonable object a clone() method that returns a deep copy. A caller that wants a variation starts from a registered template, clones it, and modifies only the differing parts. The clone is independent — mutations to it do not touch the template or siblings — and construction cost is paid once per template, not once per instance.",

  whenToUse: [
    "Objects share substantial configuration, and only small parts differ per instance.",
    "Construction is expensive (I/O, network, heavy computation) and can be cached as a prototype.",
    "The set of possible configurations is fixed and can be registered as named templates.",
    "The client cannot know the concrete classes of the objects it clones — it holds prototypes.",
  ],

  whenNotToUse: [
    "Construction is cheap and parameter lists are short — new is clearer and faster.",
    "Objects hold uncloneable resources (open sockets, database connections) that must not be duplicated.",
    "The object's structure is trivially flat and structuredClone is sufficient without a class.",
  ],

  analogy:
    "A pastry chef keeps a set of master stencils: to make a new cookie shape, they dust a stencil and press a fresh sheet, rather than re-carving the mold for every batch. The stencil is the prototype, and each cookie is an independent copy — cutting one does not damage the stencil.",

  diagram: {
    content: `classDiagram
    class FormTemplate {
      +fields: FormField[]
      +validators: Validator[]
      +layout: LayoutConfig
      +clone() FormTemplate
      +withField(f) FormTemplate
    }
    class FormField {
      +name: string
      +label: string
      +options?: string[]
    }
    FormTemplate --> "0..*" FormField : contains`,
    description:
      "UML class diagram: FormTemplate exposes clone() returning a deep copy and a withField() that clones-and-extends in one step. Callers derive new templates from existing ones without invoking a constructor directly.",
  },

  example: {
    language: "ts",
    code: `interface FormField {
  name: string;
  label: string;
  options?: string[];
}

interface LayoutConfig {
  columns: 1 | 2 | 3;
  gaps: [number, number];
}

class FormTemplate {
  constructor(
    readonly name: string,
    readonly fields: FormField[],
    readonly validators: string[],
    readonly layout: LayoutConfig,
  ) {}

  clone(): FormTemplate {
    return new FormTemplate(
      this.name,
      this.fields.map((f) => ({
        ...f,
        options: f.options ? [...f.options] : undefined,
      })),
      [...this.validators],
      { ...this.layout, gaps: [...this.layout.gaps] },
    );
  }

  withField(field: FormField): FormTemplate {
    const next = this.clone();
    next.fields.push(field);
    return next;
  }
}

// A template is built once and reused.
const onboardingTemplate = new FormTemplate(
  "onboarding",
  [
    { name: "email", label: "Email" },
    { name: "password", label: "Password" },
  ],
  ["required", "email"],
  { columns: 1, gaps: [12, 12] },
);

const kycTemplate = onboardingTemplate.withField({
  name: "country",
  label: "Country",
  options: ["US", "GB", "DE", "JP"],
});

kycTemplate.fields[2].options?.push("CA");
// onboardingTemplate.fields is unchanged — clone was deep.`,
    explanation:
      "onboardingTemplate is constructed once and never mutated. Each derived template is a deep clone — nested fields, options arrays, and layout tuples are copied, so mutations on one template cannot leak into siblings or the original. withField() expresses 'derive and add' in one readable step, and the shared validation rules and layout are inherited for free.",
  },

  advantages: [
    "Avoids duplicating initialization logic across similar objects.",
    "Hides the concrete class from the client — clones are obtained from prototypes.",
    "Reduces constructor cost when the prototype is expensive to build once.",
    "withX() helpers make derivation-from-template a first-class operation.",
  ],

  disadvantages: [
    "Deep cloning is easy to get wrong — nested objects must be copied explicitly (or via structuredClone).",
    "Objects holding resources (sockets, file handles) cannot be safely cloned without special handling.",
    "Cloning can bypass invariants that a constructor enforces — a misconfigured prototype multiplies.",
  ],

  related: [
    {
      slug: "factory-method",
      note: "Both defer construction. Factory Method delegates to a subclass; Prototype delegates to an existing instance.",
    },
    {
      slug: "memento",
      note: "Memento captures state to restore later; Prototype captures state to derive new instances. Both rely on careful copying.",
    },
    {
      slug: "singleton",
      note: "An object that is both unique and cloned is a contradiction — if you find yourself wanting both, you probably want distinct prototypes registered by key instead.",
    },
  ],
};
