import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR = 'public/photos';
const OUTPUT_DIR = 'public/photos_optimized';
const TARGET_SIZE = 600;
const QUALITY = 80;

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(filename) {
    const inputPath = join(INPUT_DIR, filename);

    // Change extension to .webp
    const nameWithoutExt = basename(filename, extname(filename));
    const outputPath = join(OUTPUT_DIR, `${nameWithoutExt}.webp`);

    try {
        await sharp(inputPath)
            // 1. Trim whitespace (auto-center subject)
            // threshold: sensitivity to "white" background (0-255)
            .trim({ threshold: 10 })

            // 2. Resize to square with white background
            .resize({
                width: TARGET_SIZE,
                height: TARGET_SIZE,
                fit: 'contain', // Scale to fit within box, preserving aspect ratio
                background: { r: 255, g: 255, b: 255, alpha: 1 } // White padding
            })

            // 3. Flatten (ensure no transparency issues on white bg)
            .flatten({ background: { r: 255, g: 255, b: 255 } })

            // 4. Convert to WebP
            .webp({ quality: QUALITY, effort: 4 }) // effort 0-6 (6 is slowest but best compression)
            .toFile(outputPath);

        // Calculate savings
        const inStats = statSync(inputPath);
        const outStats = statSync(outputPath);
        const savings = Math.round((1 - outStats.size / inStats.size) * 100);

        console.log(`✅ ${filename} -> ${Math.round(outStats.size / 1024)}KB (${savings}% saved)`);
    } catch (err) {
        console.error(`❌ Error processing ${filename}:`, err.message);
    }
}

async function main() {
    console.log(`🚀 Starting optimization...`);
    console.log(`📂 Input: ${INPUT_DIR}`);
    console.log(`📂 Output: ${OUTPUT_DIR}`);
    console.log(`📏 Target: ${TARGET_SIZE}x${TARGET_SIZE} px, WebP Q${QUALITY}\n`);

    const files = readdirSync(INPUT_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    console.log(`Found ${files.length} images.`);

    // Process in parallel with limit (to avoid memory issues)
    const BATCH_SIZE = 10;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(optimizeImage));
    }

    console.log(`\n✨ Done! Processed ${files.length} images.`);
    console.log(`You can now replace the 'photos' folder content with 'photos_optimized' content.`);
}

main();
