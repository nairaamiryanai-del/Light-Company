import { PRODUCTS } from './src/products-data.js';
import { getProductPhotos } from './src/photo-map.js';

console.log('Checking for products without photos...');

const missing = [];

for (const product of PRODUCTS) {
    const photos = getProductPhotos(product.article);
    if (!photos || photos.length === 0) {
        missing.push(product);
    }
}

console.log(`\nTotal products: ${PRODUCTS.length}`);
console.log(`Products without photos: ${missing.length}\n`);

if (missing.length > 0) {
    console.log('--- List of Missing Photos ---');
    missing.forEach(p => {
        console.log(`[${p.article}] ${p.name}`);
    });
    console.log('------------------------------');
}
