import type { Icon } from "@phosphor-icons/react";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeSimpleIcon,
  XLogoIcon,
  FileTextIcon,
  GraduationCapIcon,
  GlobeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { portfolio } from "@/content/portfolio";
import type { Social } from "@/content/types";

const ICONS: Record<Social["kind"], Icon> = {
  github: GithubLogoIcon,
  linkedin: LinkedinLogoIcon,
  email: EnvelopeSimpleIcon,
  x: XLogoIcon,
  resume: FileTextIcon,
  scholar: GraduationCapIcon,
  website: GlobeIcon,
};

const LABELS: Record<Social["kind"], string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  x: "X",
  resume: "Résumé",
  scholar: "Scholar",
  website: "Website",
};

export function SocialRow({ className }: { className?: string }) {
  const items = portfolio.socials.filter((s) => s.href);

  return (
    <ul className={"flex flex-wrap items-center gap-x-6 gap-y-3 " + (className ?? "")}>
      {items.map((s) => {
        const Ico = ICONS[s.kind];
        const external = s.href.startsWith("http");
        return (
          <li key={s.kind}>
            <a
              href={s.href}
              {...(external ? { target: "_blank", rel: "me noreferrer" } : {})}
              className="group inline-flex items-center gap-2 text-[0.875rem] text-ink-3 transition-colors duration-[--dur-ui] hover:text-ink"
            >
              <Ico className="size-4 text-ink-4 transition-colors duration-[--dur-ui] group-hover:text-signal" />
              {LABELS[s.kind]}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
