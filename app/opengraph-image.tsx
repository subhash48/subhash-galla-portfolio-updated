import { ImageResponse } from "next/og";
import { portfolio } from "@/content/portfolio";

export const alt = `${portfolio.person.name} — ${portfolio.person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const { person } = portfolio;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0b0d",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        {/* the S signal path */}
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <path
            d="M21 8 L10 8 L9 15.5 L23 16.5 L22 24 L11 24"
            stroke="#eaa94b"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
          <circle cx="11" cy="24" r="2.6" fill="#f7bd63" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 76,
              color: "#f3f4f6",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            <span>AI systems that stay&nbsp;</span>
            <span style={{ color: "#eaa94b" }}>grounded.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#868b93",
              letterSpacing: "-0.01em",
            }}
          >
            {`${person.name}   ·   ${person.role}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
