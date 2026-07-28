/**
 * Re-encode every downloaded photograph for web delivery.
 *
 * The Photograph Placeholder box is 342 CSS px wide, so 1000px covers a 3x
 * device pixel ratio with room to spare. Anything larger is bytes the
 * traveller pays for on a patchy connection — §03 says Mas has poor
 * reception, and that is a design constraint, not a detail.
 *
 * Run: node scripts/optimise-images.mjs
 */
import { readdir, rename, stat, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOTS = ['public/images/experiences', 'public/images/hosts'];
const MAX_WIDTH = 1000;
const QUALITY = 72;

let savedTotal = 0;

for (const root of ROOTS) {
  let files;
  try {
    files = await readdir(root);
  } catch {
    continue;
  }

  for (const file of files) {
    if (!/\.(jpe?g|png)$/i.test(extname(file))) continue;

    const path = join(root, file);
    const before = (await stat(path)).size;

    const buffer = await sharp(path)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();

    // Write to a sibling temp file and swap. sharp cannot write back to a
    // path it is still reading, and OneDrive intermittently holds a lock on
    // freshly created files, so the swap is retried.
    const tmp = `${path}.tmp`;
    await writeFile(tmp, buffer);
    for (let attempt = 0; ; attempt += 1) {
      try {
        await rename(tmp, path);
        break;
      } catch (error) {
        if (attempt >= 9) throw error;
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    const after = (await stat(path)).size;
    savedTotal += before - after;
    const meta = await sharp(path).metadata();
    console.log(
      `${file.padEnd(40)} ${String(Math.round(before / 1024)).padStart(4)} KB -> ` +
        `${String(Math.round(after / 1024)).padStart(4)} KB  (${meta.width}x${meta.height})`
    );
  }
}

console.log(`\nTotal saved: ${Math.round(savedTotal / 1024)} KB`);
