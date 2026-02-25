import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { COLORS } from '../constants.js';
import { Icons } from './Icons.jsx';

// ─── Утилиты экспорта ───────────────────────────────────────────────────────

// Цвета бренда (ARGB)
const BRAND_NAVY = "FF0A1931";  // #0A1931 — основной тёмно-синий
const BRAND_LIGHT = "FFE8EEF7";  // Светло-синий фон для шапок столбцов
const BRAND_TOTAL = "FFDCE6F8";  // Голубой для строки итого
const BRAND_EVEN = "FFF4F7FB";  // Чуть серый для чётных строк

function cellFill(argb) {
    return { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function cellBorder() {
    const side = { style: "thin", color: { argb: "FFD0DAEA" } };
    return { top: side, bottom: side, left: side, right: side };
}

async function exportToXLSX(orders, products) {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Light Company";
    wb.created = new Date();

    const ws = wb.addWorksheet("Заказы", {
        views: [{ showGridLines: false }],
    });

    // Ширины столбцов
    ws.columns = [
        { key: "name", width: 50 },
        { key: "art", width: 14 },
        { key: "boxes", width: 16 },
        { key: "pack", width: 16 },
        { key: "qty", width: 14 },
        { key: "noVat", width: 20 },
        { key: "price", width: 18 },
        { key: "sum", width: 20 },
    ];

    const COL_COUNT = 8;

    const addMergedHeader = (text, fillArgb = BRAND_NAVY, fontColor = "FFFFFFFF", size = 13) => {
        const row = ws.addRow([text]);
        ws.mergeCells(row.number, 1, row.number, COL_COUNT);
        const cell = row.getCell(1);
        cell.fill = cellFill(fillArgb);
        cell.font = { bold: true, size, color: { argb: fontColor } };
        cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        cell.border = cellBorder();
        row.height = size === 13 ? 24 : 20;
    };

    const addMetaRow = (label, value) => {
        const row = ws.addRow([label, value]);
        row.getCell(1).font = { bold: true, color: { argb: "FF555F7A" }, size: 11 };
        row.getCell(2).font = { size: 11 };
        row.height = 18;
    };

    for (const order of orders) {
        const dateStr = new Date(order.date).toLocaleDateString("ru-RU");
        const shipDate = new Date(order.shippingDate).toLocaleDateString("ru-RU");

        // ── Заголовок заказа ──
        addMergedHeader(`  Заказ #${order.id}`, BRAND_NAVY, "FFFFFFFF", 13);

        // ── Мета-информация ──
        addMetaRow("Дата создания:", dateStr);
        addMetaRow("Дата отгрузки:", shipDate);
        addMetaRow("Статус:", order.status);
        if (order.buyerName) addMetaRow("Покупатель:", order.buyerName);
        if (order.buyerContact) addMetaRow("Контакт:", order.buyerContact);
        if (order.branch) addMetaRow("Филиал:", order.branch);
        if (order.managerName) addMetaRow("Менеджер:", order.managerName);

        // Пустая строка
        ws.addRow([]);

        // ── Заголовки таблицы товаров ──
        const headerRow = ws.addRow([
            "Наименование", "Артикул", "Мест (короб.)", "Вложение (шт.)",
            "Кол-во (шт.)", "Цена без НДС", "Цена с НДС", "Сумма с НДС",
        ]);
        headerRow.height = 22;
        headerRow.eachCell(cell => {
            cell.fill = cellFill(BRAND_LIGHT);
            cell.font = { bold: true, size: 11, color: { argb: BRAND_NAVY } };
            cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
            cell.border = cellBorder();
        });
        headerRow.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };

        // ── Строки товаров ──
        let rowIndex = 0;
        for (const item of order.items) {
            const p = products.find(pr => pr.id === item.productId);
            if (!p) continue;
            const pack = p.pack || 1;
            const boxes = Math.ceil(item.qty / pack);
            const sum = p.price * item.qty;
            const isEven = rowIndex % 2 === 1;

            const row = ws.addRow([
                p.name, p.article, boxes, pack, item.qty,
                p.priceNoVat ?? 0, p.price, sum,
            ]);
            row.height = 18;
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (isEven) cell.fill = cellFill(BRAND_EVEN);
                cell.border = cellBorder();
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.font = { size: 11 };
            });
            // Наименование — левое выравнивание
            row.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
            // Числовой формат для цен и суммы
            ["F", "G", "H"].forEach(col => {
                row.getCell(col).numFmt = '#,##0.00 ₽';
            });
            rowIndex++;
        }

        // ── Строка итого ──
        const totalRow = ws.addRow(["", "", "", "", "", "", "ИТОГО:", order.total]);
        totalRow.height = 22;
        totalRow.eachCell({ includeEmpty: true }, cell => {
            cell.fill = cellFill(BRAND_TOTAL);
            cell.border = cellBorder();
        });
        totalRow.getCell(7).font = { bold: true, size: 12, color: { argb: BRAND_NAVY } };
        totalRow.getCell(7).alignment = { horizontal: "right" };
        totalRow.getCell(8).font = { bold: true, size: 12, color: { argb: BRAND_NAVY } };
        totalRow.getCell(8).numFmt = '#,##0.00 ₽';
        totalRow.getCell(8).alignment = { horizontal: "center" };

        // Два пустых ряда-разделителя
        ws.addRow([]);
        ws.addRow([]);
    }

    // ── Итог по всем заказам (если выбрано несколько) ──
    if (orders.length > 1) {
        const grandTotal = orders.reduce((s, o) => s + o.total, 0);
        const gtRow = ws.addRow(["", "", "", "", "", "", "ИТОГО ПО ВСЕМ ЗАКАЗАМ:", grandTotal]);
        gtRow.height = 26;
        gtRow.eachCell({ includeEmpty: true }, cell => {
            cell.fill = cellFill(BRAND_NAVY);
            cell.border = cellBorder();
        });
        gtRow.getCell(7).font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        gtRow.getCell(7).alignment = { horizontal: "right" };
        gtRow.getCell(8).font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
        gtRow.getCell(8).numFmt = '#,##0.00 ₽';
        gtRow.getCell(8).alignment = { horizontal: "center" };
    }

    // ── Скачивание ──
    const fileName = orders.length === 1
        ? `order-${orders[0].id}.xlsx`
        : `orders-export.xlsx`;

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
}


