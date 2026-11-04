import type { Challenge } from "./schema";

export const dataExportWorkflow: Challenge = {
  slug: "data-export-workflow",
  patternSlug: "template-method",
  difficulty: "intermediate",
  scenario:
    "Three data exporters — CSV, JSON, XML — share an identical workflow: fetch the source, transform to the target format, write the output, and emit an 'export.completed' event. The transform step differs per format. The workflow order is a product requirement: no exporter may fetch after writing, or emit before completing.",
  problem:
    "Each exporter has its own copy of the workflow. They have drifted: the CSV exporter emits the event before writing (a bug), the JSON exporter does not retry fetch failures, and adding 'export.compressing' to the workflow means editing all three. The workflow must be centralized.",
  codeSnippet: `// CSV
await fetchCsv(); transformCsv(); emit("export.completed"); writeCsv();
// JSON
await fetchJson(); transformJson(); writeJson(); emit("export.completed");
// XML
await fetchXml(); transformXml(); writeXml(); emit("export.completed");`,
  options: ["template-method", "strategy", "factory-method", "bridge"],
  explanation:
    "Template Method puts the workflow in an abstract base class and declares transform() as the only abstract step; subclasses supply only their transform. The order — fetch, transform, write, emit — becomes invariant, and the CSV bug cannot recur. Strategy varies the whole algorithm via composition — that is what you would want if the workflow itself varied, but here the workflow must not. Factory Method concerns product creation; Bridge separates two abstraction axes.",
};
