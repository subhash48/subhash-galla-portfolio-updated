/**
 * The signature mark: an "S" traced as a compute graph. Six nodes, five
 * edges, the last node carrying the signal. Single simple geometric mark,
 * legible down to 16px. Reused as nav logo and favicon source.
 */

// S-skeleton, 32x32 grid
const NODES: [number, number][] = [
  [21, 8],
  [10, 8],
  [9, 15.5],
  [23, 16.5],
  [22, 24],
  [11, 24],
];

export function GraphMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Subhash Galla monogram"
      fill="none"
    >
      <path
        d={`M${NODES.map((n) => n.join(" ")).join(" L")}`}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />
      {NODES.map(([x, y], i) => {
        const last = i === NODES.length - 1;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={last ? 2.4 : 1.7}
            fill={last ? "currentColor" : "var(--canvas)"}
            stroke="currentColor"
            strokeWidth={1.4}
          />
        );
      })}
    </svg>
  );
}
