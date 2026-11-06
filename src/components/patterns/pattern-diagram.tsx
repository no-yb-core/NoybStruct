type PatternDiagramProps = {
  content: string;
  description: string;
};

export function PatternDiagram({ content, description }: PatternDiagramProps) {
  return (
    <figure className="my-6 overflow-hidden rounded-md border border-border bg-card shadow-xs">
      {/* Blueprint Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/70 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Structural Schematic
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          UML Class Diagram
        </span>
      </div>

      {/* Diagram Canvas with subtle grid */}
      <div className="subtle-paper-grid p-6 bg-secondary/20">
        <pre
          aria-hidden="true"
          className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground scrollbar-thin"
        >
          {content}
        </pre>
      </div>

      {/* Caption footer */}
      <figcaption className="border-t border-border bg-secondary/40 px-4 py-3 text-xs italic text-muted-foreground">
        {description}
      </figcaption>
    </figure>
  );
}
