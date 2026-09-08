import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { portfolio } from "@/content/portfolio";

export default function Page() {
  const { person } = portfolio;

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Experience />
        <Capabilities />
        <Contact />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: person.name,
            jobTitle: person.role,
            email: portfolio.contact.primaryEmail,
            url: portfolio.meta.siteUrl,
            address: person.location,
            alumniOf: portfolio.education.map((e) => e.institution),
            knowsAbout: portfolio.capabilities.flatMap((g) => g.items).slice(0, 20),
            sameAs: portfolio.socials
              .filter((s) => s.href.startsWith("http"))
              .map((s) => s.href),
          }),
        }}
      />
    </>
  );
}
