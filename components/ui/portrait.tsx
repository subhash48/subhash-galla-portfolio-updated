"use client";

import { useState } from "react";
import { GraphMark } from "@/components/three/graph-mark";

/**
 * Headshot with a graceful fallback: if the file is not present yet, the
 * frame shows the monogram instead of a broken image. Explicit dimensions
 * keep it from shifting layout.
 */
export function Portrait({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={
        "relative aspect-[4/5] overflow-hidden rounded-media border border-line bg-surface-1 " +
        (className ?? "")
      }
    >
      {showFallback ? (
        <div className="grid h-full place-items-center">
          <GraphMark className="size-16 text-ink-4" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover grayscale contrast-[1.05] transition-[filter] duration-500 hover:grayscale-0"
        />
      )}
    </div>
  );
}
