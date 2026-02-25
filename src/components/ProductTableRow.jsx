import React, { useState } from 'react';
import { COLORS } from '../constants.js';
import { Icons } from './Icons.jsx';
import { QuantityInput } from './QuantityInput.jsx';
import { getProductPhotos } from '../photo-map.js';

export default function ProductTableRow({ product, onAddToCart, onToggleFavorite, isFavorite }) {
    const [qty, setQty] = useState(product.pack);
    const photos = getProductPhotos(product.article);
    const hasPhotos = photos.length > 0;

    const isRecentPriceChange = product.priceChangeDate
        ? (Date.now() - new Date(product.priceChangeDate).getTime()) / (1000 * 60 * 60 * 24) <= 10
        : false;

    const adjustQty = (delta) => {
        const newQty = Math.max(product.pack, qty + delta * product.pack);
        setQty(newQty);
    };

    const subEmoji = product.sub === "winter" ? "❄️" : product.sub === "summer" ? "☀️" : product.sub === "spring-autumn" ? "🍂" : product.sub === "rubber" ? "🌧️" : "🏠";

    return (
        <div style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            transition: "all 0.2s ease",
            position: "relative",
            minHeight: 100,
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(10, 25, 49, 0.06)";
                e.currentTarget.style.borderColor = "rgba(10, 25, 49, 0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = COLORS.border;
            }}
        >
            {/* Badges for List View */}
            <div style={{ position: "absolute", top: 12, left: -8, zIndex: 3, display: "flex", flexDirection: "column", gap: 6 }}>
                {product.isNew && (
                    <div style={{
                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #17366b 100%)`, color: "#fff",
                        padding: "4px 8px", borderRadius: "0 6px 6px 0", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        boxShadow: "2px 2px 5px rgba(10, 25, 49, 0.2)"
                    }}>
                        Новинка
                    </div>
                )}
                {product.isSale && (
                    <div style={{
                        background: `linear-gradient(135deg, #E53E3E 0%, #c62828 100%)`, color: "#fff",
                        padding: "4px 8px", borderRadius: "0 6px 6px 0", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        boxShadow: "2px 2px 5px rgba(229, 62, 62, 0.2)"
                    }}>
                        Акция
                    </div>
                )}
                {isRecentPriceChange && (
                    <div style={{
                        background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`, color: "#fff",
                        padding: "4px 8px", borderRadius: "0 6px 6px 0", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        boxShadow: "2px 2px 5px rgba(245, 158, 11, 0.2)"
                    }}>
                        Новая цена
                    </div>
                )}
            </div>

            {/* Photo */}
            <div style={{
                width: 80, height: 80, flexShrink: 0,
                background: `linear-gradient(135deg, ${COLORS.borderLight}, ${COLORS.bg})`,
                borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, userSelect: "none"
            }}>
                {hasPhotos ? (
                    <img
                        src={photos[0]}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }}
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                ) : (
                    subEmoji
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.5px", marginBottom: 4 }}>
                    арт. {product.article}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, lineHeight: 1.35 }}>
                    {product.name}
                </div>
            </div>

            {/* Pack info */}
            <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                <div style={{ fontSize: 13, color: COLORS.textSecondary }}>В коробке:</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: COLORS.text }}>
                    <Icons.Package size={16} />
                    <span>{product.pack} шт.</span>
                </div>
                {product.sizes && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: COLORS.primary, marginTop: 2 }}>
                        <Icons.Ruler size={13} />
                        <span>р. {product.sizes}</span>
                    </div>
                )}
            </div>

            {/* Price */}
            <div style={{ width: 160, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>
                    {product.price.toLocaleString("ru-RU")} ₽
                </span>
                <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                    без НДС: {product.priceNoVat.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                </span>
            </div>

            {/* Qty + Cart */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <div style={{
                    display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`,
                    borderRadius: 8, overflow: "hidden", height: 40,
                }}>
                    <button onClick={() => adjustQty(-1)} style={{
                        width: 36, height: "100%", border: "none", background: "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: COLORS.textSecondary,
                    }}>
                        <Icons.Minus size={16} />
                    </button>
                    <QuantityInput
                        value={qty}
                        packSize={product.pack}
                        onChange={setQty}
                        style={{
                            width: 48, fontSize: 16, fontWeight: 600,
                            borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`,
                            height: 40, lineHeight: "40px", borderRadius: 0
                        }}
                    />
                    <button onClick={() => adjustQty(1)} style={{
                        width: 36, height: "100%", border: "none", background: "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: COLORS.textSecondary,
                    }}>
                        <Icons.Plus size={16} />
                    </button>
                </div>
                <button
                    onClick={() => onAddToCart(product, qty)}
                    style={{
                        height: 40, padding: "0 20px", border: "none", borderRadius: 8,
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                        color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                    <Icons.Cart size={18} />
                    В корзину
                </button>
            </div>

            {/* Favorite */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                <button
                    onClick={() => onToggleFavorite(product.id)}
                    style={{
                        background: "none", border: "none", borderRadius: "50%",
                        width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: isFavorite ? COLORS.primary : COLORS.border,
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                    <Icons.Heart size={20} filled={isFavorite} />
                </button>
            </div>
        </div>
    );
}
