import { readFileSync, writeFileSync } from 'fs';

import path from 'path';

const defaultPath = path.join(process.cwd(), 'data', 'Прайс общий от 02.02.2026.csv');
const csvPath = process.argv[2] || defaultPath;
const csv = readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n');

function categorize(name) {
    const lower = name.toLowerCase().trim();

    // 1. Домашняя обувь
    if (lower.includes('домашн') || lower.includes('тапочки'))
        return 'home';

    // 2. Летняя обувь
    if (lower.includes('купальн') || lower.includes('пляжн') || lower.includes('крокс') ||
        lower.includes('кроссовк') || lower.includes('полиуретан') || lower.includes('летн') ||
        lower.includes('огурц') || lower.includes('горошек') || lower.includes('корона') ||
        lower.includes('бабочка') || lower.includes('бантик') || lower.includes('сердце') ||
        lower.includes('роза') || lower.includes('блеск') || lower.includes('зигзаг') ||
        lower.includes('бант ') || lower.includes('карман') || lower.includes('принт') ||
        lower.includes('рванка') || lower.includes('джинс') || lower.includes('медицин'))
        return 'summer';

    // 3. Резина — ПВХ, силиконовые
    if (lower.includes('пвх') || lower.includes('силикон'))
        return 'rubber';

    // 4. Галоши садовые → весна-осень
    if (lower.includes('галош') && lower.includes('садов'))
        return 'spring-autumn';

    // 5. Зима — утепленные, мех, войлок, сукно, оксфорд, аляска, дутики
    if (lower.includes('утепл') || lower.includes('мех') || lower.includes('войлок') ||
        lower.includes('сукно') || lower.includes('оксфорд') || lower.includes('аляска') ||
        lower.includes('дутик') || lower.includes('ворс') || lower.includes('опушк') ||
        lower.includes('флис') || lower.includes('берц') || lower.includes('нетканн') ||
        lower.includes('манжет'))
        return 'winter';

    // 6. Галоши (не садовые), сабо → весна-осень
    if (lower.includes('галош') || lower.includes('сабо'))
        return 'spring-autumn';

    // 7. Всё остальное — в зависимости от контекста
    // Сапоги без утеплителя, ботинки → весна-осень
    if (lower.includes('сапог') || lower.includes('ботинк') || lower.includes('полуботинк') ||
        lower.includes('полусапож'))
        return 'spring-autumn';

    // Обувь женская/мужская/детская без уточнений (артикулы Бел, 90-x, 91-x, etc.)
    return 'summer';
}

function parsePrice(str) {
    if (!str) return 0;
    // Удаляем все кроме цифр, точек и запятых
    const cleanStr = str.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleanStr) || 0;
}

const products = [];
let id = 1;

// Skip first line (date) and second line (header)
for (let i = 2; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Handle multi-line fields (quoted with newlines)
    while (line.split('"').length % 2 === 0 && i + 1 < lines.length) {
        i++;
        line += ' ' + lines[i].trim();
    }

    const parts = line.split(';');
    if (parts.length < 5) continue;

    const article = parts[0].trim();
    let name = parts[1].trim().replace(/"/g, '').replace(/\s+/g, ' ');
    const packStr = parts[2].trim();
    const priceNoVatStr = parts[3].trim();
    const priceVatStr = parts[4].trim();

    if (!article || !name) continue;

    const pack = parseInt(packStr, 10) || 1;
    const priceNoVat = parsePrice(priceNoVatStr);
    const price = parsePrice(priceVatStr);

    if (price === 0) continue;

    const sub = categorize(name);

    products.push({
        id: id++,
        article,
        name,
        category: 'shoes',
        sub,
        price,
        priceNoVat,
        pack,
    });
}

// Count by sub
const counts = {};
products.forEach(p => { counts[p.sub] = (counts[p.sub] || 0) + 1; });
console.log('Total products:', products.length);
console.log('By subcategory:', counts);

// Generate JS code
let js = 'export const PRODUCTS = [\n';
products.forEach(p => {
    js += `    { id: ${p.id}, article: ${JSON.stringify(p.article)}, name: ${JSON.stringify(p.name)}, category: "shoes", sub: "${p.sub}", price: ${p.price}, priceNoVat: ${p.priceNoVat}, pack: ${p.pack} },\n`;
});
js += '];\n';

writeFileSync('C:/Users/Naira/light company/src/products-data.js', js, 'utf-8');
console.log('Written to src/products-data.js');
