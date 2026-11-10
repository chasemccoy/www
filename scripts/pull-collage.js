// Pulls the header collage from a collage editor export into src/collage/.
//
//   pnpm collage:pull [folder]    (default: ~/Desktop/collage)
//
// Copies the document, renderer, and frame styles as they are. Images the collage uses are scaled
// down to the widest they're drawn (see src/utils/collage.ts), and heavy PNGs become WebP. The new
// src/collage/ is built beside the old one and swapped in, so a failed pull changes nothing.
import { copyFile, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { largestWidth } from "../src/utils/collage.ts";

// The oldest renderer VERSION (in collage.js) the site works with.
const RENDERER_VERSION = 1;
const HEAVY_PNG = 200_000; // bytes
// Images are kept this much wider than the widest they're drawn: Astro's AVIFs come out about 8%
// smaller scaled down from a larger source than encoded at the source's own size.
const HEADROOM = 1.25;

const from = path.resolve(process.argv[2] ?? path.join(homedir(), "Desktop", "collage"));
const to = path.resolve(import.meta.dirname, "../src/collage");
const staging = `${to}.pulling`;

const doc = JSON.parse(await readFile(path.join(from, "collage.json"), "utf8"));
const renderer = await import(pathToFileURL(path.join(from, "collage.js")).href);
if ((renderer.VERSION ?? 0) < RENDERER_VERSION) {
  throw new Error(
    `${from} is from an older collage editor. Save it from the editor again, then pull.`,
  );
}
const grid = renderer.gridFor(doc);

await rm(staging, { recursive: true, force: true });
try {
  await mkdir(path.join(staging, "images"), { recursive: true });
  for (const file of ["collage.js", "collage.css"]) {
    await copyFile(path.join(from, file), path.join(staging, file));
  }

  const images = [];
  for (const image of doc.images) {
    const uses = doc.items.filter((item) => item.image === image.file);
    if (!uses.length) continue;
    const source = path.join(from, "images", image.file);
    const { width = 0, height = 0, format } = await sharp(source).metadata();
    // 0 when the image is hidden at every size.
    const widest = Math.max(
      0,
      ...uses.map((item) => largestWidth(renderer.imageScale(item, grid, { width, height }))),
    );
    const needed = Math.ceil(widest * HEADROOM);
    const resize = needed > 0 && needed < width;
    const toWebp = format === "png" && (await stat(source)).size > HEAVY_PNG;
    const file = toWebp ? image.file.replace(/\.png$/i, ".webp") : image.file;
    const target = path.join(staging, "images", file);

    if (toWebp || resize) {
      let pipeline = sharp(source).resize({ width: resize ? needed : width });
      if (toWebp) pipeline = pipeline.webp({ quality: 90, alphaQuality: 100, effort: 4 });
      else if (format === "jpeg") pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
      const info = await pipeline.toFile(target);
      Object.assign(image, { file, width: info.width, height: info.height });
      for (const item of uses) item.image = file;
    } else {
      await copyFile(source, target);
    }
    images.push(image);
  }
  doc.images = images;
  await writeFile(path.join(staging, "collage.json"), `${JSON.stringify(doc, null, 2)}\n`);

  await rm(to, { recursive: true, force: true });
  await rename(staging, to);
} catch (error) {
  await rm(staging, { recursive: true, force: true });
  throw error;
}

console.log(`Pulled ${doc.items.length} items and ${doc.images.length} images from ${from}`);
