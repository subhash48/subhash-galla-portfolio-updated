import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6" style={{ background: "var(--ground)" }}>
      <div className="max-w-md text-center">
        <p className="display tnum" style={{ fontSize: "3.5rem", color: "var(--ink-4)" }}>404</p>
        <h1 className="display" style={{ marginTop: "1rem", fontSize: "clamp(1.75rem,4vw,2.5rem)", textTransform: "none" }}>
          This path doesn&rsquo;t resolve.
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--ink-3)" }}>
          The page you were looking for isn&rsquo;t here. It may have moved, or it never existed.
        </p>
        <Link
          href="/"
          className="link"
          style={{ marginTop: "2rem", display: "inline-flex", padding: "0.625rem 1.25rem", border: "1px solid var(--line-strong)", borderRadius: "var(--r-control)" }}
        >
          Back to the film
        </Link>
      </div>
    </main>
  );
}
