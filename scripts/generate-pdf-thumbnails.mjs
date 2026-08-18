// Generates a JPEG thumbnail of the first page of every PDF in public/fonds/
// Run once after adding new PDFs:
//   node scripts/generate-pdf-thumbnails.mjs
//
// One-time setup (install dev dependencies):
//   npm install --save-dev pdfjs-dist canvas

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_FONDS = join(__dirname, "..", "public", "fonds");
const SCALE = 1.5;
const JPEG_QUALITY = 0.85;

function findPdfs(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return findPdfs(full);
    if (e.name.endsWith(".pdf")) return [full];
    return [];
  });
}

async function generateThumbnail(pdfPath) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createCanvas } = await import("canvas");

  const data = new Uint8Array(readFileSync(pdfPath));
  const doc = await getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: SCALE });

  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;

  const outputPath = pdfPath.replace(/\.pdf$/, "-thumbnail.jpg");
  writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: JPEG_QUALITY }));

  const publicPath = "/" + relative(join(__dirname, "..", "public"), outputPath).replace(/\\/g, "/");
  return { pdfPath, publicPath };
}

const pdfs = findPdfs(PUBLIC_FONDS);
if (pdfs.length === 0) {
  console.log("No PDFs found in public/fonds/");
  process.exit(0);
}

console.log(`Found ${pdfs.length} PDF(s)\n`);
for (const pdf of pdfs) {
  const { publicPath } = await generateThumbnail(pdf);
  const rel = relative(PUBLIC_FONDS, pdf).replace(/\\/g, "/");
  console.log(`✓ ${rel}`);
  console.log(`  documentThumbnailSrc: '${publicPath}'\n`);
}
