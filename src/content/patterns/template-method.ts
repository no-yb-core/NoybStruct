import type { Pattern } from "./schema";

export const templateMethod: Pattern = {
  slug: "template-method",
  name: "Template Method",
  category: "behavioral",
  tagline:
    "Fix an algorithm's skeleton in a base class; let subclasses fill in steps.",

  introduction:
    "Template Method defines the skeleton of an algorithm in an operation, deferring some steps to subclasses. The base class implements the algorithm — the ordering, the invariants, the error handling — and declares one or more `protected abstract` steps that subclasses fill in. Subclasses can extend the algorithm's steps but cannot reorder them. This is the classic inheritance-based answer to 'vary part of a process' — Strategy is its composition-based counterpart.",

  problem:
    "A data ingestion service imports records from three sources: a nightly SFTP drop of CSVs, a JSON webhook, and an Excel file uploaded by admins. Each source has a different parse step and a slightly different validation step, but the workflow is identical: acquire → parse → validate → normalize → persist → emit. If each source implements the workflow independently, the ordering drifts, error handling diverges, and a new invariant — say 'commit in transaction' — has to be added to three places.",

  solution:
    "Put the workflow in an abstract `BaseImporter` with a single `import()` method that calls `acquire()`, `parse()`, `validate()`, `normalize()`, `persist()`, and `emit()`. The base class implements the orchestration (step order, transaction wrapping, retry on transient failures). Only `parse()` and `validate()` are abstract — the steps that genuinely differ per source. `CSVImporter`, `JSONImporter`, `ExcelImporter` implement those two and inherit everything else.",

  whenToUse: [
    "Several variants of a process share the same skeleton, differing only in a few steps.",
    "The ordering and invariants of the algorithm must be controlled centrally, not per subclass.",
    "Subclasses should not be allowed to reorder steps — the order is part of the contract.",
    "You want to add new invariants (transaction wrapping, retries, metrics) to all variants at once.",
  ],

  whenNotToUse: [
    "The variants differ in the whole algorithm, not just a step — Strategy or a factory is a better fit.",
    "The language prefers composition over inheritance, or the base class hierarchy would grow wide.",
    "The 'skeleton' is one or two lines — inlining and duplicating is clearer than a base class.",
    "Steps need to be swapped at runtime — Template Method's variation is fixed at compile time by subclass choice.",
  ],

  analogy:
    "A recipe card for bread: mix, knead, proof, shape, bake, cool. Different breads — sourdough, ciabatta, rye — fill in their own flour mix and proofing times. The card does not change. Every baker follows the same six steps in the same order; what varies is what they put into the steps.",

  diagram: {
    content: `classDiagram
    class BaseImporter {
      <<abstract>>
      +import(source) void
      #acquire(source)* RawData
      #parse(raw)* Record[]
      #validate(record) ValidationResult
      #normalize(record) NormalizedRecord
      #persist(records) void
    }
    class CSVImporter {
      #acquire(source)
      #parse(raw)
    }
    class JSONImporter {
      #acquire(source)
      #parse(raw)
    }
    BaseImporter <|-- CSVImporter
    BaseImporter <|-- JSONImporter`,
    description:
      "UML class diagram: BaseImporter implements import() as a fixed sequence of step calls. Subclasses override only the abstract steps that genuinely differ — in this case acquire() and parse(), while validate(), normalize(), and persist() are inherited. The order of steps is owned by the base class.",
  },

  example: {
    language: "ts",
    code: `interface Record { [key: string]: unknown }
interface RawData { source: string; body: string }

abstract class BaseImporter {
  async import(source: string): Promise<{ imported: number }> {
    const raw = await this.acquire(source);
    const records = await this.parse(raw);
    const validated: Record[] = [];
    for (const record of records) {
      const result = this.validate(record);
      if (!result.ok) {
        this.onValidationError(record, result.errors);
        continue;
      }
      validated.push(this.normalize(record));
    }
    await this.persist(validated);
    return { imported: validated.length };
  }

  // Hook — subclasses may override to customize, base implementation is a no-op.
  protected onValidationError(_record: Record, _errors: string[]): void {}

  protected abstract acquire(source: string): Promise<RawData>;
  protected abstract parse(raw: RawData): Promise<Record[]>;

  // Defaults — overridable but usually inherited as-is.
  protected validate(record: Record): { ok: boolean; errors: string[] } {
    return { ok: true, errors: [] };
  }
  protected normalize(record: Record): Record {
    return record;
  }
  protected async persist(records: Record[]): Promise<void> {
    // bulk insert, transaction-wrapped
  }
}

class CSVImporter extends BaseImporter {
  protected async acquire(source: string): Promise<RawData> {
    const res = await fetch(source);
    return { source, body: await res.text() };
  }
  protected async parse(raw: RawData): Promise<Record[]> {
    const [header, ...rows] = raw.body.split("\\n");
    const cols = header.split(",");
    return rows.map((row) => {
      const cells = row.split(",");
      return Object.fromEntries(cols.map((col, i) => [col, cells[i]]));
    });
  }
}

class JSONImporter extends BaseImporter {
  protected async acquire(source: string): Promise<RawData> {
    const res = await fetch(source);
    return { source, body: await res.text() };
  }
  protected async parse(raw: RawData): Promise<Record[]> {
    return JSON.parse(raw.body);
  }
  protected validate(record: Record): { ok: boolean; errors: string[] } {
    const errors: string[] = [];
    if (typeof record.id !== "string") errors.push("id must be a string");
    return { ok: errors.length === 0, errors };
  }
}

// Both callers use the same import() — the workflow is inherited.
const csvResult = await new CSVImporter().import("https://example.com/data.csv");
const jsonResult = await new JSONImporter().import("https://example.com/data.json");`,
    explanation:
      "The base class owns the sequence: acquire → parse → validate → normalize → persist, plus the per-record error handling hook. CSVImporter and JSONImporter differ only in how they acquire and parse — they cannot skip validation or persist out of order, because the base class does not expose those steps. Adding 'bulk insert in a transaction' or 'emit an audit event on every persist' means editing one method in BaseImporter and every importer gets the improvement for free.",
  },

  advantages: [
    "The skeleton is written once and enforced — subclasses cannot reorder steps.",
    "Cross-cutting invariants (transactions, retries, metrics) live in one place.",
    "Subclasses are small — they implement only the genuinely variant steps.",
    "Adding a new variant is a new subclass, not a new copy of the workflow.",
  ],

  disadvantages: [
    "Uses inheritance, which is rigid — steps cannot be swapped at runtime.",
    "Fragile base class: adding an abstract step forces every subclass to implement it.",
    "The base class is not always the best place for invariants — a wrapper or Strategy is often cleaner.",
    "Test doubles for subclasses must satisfy the base class contract, not just the abstract methods.",
  ],

  related: [
    {
      slug: "strategy",
      note: "Template Method varies steps via inheritance; Strategy varies the whole algorithm via composition. The choice between them is 'do I own the skeleton or the algorithm?'",
    },
    {
      slug: "factory-method",
      note: "Factory Method is often used as one step inside a Template Method — the workflow is fixed, product construction is the varying step.",
    },
    {
      slug: "visitor",
      note: "Both separate operations from data. Template Method fixes the sequence of steps; Visitor fixes the set of operations across a type hierarchy. They address orthogonal concerns.",
    },
  ],
};
