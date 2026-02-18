import { PRODUCTS } from './src/products-data.js';
import { getProductPhotos } from './src/photo-map.js';
import { writeFileSync } from 'fs';

console.log('Generating product list with photo status...');

// Header
let csvContent = '\uFEFF'; // BOM for Excel to recognize UTF-8
csvContent += 'Article;Name;Has Photo\n';

for (const product of PRODUCTS) {
    const photos = getProductPhotos(product.article);
    const hasPhoto = photos && photos.length > 0 ? 'v' : '';

    // Escape quotes in name and wrap in quotes
    const name = `"${product.name.replace(/"/g, '""')}"`;
    // Force Excel to treat article as text by using ="value" syntax
    const article = `="${product.article.replace(/"/g, '""')}"`;

    csvContent += `${article};${name};${hasPhoto}\n`;
}

writeFileSync('products_photos.csv', csvContent, 'utf-8');

console.log('Done! Saved to products_photos.csv');
