// Pulls the header collage from a collage editor export into src/collage/.
//
//   pnpm collage:pull [folder]    (default: ~/Desktop/collage)
//
// The document, the renderer (collage.js), and the frame styles (collage.css) are copied as they
// are. Images are copied only if the collage uses them. To keep the repo small, ones larger than
// MAX_SIZE are scaled down, and heavy PNGs (pasted screenshots, mostly) become high-quality WebP,
// which keeps their transparency; collage.json is rewritten to match. Astro makes the sizes the
// site serves at build time.
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const MAX_SIZE = 2400;
const HEAVY_PNG = 200_000; // bytes
const from = path.resolve(process.argv[2] ?? path.join(homedir(), "Desktop", "collage"));
const to = path.resolve(import.meta.dirname, "../src/collage");

const doc = JSON.parse(await readFile(path.join(from, "collage.json"), "utf8"));

await rm(to, { recursive: true, force: true });
await mkdir(path.join(to, "images"), { recursive: true });
for (const file of ["collage.js", "collage.css"]) {
  await copyFile(path.join(from, file), path.join(to, file));
}

const renamed = new Map();
for (const image of doc.images) {
  const source = path.join(from, "images", image.file);
  const { width = 0, height = 0, format } = await sharp(source).metadata();
  const toWebp = format === "png" && (await stat(source)).size > HEAVY_PNG;
  const file = toWebp ? image.file.replace(/\.png$/i, ".webp") : image.file;
  const target = path.join(to, "images", file);

  if (toWebp || Math.max(width, height) > MAX_SIZE) {
    let pipeline = sharp(source).resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true });
    if (toWebp) pipeline = pipeline.webp({ quality: 90, alphaQuality: 100, effort: 6 });
    const info = await pipeline.toFile(target);
    renamed.set(image.file, file);
    Object.assign(image, { file, width: info.width, height: info.height });
  } else {
    await copyFile(source, target);
  }
}

for (const item of doc.items) {
  if (item.image) item.image = renamed.get(item.image) ?? item.image;
}
await writeFile(path.join(to, "collage.json"), `${JSON.stringify(doc, null, 2)}\n`);

console.log(`Pulled ${doc.items.length} items and ${doc.images.length} images from ${from}`);
