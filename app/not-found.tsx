import Link from "next/link";
import { GraphMark } from "@/components/three/graph-mark";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-6">
      <div className="max-w-md text-center">
        <GraphMark className="mx-auto size-12 text-ink-4" />
        <p className="mt-8 font-mono text-5xl text-ink-4 tnum">404</p>
        <h1 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.03em] text-ink">
          This path doesn&rsquo;t resolve.
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-3">
          The node you were looking for isn&rsquo;t in the graph. It may have moved,
          or it never existed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-control border border-line-strong px-5 py-2.5 text-[0.9375rem] text-ink transition-colors hover:border-signal hover:text-signal"
        >
          Back to the index
        </Link>
      </div>
    </main>
  );
}
