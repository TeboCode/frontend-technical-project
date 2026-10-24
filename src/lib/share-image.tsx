// Branded 1200×630 image used when pages are shared (Open Graph / X cards).
// Rendered at build time by app/opengraph-image.tsx and app/twitter-image.tsx.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const shareImageSize = { width: 1200, height: 630 };

const colors = {
  background: "#f4f6fa",
  heading: "#3f4349",
  body: "#5f6368",
  brand: "#43a047",
};

/**
 * The favicon SVG is the single source of the logo mark. Cached so the image
 * routes can be prerendered at build time instead of rendering per request.
 */
async function logoMarkDataUri() {
  "use cache";
  cacheLife("max");
  const mark = await readFile(join(process.cwd(), "src/app/icon.svg"));
  return `data:image/svg+xml;base64,${mark.toString("base64")}`;
}

/** Inter (the site font) from @fontsource; ImageResponse accepts .woff but not .woff2. */
async function interFont(weight: 400 | 700) {
  "use cache";
  cacheLife("max");
  const file = join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`);
  return (await readFile(file)).toString("base64");
}

export async function renderShareImage() {
  const [markSrc, regular, bold] = await Promise.all([logoMarkDataUri(), interFont(400), interFont(700)]);
  const [headline, emphasis] = siteConfig.tagline.split(". ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          fontFamily: "Inter",
          background: colors.background,
          borderBottom: `16px solid ${colors.brand}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={markSrc} width={112} height={112} alt="" />
          <div style={{ fontSize: 64, fontWeight: 700, color: colors.heading }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* One string child: ImageResponse needs display:flex for multiple children. */}
          <div style={{ fontSize: 60, fontWeight: 700, color: colors.heading, lineHeight: 1.1 }}>
            {`${headline}.`}
          </div>
          <div style={{ fontSize: 60, fontWeight: 700, color: colors.brand, lineHeight: 1.1 }}>
            {emphasis}
          </div>
        </div>

        <div style={{ fontSize: 28, color: colors.body }}>{new URL(siteConfig.url).host}</div>
      </div>
    ),
    {
      ...shareImageSize,
      fonts: [
        { name: "Inter", data: Buffer.from(regular, "base64"), weight: 400, style: "normal" },
        { name: "Inter", data: Buffer.from(bold, "base64"), weight: 700, style: "normal" },
      ],
    },
  );
}
