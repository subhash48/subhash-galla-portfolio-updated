import { ImageResponse } from "next/og";
import { portfolio } from "@/content/portfolio";

export const alt = `${portfolio.person.name}, ${portfolio.person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const { person, hero } = portfolio;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 140% at 8% -10%, #6b5aa8 0%, transparent 46%), radial-gradient(120% 140% at 100% 120%, #c9518e 0%, transparent 42%), #0b0c14",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "#a49fc4" }}>
          {person.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 68,
              fontWeight: 700,
              color: "#f1efe9",
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              textTransform: "uppercase",
            }}
          >
            {hero.lines.join(" ")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 28,
              color: "#f3a8d6",
              letterSpacing: "-0.01em",
            }}
          >
            {person.role}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
