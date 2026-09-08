import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import { portfolio } from "@/content/portfolio";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import "./globals.css";

// Body / UI: a clean humanist grotesque.
const sans = Hanken_Grotesk({
  variable: "--ff-sans",
  subsets: ["latin"],
  display: "swap",
});

// Data / labels / coordinates: technical monospace.
const mono = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  display: "swap",
});

// Display voice: characterful grotesque, headlines only. Variable weight + opsz.
const display = Bricolage_Grotesque({
  variable: "--ff-display",
  subsets: ["latin"],
  display: "swap",
});

const { meta, person } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: {
    default: meta.title,
    template: `%s — ${person.name}`,
  },
  description: meta.description,
  applicationName: `${person.name} — Portfolio`,
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
  themeColor: "#0a0b0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <a href="#work" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
