import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { COLORS, CATEGORIES } from '../constants.js';
import { Icons } from './Icons.jsx';

// ─── Экспорт прайс-листа ────────────────────────────────────────────────────

const BRAND_NAVY = "FF214A8C";
const BRAND_LIGHT = "FFE8EEF7";
const BRAND_EVEN = "FFF4F7FB";

function cellFill(argb) {
    return { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function cellBorder() {
    const side = { style: "thin", color: { argb: "FFD0DAEA" } };
    return { top: side, bottom: side, left: side, right: side };
}

function getCategoryName(catId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.name : catId;
}

function getSubName(catId, subId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat || !cat.subcategories) return subId;
    const sub = cat.subcategories.find(s => s.id === subId);
    return sub ? sub.name : subId;
}

async function exportPriceXLSX(products, categoryName) {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Light Company";
    wb.created = new Date();

    const ws = wb.addWorksheet("Прайс-лист", {
        views: [{ showGridLines: false }],
    });

    ws.columns = [
        { key: "num", width: 6 },
        { key: "art", width: 16 },
        { key: "name", width: 50 },
        { key: "sizes", width: 14 },
        { key: "pack", width: 14 },
        { key: "priceNoVat", width: 18 },
        { key: "price", width: 18 },
    ];
    const COL_COUNT = 7;

    // Title
    const titleRow = ws.addRow(["LIGHT COMPANY — Оптовый прайс-лист"]);
    ws.mergeCells(titleRow.number, 1, titleRow.number, COL_COUNT);
    const titleCell = titleRow.getCell(1);
    titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    titleCell.fill = cellFill(BRAND_NAVY);
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleRow.height = 36;

    // Subtitle
    const dateStr = new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
    const subtitle = ws.addRow([`${categoryName || "Все товары"} • ${products.length} позиций • ${dateStr}`]);
    ws.mergeCells(subtitle.number, 1, subtitle.number, COL_COUNT);
    subtitle.getCell(1).font = { size: 11, color: { argb: "FF666666" } };
    subtitle.getCell(1).alignment = { horizontal: "center" };
    subtitle.height = 22;

    ws.addRow([]);

    // Header
    const headers = ["№", "Артикул", "Наименование", "Размеры", "Вложение", "Цена без НДС", "Цена с НДС"];
    const headerRow = ws.addRow(headers);
    headerRow.height = 28;
    for (let i = 1; i <= COL_COUNT; i++) {
        const cell = headerRow.getCell(i);
        cell.font = { bold: true, size: 11, color: { argb: "FF214A8C" } };
        cell.fill = cellFill(BRAND_LIGHT);
        cell.border = cellBorder();
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    }

    // Data rows
    products.forEach((p, idx) => {
        const row = ws.addRow([
            idx + 1,
            p.article,
            p.name,
            p.sizes || "—",
            `${p.pack} шт.`,
            p.priceNoVat,
            p.price,
        ]);
        const isEven = idx % 2 === 0;
        for (let i = 1; i <= COL_COUNT; i++) {
            const cell = row.getCell(i);
            cell.border = cellBorder();
            cell.font = { size: 10 };
            if (isEven) cell.fill = cellFill(BRAND_EVEN);
            if (i === 1 || i >= 4) cell.alignment = { horizontal: "center" };
            if (i === 6 || i === 7) {
                cell.numFmt = '#,##0.00 "₽"';
            }
        }
        row.getCell(3).alignment = { wrapText: true };
    });

    // Footer
    ws.addRow([]);
    const footer = ws.addRow([`Light Company • ${dateStr} • light-c@mail.ru • 8 (800) 550-60-67`]);
    ws.mergeCells(footer.number, 1, footer.number, COL_COUNT);
    footer.getCell(1).font = { size: 9, italic: true, color: { argb: "FF999999" } };
    footer.getCell(1).alignment = { horizontal: "center" };

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `Прайс-лист_Light_Company_${dateStr.replace(/\s/g, "_")}.xlsx`);
}

function exportPricePDF(products, categoryName) {
    const dateStr = new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
    const win = window.open("", "_blank");
    if (!win) return;

    const rows = products.map((p, i) => `
        <tr style="background:${i % 2 === 0 ? "#f8fafd" : "#fff"}">
            <td style="text-align:center;padding:6px 8px;border:1px solid #e0e7f1">${i + 1}</td>
            <td style="text-align:center;padding:6px 8px;border:1px solid #e0e7f1;font-family:monospace;font-size:12px">${p.article}</td>
            <td style="padding:6px 8px;border:1px solid #e0e7f1">${p.name}</td>
            <td style="text-align:center;padding:6px 8px;border:1px solid #e0e7f1">${p.sizes || "—"}</td>
            <td style="text-align:center;padding:6px 8px;border:1px solid #e0e7f1">${p.pack} шт.</td>
            <td style="text-align:right;padding:6px 8px;border:1px solid #e0e7f1">${p.priceNoVat.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</td>
            <td style="text-align:right;padding:6px 8px;border:1px solid #e0e7f1;font-weight:600">${p.price.toLocaleString("ru-RU")} ₽</td>
        </tr>`).join("");

    win.document.write(`<!DOCTYPE html><html><head><title>Прайс-лист Light Company</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; font-size: 13px; }
            h1 { color: #214A8C; font-size: 22px; margin: 0 0 4px; }
            .sub { color: #888; font-size: 13px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #214A8C; color: #fff; padding: 8px; font-size: 12px; text-align: center; }
            .footer { margin-top: 20px; text-align: center; color: #999; font-size: 11px; }
            @media print { body { margin: 10mm; } }
        </style></head><body>
        <h1>LIGHT COMPANY — Оптовый прайс-лист</h1>
        <div class="sub">${categoryName || "Все товары"} • ${products.length} позиций • ${dateStr}</div>
        <table>
            <thead><tr>
                <th>№</th><th>Артикул</th><th>Наименование</th><th>Размеры</th><th>Вложение</th><th>Цена без НДС</th><th>Цена с НДС</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer">Light Company • ${dateStr} • light-c@mail.ru • 8 (800) 550-60-67</div>
        <script>setTimeout(()=>window.print(),500)<\/script>
    </body></html>`);
    win.document.close();
}

// ─── Компонент кнопки ────────────────────────────────────────────────────────

export default function PriceListExport({ products, categoryName }) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
                    background: COLORS.surface, color: COLORS.text, cursor: "pointer",
                    fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                    height: 36, transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
            >
                <Icons.Download size={16} />
                Прайс-лист
            </button>

            {open && (
                <>
                    <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                    <div style={{
                        position: "absolute", top: "100%", right: 0, marginTop: 8,
                        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                        borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        zIndex: 60, padding: 8, minWidth: 180,
                    }}>
                        <div style={{ padding: "6px 12px", fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
                            {products.length} товаров
                        </div>
                        <button
                            onClick={() => { exportPriceXLSX(products, categoryName); setOpen(false); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 8, width: "100%",
                                padding: "10px 12px", border: "none", borderRadius: 6,
                                background: "transparent", cursor: "pointer", fontSize: 14,
                                color: COLORS.text, textAlign: "left",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            📊 Скачать Excel (.xlsx)
                        </button>
                        <button
                            onClick={() => { exportPricePDF(products, categoryName); setOpen(false); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 8, width: "100%",
                                padding: "10px 12px", border: "none", borderRadius: 6,
                                background: "transparent", cursor: "pointer", fontSize: 14,
                                color: COLORS.text, textAlign: "left",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            📄 Открыть PDF (печать)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
