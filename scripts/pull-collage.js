// Pulls the header collage from a collage editor export into src/collage/.
//
//   pnpm collage:pull [folder]    (default: ~/Desktop/collage)
//
// The document, the renderer (collage.js), and the frame styles (collage.css) are copied as they
// are. Images are copied only if the collage uses them, scaled down to the widest they're ever
// drawn on the site (see src/utils/collage.ts), and heavy PNGs (pasted screenshots, mostly) become
// high-quality WebP, which keeps their transparency; collage.json is rewritten to match. The
// export keeps the originals, so pulling again after the collage changes sizes them afresh. Astro
// makes the sizes the site serves at build time.
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { largestWidth } from "../src/utils/collage.ts";

const HEAVY_PNG = 200_000; // bytes
const from = path.resolve(process.argv[2] ?? path.join(homedir(), "Desktop", "collage"));
const to = path.resolve(import.meta.dirname, "../src/collage");

const doc = JSON.parse(await readFile(path.join(from, "collage.json"), "utf8"));
// The renderer features the site relies on: image sizing and note links.
const renderer = await readFile(path.join(from, "collage.js"), "utf8");
if (!["export function imageScale", "function noteText"].every((feature) => renderer.includes(feature))) {
  throw new Error(`${from} is from an older collage editor. Save it from the editor again, then pull.`);
}

await rm(to, { recursive: true, force: true });
await mkdir(path.join(to, "images"), { recursive: true });
for (const file of ["collage.js", "collage.css"]) {
  await copyFile(path.join(from, file), path.join(to, file));
}
const { gridFor, imageScale } = await import(pathToFileURL(path.join(to, "collage.js")).href);
const grid = gridFor(doc);

const renamed = new Map();
for (const image of doc.images) {
  const source = path.join(from, "images", image.file);
  const { width = 0, height = 0, format } = await sharp(source).metadata();
  const uses = doc.items.filter((item) => item.image === image.file);
  const needed = Math.max(1, ...uses.map((item) => largestWidth(imageScale(item, grid, { width, height }))));
  const toWebp = format === "png" && (await stat(source)).size > HEAVY_PNG;
  const file = toWebp ? image.file.replace(/\.png$/i, ".webp") : image.file;
  const target = path.join(to, "images", file);

  if (toWebp || needed < width) {
    let pipeline = sharp(source).resize({ width: Math.min(needed, width) });
    if (toWebp) pipeline = pipeline.webp({ quality: 90, alphaQuality: 100, effort: 4 });
    else if (format === "jpeg") pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
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
