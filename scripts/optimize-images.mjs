// Simple local optimizer: convert .png and .jpeg/.jpg to .webp using sharp if available
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

async function run() {
  const sharp = await ensureSharp();
  const files = fs.readdirSync(IMAGES_DIR);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    const name = path.basename(file, ext);
    const input = path.join(IMAGES_DIR, file);
    const output = path.join(IMAGES_DIR, `${name}.webp`);
    if (fs.existsSync(output)) continue; // already have webp
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
