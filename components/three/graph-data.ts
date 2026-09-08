/*
  The compute graph behind the hero. A deterministic node/edge layout:
  a load-bearing "S" path threaded through a cloud of satellite nodes,
  everything wired forward like a small inference pipeline.

  Deterministic (seeded) so a server-rendered still and the live canvas agree.
*/

export type Vec3 = [number, number, number];

export interface GraphNode {
  id: number;
  pos: Vec3;
  /** on the primary signal path */
  spine: boolean;
  /** 0..1, drives size + brightness */
  weight: number;
}

export interface GraphEdge {
  a: number;
  b: number;
  spine: boolean;
}

// The S, top to bottom. x in [-2.2, 2.1], y in [-2.7, 2.6], gentle z.
const SPINE: Vec3[] = [
  [1.95, 2.55, 0.18],
  [-1.55, 2.42, -0.32],
  [-2.05, 0.95, 0.42],
  [0.08, 0.12, -0.12],
  [2.02, -0.85, 0.34],
  [1.62, -2.35, -0.22],
  [-1.85, -2.52, 0.26],
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dist(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function buildGraph(satelliteCount = 26): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  spineIds: number[];
} {
  const rand = mulberry32(20260908);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // 1. spine nodes
  const spineIds: number[] = [];
  SPINE.forEach((pos, i) => {
    nodes.push({ id: i, pos, spine: true, weight: 0.7 + 0.3 * Math.sin(i) ** 2 });
    spineIds.push(i);
    if (i > 0) edges.push({ a: i - 1, b: i, spine: true });
  });

  // 2. satellites, biased toward the spine's vertical band, always offset
  //    far enough that they never sit on top of a spine node
  const off = (r: number, min: number, span: number) => {
    const u = (r - 0.5) * 2;
    return (u < 0 ? -1 : 1) * (min + Math.abs(u) * span);
  };
  for (let s = 0; s < satelliteCount; s++) {
    const id = nodes.length;
    const anchor = SPINE[Math.floor(rand() * SPINE.length)];
    const pos: Vec3 = [
      anchor[0] + off(rand(), 0.7, 2.1),
      anchor[1] + off(rand(), 0.5, 1.6),
      off(rand(), 0.4, 1.6),
    ];
    nodes.push({ id, pos, spine: false, weight: 0.22 + rand() * 0.5 });

    // wire to the 2 nearest existing nodes (forward-ish graph)
    const near = nodes
      .filter((n) => n.id !== id)
      .map((n) => ({ n, d: dist(n.pos, pos) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 2 + (rand() > 0.7 ? 1 : 0));
    near.forEach(({ n }) => edges.push({ a: n.id, b: id, spine: false }));
  }

  return { nodes, edges, spineIds };
}

/** Length of the polyline through the spine, for signal timing. */
export function spineLength(nodes: GraphNode[], spineIds: number[]) {
  let len = 0;
  for (let i = 1; i < spineIds.length; i++) {
    len += dist(nodes[spineIds[i - 1]].pos, nodes[spineIds[i]].pos);
  }
  return len;
}
