import { diagrams } from "@/content/diagrams";
import { cn } from "@/lib/utils";

const COL_W = 168;
const ROW_H = 92;
const NODE_W = 132;
const NODE_H = 46;

function center(col: number, row: number) {
  return { x: col * COL_W + COL_W / 2, y: row * ROW_H + ROW_H / 2 };
}

/**
 * Architecture schematic for a project, in the signal-graph language.
 * Server-rendered SVG; the travelling signal is a CSS offset-path animation
 * that is removed under prefers-reduced-motion (see globals.css).
 */
export function PipelineDiagram({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const d = diagrams[slug];
  if (!d) return null;

  const w = d.cols * COL_W;
  const h = d.rows * ROW_H;
  const nodeById = Object.fromEntries(d.nodes.map((n) => [n.id, n]));

  const flowPath = d.flow
    .map((id, i) => {
      const n = nodeById[id];
      const c = center(n.col, n.row);
      return `${i === 0 ? "M" : "L"}${c.x} ${c.y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("w-full", className)}
      role="img"
      aria-label={`Architecture: ${d.flow.map((id) => nodeById[id].label).join(" to ")}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id={`arrow-${slug}`}
          viewBox="0 0 8 8"
          refX="6.5"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--ink-4)" strokeWidth="1.2" />
        </marker>
      </defs>

      {/* edges */}
      {d.edges.map((e, i) => {
        const a = center(nodeById[e.from].col, nodeById[e.from].row);
        const b = center(nodeById[e.to].col, nodeById[e.to].row);
        const sameRow = nodeById[e.from].row === nodeById[e.to].row;
        const x1 = a.x + (b.x > a.x ? NODE_W / 2 : b.x < a.x ? -NODE_W / 2 : 0);
        const y1 = a.y + (sameRow ? 0 : b.y > a.y ? NODE_H / 2 : -NODE_H / 2);
        const x2 = b.x + (b.x > a.x ? -NODE_W / 2 : b.x < a.x ? NODE_W / 2 : 0);
        const y2 = b.y + (sameRow ? 0 : b.y > a.y ? -NODE_H / 2 : NODE_H / 2);
        const midX = (x1 + x2) / 2;
        const path = sameRow
          ? `M${x1} ${y1} L${x2} ${y2}`
          : `M${x1} ${y1} C${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={e.feedback ? "var(--signal-dim)" : "var(--line-strong)"}
            strokeWidth={1.25}
            strokeDasharray={e.feedback ? "3 4" : undefined}
            markerEnd={`url(#arrow-${slug})`}
            opacity={e.feedback ? 0.7 : 1}
          />
        );
      })}

      {/* travelling signal */}
      <circle
        r="3.2"
        fill="var(--signal-bright)"
        className="diagram-signal"
        style={{ offsetPath: `path("${flowPath}")` } as React.CSSProperties}
      />

      {/* nodes */}
      {d.nodes.map((n) => {
        const c = center(n.col, n.row);
        const store = n.kind === "store";
        const io = n.kind === "input" || n.kind === "output";
        return (
          <g key={n.id} transform={`translate(${c.x - NODE_W / 2} ${c.y - NODE_H / 2})`}>
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={store ? 4 : io ? 23 : 6}
              fill="var(--surface-2)"
              stroke={io ? "var(--signal-dim)" : "var(--line-strong)"}
              strokeWidth={1}
            />
            <text
              x={NODE_W / 2}
              y={NODE_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill={io ? "var(--ink)" : "var(--ink-2)"}
              style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", letterSpacing: "0.01em" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
