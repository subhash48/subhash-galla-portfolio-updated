import { cn } from "@/lib/utils";

/**
 * The one glass material: dark, smoked, transparent. Its rims and internal
 * highlight are lit by the current film frame (--glass-rim-*, --glass-hi in
 * app/globals.css), so it re-tints as the sequence moves without any prop.
 * Used sparingly: project metadata, experience detail, capability notes.
 * Never the page structure.
 */
export function Glass({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: "div" | "aside" | "figure";
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn("glass", className)} {...rest}>
      {children}
    </Tag>
  );
}
