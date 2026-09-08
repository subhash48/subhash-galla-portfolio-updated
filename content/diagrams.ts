/*
  Honest architecture schematics per project. Not screenshots, not decoration:
  each is the actual data path through the system, drawn in the signal-graph
  language. Keyed by project slug.
*/

export type DiagramNode = {
  id: string;
  label: string;
  /** column (x) and row (y) on a small grid */
  col: number;
  row: number;
  kind?: "input" | "step" | "store" | "output" | "check";
};

export type DiagramEdge = {
  from: string;
  to: string;
  /** dashed = feedback / conditional path */
  feedback?: boolean;
  label?: string;
};

export type Diagram = {
  cols: number;
  rows: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** ids forming the primary signal flow, in order */
  flow: string[];
};

export const diagrams: Record<string, Diagram> = {
  "retrieval-augmented-chatbot": {
    cols: 5,
    rows: 3,
    nodes: [
      { id: "q", label: "Question", col: 0, row: 1, kind: "input" },
      { id: "ret", label: "Retriever", col: 1, row: 1, kind: "step" },
      { id: "docs", label: "Domain docs", col: 1, row: 0, kind: "store" },
      { id: "ctx", label: "Context", col: 2, row: 1, kind: "step" },
      { id: "llm", label: "LLM", col: 3, row: 1, kind: "step" },
      { id: "ans", label: "Grounded answer", col: 4, row: 1, kind: "output" },
      { id: "eval", label: "Relevance eval", col: 3, row: 2, kind: "check" },
    ],
    edges: [
      { from: "q", to: "ret" },
      { from: "docs", to: "ret" },
      { from: "ret", to: "ctx" },
      { from: "ctx", to: "llm" },
      { from: "llm", to: "ans" },
      { from: "ans", to: "eval", feedback: true },
    ],
    flow: ["q", "ret", "ctx", "llm", "ans"],
  },

  "nl-robot-task-planner": {
    cols: 5,
    rows: 3,
    nodes: [
      { id: "nl", label: "“pick, move, place”", col: 0, row: 1, kind: "input" },
      { id: "plan", label: "LLM planner", col: 1, row: 1, kind: "step" },
      { id: "parse", label: "Parse", col: 2, row: 1, kind: "step" },
      { id: "valid", label: "Validate", col: 3, row: 1, kind: "check" },
      { id: "steps", label: "JSON action steps", col: 4, row: 1, kind: "output" },
    ],
    edges: [
      { from: "nl", to: "plan" },
      { from: "plan", to: "parse" },
      { from: "parse", to: "valid" },
      { from: "valid", to: "steps", label: "valid" },
      { from: "valid", to: "plan", feedback: true, label: "re-prompt" },
    ],
    flow: ["nl", "plan", "parse", "valid", "steps"],
  },

  "food-logging-app": {
    cols: 4,
    rows: 3,
    nodes: [
      { id: "rn", label: "React Native / Expo", col: 0, row: 1, kind: "input" },
      { id: "api", label: "REST API", col: 1, row: 1, kind: "step" },
      { id: "prisma", label: "Prisma", col: 2, row: 1, kind: "step" },
      { id: "pg", label: "PostgreSQL", col: 3, row: 1, kind: "store" },
    ],
    edges: [
      { from: "rn", to: "api" },
      { from: "api", to: "prisma" },
      { from: "prisma", to: "pg" },
    ],
    flow: ["rn", "api", "prisma", "pg"],
  },
};
