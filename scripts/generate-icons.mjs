// Generates the bitmap app icons from src/app/icon.svg (the single source):
//   src/app/favicon.ico    16, 32 and 48px, for older browsers and Windows
//   src/app/apple-icon.png 180px, for iOS home screens
// Run with `npm run icons` after editing icon.svg, and commit the output.
// Next.js picks these files up by name and adds the <link> tags itself.

import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const appDir = new URL("../src/app/", import.meta.url);
const svg = await readFile(new URL("icon.svg", appDir), "utf8");

/** Rasterises an SVG at an exact pixel size. The viewBox is 32 units wide. */
function render(source, size) {
  return sharp(Buffer.from(source), { density: (72 * size) / 32 })
    .resize(size, size)
    .png()
    .toBuffer();
}

/** Packs PNG images into an .ico container (PNG-in-ICO, supported by all current browsers). */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

// iOS applies its own rounded mask and needs an opaque, full-bleed square, so
// the apple icon drops the tile's rounded corners and gives the mark more room.
function appleVariant(source) {
  const square = source.replace('rx="7"', 'rx="0"');
  const padded = square
    .replace('<g fill-rule="evenodd">', '<g transform="translate(3.2 3.2) scale(0.8)"><g fill-rule="evenodd">')
    .replace("</g>\n</svg>", "</g></g>\n</svg>");
  if (square === source || padded === square) {
    throw new Error("icon.svg structure changed; update appleVariant() in scripts/generate-icons.mjs");
  }
  return padded;
}

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map(async (size) => ({ size, data: await render(svg, size) })));
await writeFile(new URL("favicon.ico", appDir), toIco(icoImages));
await writeFile(new URL("apple-icon.png", appDir), await render(appleVariant(svg), 180));

console.log(`Wrote favicon.ico (${icoSizes.join(", ")}px) and apple-icon.png (180px) from icon.svg`);
