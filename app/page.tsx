import { Nav } from "@/components/layout/nav";
import { Film } from "@/components/film/film";
import { Rail } from "@/components/film/rail";
import { portfolio } from "@/content/portfolio";

export default function Page() {
  const { person } = portfolio;

  return (
    <>
      <Nav />
      <Film />
      <Rail />

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
