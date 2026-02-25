import { readdirSync, writeFileSync } from 'fs';

const photosDir = 'C:/Users/Naira/light company/public/photos_optimized';
const files = readdirSync(photosDir);

// Group photos by article base name
// Pattern: "ARTICLE.ext" or "ARTICLE-N.ext" or "ARTICLE..ext" (typo in filename)
// We need to map filenames to product articles

const photoMap = {};

for (const file of files) {
    // Remove extension
    const ext = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    if (!ext) continue;

    let baseName = file.slice(0, -ext[0].length);

    // Fix double dots like "048..jpg" -> "048"
    baseName = baseName.replace(/\.+$/, '');
    // Fix trailing spaces
    baseName = baseName.trim();

    // Check if it's a variant (ARTICLE-N pattern where N is a digit)
    // But NOT something like "907-11А" which is a separate article
    // Variants: "007-1", "007-2", "020-1", "020-2", "072-1", etc.
    // Articles: "907-11А", "907-21", "907-39", etc.

    // We need to match to actual articles. Let's use a different approach:
    // The base article is the filename without the -N suffix where N is just a number
    // But only if removing -N gives a valid article

    let articleKey = baseName;
    let isVariant = false;

    // Check if ends with -N (where N is 1 or more digits)
    const variantMatch = baseName.match(/^(.+)-(\d+)$/);
    if (variantMatch) {
        // Could be a variant photo OR a separate article
        // We'll store under both and resolve later
        articleKey = variantMatch[1];
        isVariant = true;
    }

    // For the photo map, we'll use case-insensitive keys
    const key = articleKey.toLowerCase();

    if (!photoMap[key]) photoMap[key] = [];
    photoMap[key].push('/photos_optimized/' + file);

    // If it's not a variant, also check if the full name is a different key
    if (isVariant) {
        const fullKey = baseName.toLowerCase();
        // Don't create a separate entry for simple variants like 007-1, 007-2
    }
}

// Sort photos within each article (main photo first, then variants)
for (const key of Object.keys(photoMap)) {
    photoMap[key].sort((a, b) => {
        // Main photo (without -N) comes first
        const aBase = a.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/\/photos_optimized\//, '');
        const bBase = b.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/\/photos_optimized\//, '');
        const aIsVariant = /-\d$/.test(aBase);
        const bIsVariant = /-\d$/.test(bBase);
        if (!aIsVariant && bIsVariant) return -1;
        if (aIsVariant && !bIsVariant) return 1;
        return a.localeCompare(b);
    });
}

// Generate JS export
let js = '// Auto-generated photo mapping: article (lowercase) -> array of photo paths\n';
js += 'export const PHOTO_MAP = {\n';
const sortedKeys = Object.keys(photoMap).sort();
for (const key of sortedKeys) {
    js += `    ${JSON.stringify(key)}: ${JSON.stringify(photoMap[key])},\n`;
}
js += '};\n\n';
js += '// Helper function: get photos for a product article\n';
js += 'export function getProductPhotos(article) {\n';
js += '    const key = article.toLowerCase();\n';
js += '    return PHOTO_MAP[key] || [];\n';
js += '}\n';

writeFileSync('C:/Users/Naira/light company/src/photo-map.js', js, 'utf-8');
console.log('Total unique articles with photos:', sortedKeys.length);
console.log('Total photo files mapped:', files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).length);
console.log('Sample entries:');
for (const key of sortedKeys.slice(0, 5)) {
    console.log(`  ${key}: ${photoMap[key].join(', ')}`);
}
