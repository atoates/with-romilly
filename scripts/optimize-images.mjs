// Simple local optimizer: convert .png and .jpeg/.jpg to .webp using sharp
import fs from 'fs';
import path from 'path';

async function ensureSharp() {
  try {
    const sharp = (await import('sharp')).default;
    return sharp;
  } catch (e) {
    console.error('\nImage optimization skipped: please install sharp locally');
    console.error('Run: npm i sharp\n');
    process.exit(0);
  }
}

const IMAGES_DIR = path.resolve(process.cwd(), 'assets/images');

const RENAMES = {
  'with rom.jpg': 'with-rom.jpg',
  'reflex.JPG': 'reflex.jpg',
};

async function run() {
  const sharp = await ensureSharp();

  for (const [from, to] of Object.entries(RENAMES)) {
    const fromPath = path.join(IMAGES_DIR, from);
    const toPath = path.join(IMAGES_DIR, to);
    if (fs.existsSync(fromPath) && !fs.existsSync(toPath)) {
      fs.renameSync(fromPath, toPath);
      console.log(`Renamed -> ${from} -> ${to}`);
    }
  }

  const files = fs.readdirSync(IMAGES_DIR);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    const name = path.basename(file, path.extname(file));
    const input = path.join(IMAGES_DIR, file);
    const output = path.join(IMAGES_DIR, `${name}.webp`);
    if (fs.existsSync(output)) continue;
    try {
      const img = sharp(input);
      const meta = await img.metadata();
      await img.webp({ quality: 82, effort: 4 }).toFile(output);
      console.log(`Converted -> ${file} -> ${name}.webp (${meta.width}x${meta.height})`);
    } catch (err) {
      console.error(`Failed converting ${file}:`, err.message);
    }
  }
}

run();
