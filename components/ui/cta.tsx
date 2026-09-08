import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

type Variant = "solid" | "line" | "ghost";

const base =
  "group/cta inline-flex items-center gap-2 rounded-control text-[0.9375rem] font-medium " +
  "transition-[transform,background-color,border-color,color] duration-[--dur-ui] ease-out " +
  "active:translate-y-px focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  solid:
    "bg-ink text-canvas px-5 py-2.5 hover:bg-white",
  line:
    "border border-line-strong text-ink px-5 py-2.5 hover:border-signal hover:text-signal",
  ghost:
    "text-ink-2 px-1.5 py-1 hover:text-ink",
};

export function Cta({
  href,
  children,
  variant = "solid",
  external,
  arrow = true,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  arrow?: boolean;
  className?: string;
}) {
  const isExternal = external ?? /^https?:|^mailto:|^tel:/.test(href);
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRightIcon
          weight="bold"
          className="size-4 transition-transform duration-[--dur-ui] ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
        />
      )}
    </>
  );

  return (
    <Magnetic strength={0.25}>
      {isExternal ? (
        <a
          href={href}
          className={cn(base, variants[variant], className)}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {content}
        </a>
      ) : (
        <Link href={href} className={cn(base, variants[variant], className)}>
          {content}
        </Link>
      )}
    </Magnetic>
  );
}
