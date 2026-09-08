import { buildGraph, type Vec3 } from "./graph-data";

/**
 * Static projection of the same compute graph. Server-rendered: it is the
 * hero visual before hydration, and the permanent visual under
 * prefers-reduced-motion or when WebGL is unavailable.
 */

const VB = 560;
const CX = VB / 2;
const CY = VB / 2;
const SCALE = 84; // world units (~±3) -> px, keeps the S inside the frame

// weak-perspective front projection, matching the canvas resting angle
function project([x, y, z]: Vec3): [number, number, number] {
  const yaw = 0.14;
  const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const k = 1 / (1 + (9 + rz) * 0.03);
  return [CX + rx * SCALE * k, CY - y * SCALE * k, k];
}

export function GraphStill({ className }: { className?: string }) {
  const { nodes, edges } = buildGraph(24);
  const pts = nodes.map((n) => project(n.pos));

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className={className}
      role="img"
      aria-label="A compute graph: a signal path shaped like an S, threaded through a cloud of connected nodes"
      fill="none"
    >
      <g strokeLinecap="round">
        {edges.map((e, i) => {
          const [ax, ay] = pts[e.a];
          const [bx, by] = pts[e.b];
          return (
            <line
              key={i}
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke={e.spine ? "var(--signal)" : "var(--ink-4)"}
              strokeWidth={e.spine ? 2 : 0.8}
              opacity={e.spine ? 0.7 : 0.28}
            />
          );
        })}
        {nodes.map((n, i) => {
          const [x, y, k] = pts[i];
          const r = (n.spine ? 5 : 2.3) * (0.7 + k);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={n.spine ? "var(--signal-bright)" : "var(--ink-3)"}
              opacity={n.spine ? 1 : 0.35 + k * 0.35}
            />
          );
        })}
      </g>
    </svg>
  );
}
