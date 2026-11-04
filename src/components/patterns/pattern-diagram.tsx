type PatternDiagramProps = {
  content: string;
  description: string;
};

export function PatternDiagram({ content, description }: PatternDiagramProps) {
  return (
    <figure className="my-8 border border-border bg-secondary/40 p-4">
      <pre
        aria-hidden="true"
        className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground"
      >
        {content}
      </pre>
      <figcaption className="mt-4 border-t border-border pt-3 text-sm italic text-muted-foreground">
        {description}
      </figcaption>
    </figure>
  );
}
