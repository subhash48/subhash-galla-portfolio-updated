import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { portfolio } from "@/content/portfolio";
import { Grain } from "@/components/motion/grain";
import { Cursor } from "@/components/motion/cursor";
import "./globals.css";

/**
 * Before first paint: decide whether the film scrolls or the page is a static
 * document. The server renders `static` (so no-JS readers get a document);
 * this flips it to `scroll` when motion is welcome and the viewport can pin.
 * The engine re-evaluates the same test on resize.
 */
const boot = `(function(){var d=document.documentElement;try{var r=matchMedia("(prefers-reduced-motion: reduce)").matches;d.dataset.film=(r||innerHeight<480)?"static":"scroll"}catch(e){d.dataset.film="static"}})();`;

// Display: Archivo, semi-expanded via the width axis. Title cards, uppercase.
const display = Archivo({
  variable: "--ff-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const { meta, person } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: {
    default: meta.title,
    template: `%s · ${person.name}`,
  },
  description: meta.description,
  applicationName: `${person.name}, portfolio`,
  authors: [{ name: person.name }],
  creator: person.name,
  keywords: [
    person.name,
    "AI engineer",
    "software engineer",
    "LLM systems",
    "RAG",
    "full-stack",
    "machine learning",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: meta.siteUrl,
    siteName: person.name,
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-film="static"
      className={`${display.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#work" className="skip-link">
          Skip to the work
        </a>
        {children}
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