function exportToPDF(orders, products) {
    const win = window.open("", "_blank");
    if (!win) return;

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Заказы Light Company</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body { 
                    font-family: 'Inter', sans-serif; 
                    font-size: 13px; color: #1a1a2e; margin: 30px; 
                    background: #fff;
                }
                h1 { font-size: 26px; font-weight: 800; color: #0A1931; margin: 0 0 8px 0; letter-spacing: -0.5px; }
                .subtitle { color: #64748b; margin-bottom: 24px; font-size: 13px; font-weight: 500; }
                
                .order-section { margin-bottom: 40px; page-break-inside: avoid; }
                
                .order-header { 
                    background: #0A1931; color: #fff; 
                    padding: 12px 16px; border-radius: 8px 8px 0 0;
                    font-weight: 700; font-size: 15px; 
                }
                
                .meta-table { 
                    width: 100%; border-collapse: collapse; 
                    margin: 0; 
                    border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;
                }
                .meta-table td { padding: 6px 16px; font-size: 12px; border: none; }
                .meta-label { color: #64748b; font-weight: 600; width: 140px; vertical-align: top; }
                .meta-value { color: #0f172a; font-weight: 500; }
                
                .items-table { 
                    width: 100%; border-collapse: collapse; 
                    border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;
                }
                .items-table th, .items-table td { 
                    padding: 10px 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;
                }
                .items-table th:last-child, .items-table td:last-child { border-right: none; }
                
                .items-table th { 
                    background: #eef1f8; color: #0A1931; 
                    font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; 
                    text-align: center;
                }
                .items-table th:first-child { text-align: left; }
                
                .items-row:nth-child(even) td { background: #f8fafc; }
                .items-table td { font-size: 12px; color: #1e293b; text-align: center; vertical-align: middle; }
                .items-table td:first-child { text-align: left; font-weight: 500; }
                
                .total-row td { 
                    background: #f0f4ff; font-size: 14px; padding: 12px; 
                    border-bottom: 2px solid #0A1931;
                }
                .total-label { text-align: right; color: #0A1931; font-weight: 700; }
                .total-value { text-align: center; color: #0A1931; font-weight: 800; white-space: nowrap; }
                
                .grand-total { margin-top: 30px; page-break-inside: avoid; }
                .grand-total-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
                .grand-total-table td { background: #0A1931; color: #fff; padding: 16px; font-size: 16px; }
                .gt-label { text-align: right; font-weight: 700; }
                .gt-value { text-align: center; font-weight: 800; white-space: nowrap; width: 200px; }
                
                .print-btn {
                    margin-top:20px; padding:12px 24px; background:#0A1931; color:#fff;
                    border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s;
                }
                .print-btn:hover { background: #17366b; transform: translateY(-1px); }
                
                @media print { 
                    @page { margin: 12mm; } 
                    body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print-btn { display: none !important; } 
                    .order-section { margin-bottom: 30px; }
                }
            </style>
        </head>
        <body>
            <h1>LIGHT COMPANY</h1>
            <div class="subtitle">Выгрузка заказов — ${new Date().toLocaleDateString("ru-RU", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
    `;

    for (const order of orders) {
        const dateStr = new Date(order.date).toLocaleDateString("ru-RU");
        const shipDate = new Date(order.shippingDate).toLocaleDateString("ru-RU");

        let metaHtml = `
            <table class="meta-table">
                <tr><td colspan="4" style="height: 12px;"></td></tr>
                <tr>
                    <td class="meta-label">Дата создания:</td><td class="meta-value">${dateStr}</td>
                    <td class="meta-label">Дата отгрузки:</td><td class="meta-value">${shipDate}</td>
                </tr>
                <tr>
                    <td class="meta-label">Статус:</td><td class="meta-value">${order.status}</td>
                    <td class="meta-label">Покупатель:</td><td class="meta-value">${order.buyerName || '—'}</td>
                </tr>
        `;

        let hasMoreMeta = false;
        let moreMetaHtml = "<tr>";
        if (order.buyerContact) {
            moreMetaHtml += `<td class="meta-label">Контакт:</td><td class="meta-value">${order.buyerContact}</td>`;
            hasMoreMeta = true;
        } else {
            moreMetaHtml += `<td class="meta-label"></td><td class="meta-value"></td>`;
        }

        if (order.branch) {
            moreMetaHtml += `<td class="meta-label">Филиал:</td><td class="meta-value">${order.branch}</td>`;
            hasMoreMeta = true;
        } else if (order.managerName) {
            moreMetaHtml += `<td class="meta-label">Менеджер:</td><td class="meta-value">${order.managerName}</td>`;
            hasMoreMeta = true;
        } else {
            moreMetaHtml += `<td class="meta-label"></td><td class="meta-value"></td>`;
        }
        moreMetaHtml += "</tr>";

        if (hasMoreMeta) metaHtml += moreMetaHtml;

        if (order.branch && order.managerName) {
            metaHtml += `<tr><td class="meta-label">Менеджер:</td><td class="meta-value">${order.managerName}</td><td class="meta-label"></td><td class="meta-value"></td></tr>`;
        }

        metaHtml += `<tr><td colspan="4" style="height: 16px;"></td></tr></table>`;

        let itemsHtml = `
            <table class="items-table">
                <tr>
                    <th>Наименование</th>
                    <th>Артикул</th>
                    <th>Мест (короб.)</th>
                    <th>Вложение (шт.)</th>
                    <th>Кол-во (шт.)</th>
                    <th>Цена без НДС</th>
                    <th>Цена с НДС</th>
                    <th>Сумма с НДС</th>
                </tr>
        `;

        for (const item of order.items) {
            const p = products.find(pr => pr.id === item.productId);
            if (!p) continue;
            const pack = p.pack || 1;
            const boxes = Math.ceil(item.qty / pack);
            const sum = p.price * item.qty;

            itemsHtml += `
                <tr class="items-row">
                    <td>${p.name}</td>
                    <td style="font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums;">${p.article}</td>
                    <td>${boxes}</td>
                    <td>${pack}</td>
                    <td style="font-weight: 600;">${item.qty}</td>
                    <td style="white-space: nowrap;">${(p.priceNoVat || 0).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</td>
                    <td style="white-space: nowrap;">${p.price.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</td>
                    <td style="white-space: nowrap; font-weight: 600;">${sum.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</td>
                </tr>
            `;
        }

        itemsHtml += `
            <tr class="total-row">
                <td colspan="7" class="total-label">ИТОГО ПО ЗАКАЗУ:</td>
                <td class="total-value">${order.total.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</td>
            </tr>
            </table>
        `;

        htmlContent += `
            <div class="order-section">
                <div class="order-header">
                    Заказ #${order.id}
                </div>
                ${metaHtml}
                ${itemsHtml}
            </div>
        `;
    }

    if (orders.length > 1) {
        const grandTotal = orders.reduce((s, o) => s + o.total, 0);
        htmlContent += `
            <div class="grand-total">
                <table class="grand-total-table">
                    <tr>
                        <td class="gt-label">ИТОГО ПО ВСЕМ ЗАКАЗАМ:</td>
                        <td class="gt-value">${grandTotal.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</td>
                    </tr>
                </table>
            </div>
        `;
    }

    htmlContent += `
            <div style="text-align: center; margin-top: 40px;">
                <button class="print-btn" onclick="window.print()">
                    🖨️ Печать / Сохранить как PDF
                </button>
            </div>
        </body>
        </html>
    `;

    win.document.write(htmlContent);
    win.document.close();
    win.focus();
}

// ─── Компонент ──────────────────────────────────────────────────────────────

// ─── Компонент ──────────────────────────────────────────────────────────────
import { useAuthStore } from '../store/authStore';
import { useOrderStore, ORDER_STATUSES } from '../store/orderStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { PRODUCTS } from '../products-data';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
    const { user } = useAuthStore();
    const { orders, setOrders } = useOrderStore();
    const { reorder } = useCartStore();
    const { setCartOpen, setToast } = useUIStore();
    const navigate = useNavigate();

    const [selected, setSelected] = useState(new Set());
    const [tab, setTab] = useState("active"); // "active" | "archive"

    // Only display orders that are relevant to the user
    const userOrders = user?.role === "employee"
        ? orders.filter(o => o.managerName === user?.name)
        : orders.filter(o => o.buyerContact === (user?.email || user?.phone));

    const onUpdateOrderStatus = (orderId, newStatus) => {
        const { updateOrderStatus } = useOrderStore.getState();
        updateOrderStatus(orderId, newStatus);
        setToast(`Статус заказа #${orderId} обновлён: ${newStatus}`);
    };

    const handleReorder = (order) => {
        reorder(order);
        setCartOpen(true);
        navigate('/');
        setToast("Товары из заказа добавлены в корзину");
    };

    const isEmployee = user?.role === "employee";

    const isArchivedStatus = (status) => status === "Завершен" || status === "Отменен";
    const activeOrders = userOrders.filter(o => !isArchivedStatus(o.status));
    const archivedOrders = userOrders.filter(o => isArchivedStatus(o.status));

    const displayedOrders = tab === "active" ? activeOrders : archivedOrders;

    if (orders.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textMuted }}>
                <Icons.Package size={48} />
                <div style={{ marginTop: 12, fontSize: 16 }}>У вас пока нет заказов</div>
            </div>
        );
    }

    if (displayedOrders.length === 0 && orders.length > 0) {
        return (
            <div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
                    <button onClick={() => { setTab("active"); setSelected(new Set()); }} style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                        background: tab === "active" ? COLORS.surfaceHover : "transparent",
                        color: tab === "active" ? COLORS.primary : COLORS.textSecondary,
                    }}>
                        Активные заказы ({activeOrders.length})
                    </button>
                    <button onClick={() => { setTab("archive"); setSelected(new Set()); }} style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                        background: tab === "archive" ? COLORS.surfaceHover : "transparent",
                        color: tab === "archive" ? COLORS.primary : COLORS.textSecondary,
                    }}>
                        Архив ({archivedOrders.length})
                    </button>
                </div>
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textMuted }}>
                    <Icons.Package size={48} />
                    <div style={{ marginTop: 12, fontSize: 16 }}>
                        {tab === "active" ? "У вас нет активных заказов" : "В архиве пока пусто"}
                    </div>
                </div>
            </div>
        );
    }

    const allSelected = selected.size > 0 && selected.size === displayedOrders.length;

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(displayedOrders.map(o => o.id)));
        }
    };

    const selectedOrders = displayedOrders.filter(o => selected.has(o.id));

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
                <button onClick={() => { setTab("active"); setSelected(new Set()); }} style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                    background: tab === "active" ? COLORS.surfaceHover : "transparent",
                    color: tab === "active" ? COLORS.primary : COLORS.textSecondary,
                }}>
                    Активные заказы ({activeOrders.length})
                </button>
                <button onClick={() => { setTab("archive"); setSelected(new Set()); }} style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                    background: tab === "archive" ? COLORS.surfaceHover : "transparent",
                    color: tab === "archive" ? COLORS.primary : COLORS.textSecondary,
                }}>
                    Архив ({archivedOrders.length})
                </button>
            </div>

            {/* ─── Панель массовых действий ─── */}
            <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
                padding: "12px 16px", background: COLORS.surface, borderRadius: 12,
                border: `1px solid ${COLORS.border}`, flexWrap: "wrap",
            }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        style={{ width: 18, height: 18, cursor: "pointer", accentColor: COLORS.primary }}
                    />
                    <span style={{ fontSize: 14, color: COLORS.textSecondary }}>
                        {selected.size === 0
                            ? "Выбрать все"
                            : `Выбрано: ${selected.size} из ${displayedOrders.length}`}
                    </span>
                </label>

                {selected.size > 0 && (
                    <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                        <button
                            onClick={() => exportToXLSX(selectedOrders, PRODUCTS)}
                            style={{
                                padding: "8px 16px", borderRadius: 8, border: `1px solid #10B981`,
                                background: "rgba(16,185,129,0.08)", color: "#10B981", cursor: "pointer",
                                fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                            }}
                        >
                            📊 Excel
                        </button>
                        <button
                            onClick={() => exportToPDF(selectedOrders, PRODUCTS)}
                            style={{
                                padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.primary}`,
                                background: `rgba(10,25,49,0.06)`, color: COLORS.primary, cursor: "pointer",
                                fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                            }}
                        >
                            📄 PDF
                        </button>
                    </div>
                )}
            </div>

            {/* ─── Список заказов ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {displayedOrders.slice().reverse().map(order => (
                    <div key={order.id} style={{
                        border: `1px solid ${selected.has(order.id) ? COLORS.primary : COLORS.border}`,
                        borderRadius: 12, padding: 20, background: COLORS.surface,
                        transition: "border-color 0.2s",
                        boxShadow: selected.has(order.id) ? `0 0 0 3px rgba(10,25,49,0.08)` : "none",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                {/* Чекбокс */}
                                <input
                                    type="checkbox"
                                    checked={selected.has(order.id)}
                                    onChange={() => toggleSelect(order.id)}
                                    style={{ width: 18, height: 18, cursor: "pointer", marginTop: 3, accentColor: COLORS.primary, flexShrink: 0 }}
                                />
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Заказ #{order.id}</div>
                                    <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                                        От: {new Date(order.date).toLocaleDateString("ru-RU")}
                                    </div>
                                    <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 2 }}>
                                        Желаемая дата отгрузки: <span style={{ fontWeight: 600 }}>{new Date(order.shippingDate).toLocaleDateString("ru-RU")}</span>
                                    </div>
                                    {isEmployee && (
                                        <div style={{ marginTop: 8, padding: 8, background: "rgba(33, 74, 140, 0.05)", borderRadius: 6, fontSize: 13, border: `1px dashed ${COLORS.primary}` }}>
                                            <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 2 }}>Покупатель: {order.buyerName}</div>
                                            <div style={{ color: COLORS.textSecondary }}>Контакты: {order.buyerContact}</div>
                                            <div style={{ color: COLORS.textSecondary }}>Филиал: {order.branch}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: getStatusColor(order.status).bg, color: getStatusColor(order.status).text }}>
                                {order.status}
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "12px 0 0", padding: "12px 16px", background: COLORS.bg, borderRadius: 10 }}>
                            {ORDER_STATUSES.map((s, i) => {
                                const currentIdx = ORDER_STATUSES.indexOf(order.status);
                                const isActive = i <= currentIdx;
                                const isCurrent = i === currentIdx;
                                const historyEntry = (order.statusHistory || []).find(h => h.status === s);
                                return (
                                    <React.Fragment key={s}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto", minWidth: 70 }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: "50%",
                                                background: isActive ? getStatusColor(s).text : COLORS.borderLight,
                                                color: isActive ? "#fff" : COLORS.textMuted,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 13, fontWeight: 700,
                                                boxShadow: isCurrent ? `0 0 0 3px ${getStatusColor(s).bg}` : "none",
                                                transition: "all 0.3s",
                                            }}>
                                                {isActive ? "✓" : i + 1}
                                            </div>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: isActive ? getStatusColor(s).text : COLORS.textMuted, marginTop: 4, textAlign: "center", lineHeight: 1.2 }}>
                                                {s}
                                            </div>
                                            {historyEntry && (
                                                <div style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 2 }}>
                                                    {new Date(historyEntry.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}
                                                </div>
                                            )}
                                        </div>
                                        {i < ORDER_STATUSES.length - 1 && (
                                            <div style={{
                                                flex: 1, height: 3, borderRadius: 2,
                                                background: i < currentIdx ? getStatusColor(ORDER_STATUSES[i]).text : COLORS.borderLight,
                                                transition: "background 0.3s", minWidth: 20,
                                                marginBottom: historyEntry ? 18 : 4,
                                            }} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div style={{ borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 16, marginBottom: 16, overflowX: "auto" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 80px 90px 100px", gap: 8, fontSize: 12, fontWeight: 700, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.borderLight}`, paddingBottom: 8, marginBottom: 8, minWidth: 520 }}>
                                <span>Наименование</span>
                                <span style={{ textAlign: "center" }}>Артикул</span>
                                <span style={{ textAlign: "center" }}>Мест</span>
                                <span style={{ textAlign: "center" }}>Вложение</span>
                                <span style={{ textAlign: "center" }}>Кол-во</span>
                                <span style={{ textAlign: "right" }}>Сумма</span>
                            </div>
                            {order.items.map(item => {
                                const p = PRODUCTS.find(pr => pr.id === item.productId);
                                if (!p) return null;
                                const pack = p.pack || 1;
                                const totalQty = item.qty;
                                const boxes = Math.ceil(totalQty / pack);
                                return (
                                    <div key={item.productId} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 80px 90px 100px", gap: 8, fontSize: 14, marginBottom: 8, color: COLORS.textSecondary, alignItems: "center", minWidth: 520 }}>
                                        <span style={{ color: COLORS.text, fontWeight: 500 }}>{p.name}</span>
                                        <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: 12 }}>{p.article}</span>
                                        <span style={{ textAlign: "center", fontWeight: 600, color: COLORS.text }}>{boxes}</span>
                                        <span style={{ textAlign: "center" }}>{pack} шт.</span>
                                        <span style={{ textAlign: "center", fontWeight: 600, color: COLORS.primary }}>{totalQty} шт.</span>
                                        <span style={{ textAlign: "right" }}>{(p.price * totalQty).toLocaleString("ru-RU")} ₽</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 16, flexWrap: "wrap", gap: 8 }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>
                                Итого: {order.total.toLocaleString("ru-RU")} ₽
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {/* Кнопки экспорта для одного заказа */}
                                <button
                                    onClick={() => exportToXLSX([order], PRODUCTS)}
                                    title="Скачать Excel (.xlsx)"
                                    style={{
                                        padding: "8px 14px", borderRadius: 8, border: `1px solid #10B981`,
                                        background: "rgba(16,185,129,0.07)", color: "#10B981", cursor: "pointer",
                                        fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5,
                                    }}
                                >
                                    📊 Excel
                                </button>
                                <button
                                    onClick={() => exportToPDF([order], PRODUCTS)}
                                    title="Открыть PDF"
                                    style={{
                                        padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.primary}`,
                                        background: `rgba(10,25,49,0.05)`, color: COLORS.primary, cursor: "pointer",
                                        fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5,
                                    }}
                                >
                                    📄 PDF
                                </button>

                                {/* Кнопки управления статусом */}
                                {isEmployee && order.status === "Сформирован" && (
                                    <button onClick={() => onUpdateOrderStatus(order.id, "В работе")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#F59E0B", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Принять в работу</button>
                                )}
                                {isEmployee && order.status === "В работе" && (
                                    <button onClick={() => onUpdateOrderStatus(order.id, "Отгружен")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3B82F6", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Icons.Truck size={16} /> Отгрузить</button>
                                )}
                                {isEmployee && order.status === "Отгружен" && (
                                    <button onClick={() => onUpdateOrderStatus(order.id, "Завершен")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#10B981", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Завершить</button>
                                )}
                                {!isEmployee && (order.status === "Сформирован" || order.status === "В работе") && (
                                    <button onClick={() => onUpdateOrderStatus(order.id, "Отменен")} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E53E3E", background: "transparent", color: "#E53E3E", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Закрыть заказ</button>
                                )}
                                <button
                                    onClick={() => handleReorder(order)}
                                    style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.primary}`, background: "transparent", color: COLORS.primary, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.primary; }}
                                >
                                    Повторить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}

function getStatusColor(status) {
    switch (status) {
        case "Сформирован": return { bg: "rgba(33, 74, 140, 0.1)", text: COLORS.primary };
        case "В работе": return { bg: "rgba(245, 158, 11, 0.1)", text: "#F59E0B" };
        case "Отгружен": return { bg: "rgba(59, 130, 246, 0.1)", text: "#3B82F6" };
        case "Отменен": return { bg: "rgba(229, 62, 62, 0.1)", text: "#E53E3E" };
        case "Завершен": return { bg: "rgba(16, 185, 129, 0.1)", text: "#10B981" };
        default: return { bg: COLORS.borderLight, text: COLORS.textSecondary };
    }
}
