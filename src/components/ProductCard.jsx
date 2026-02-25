import React, { useState } from 'react';
import { COLORS } from '../constants.js';
import { Icons } from './Icons.jsx';
import { getProductPhotos } from '../photo-map.js';
import { QuantityInput } from './QuantityInput.jsx';

export default function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }) {
    const [qty, setQty] = useState(product.pack);
    const [photoIdx, setPhotoIdx] = useState(0);
    const photos = getProductPhotos(product.article);
    const hasPhotos = photos.length > 0;
    const hasMultiple = photos.length > 1;

    const isRecentPriceChange = product.priceChangeDate
        ? (Date.now() - new Date(product.priceChangeDate).getTime()) / (1000 * 60 * 60 * 24) <= 10
        : false;

    const adjustQty = (delta) => {
        const newQty = Math.max(product.pack, qty + delta * product.pack);
        setQty(newQty);
    };

    const prevPhoto = (e) => { e.stopPropagation(); setPhotoIdx((i) => (i - 1 + photos.length) % photos.length); };
    const nextPhoto = (e) => { e.stopPropagation(); setPhotoIdx((i) => (i + 1) % photos.length); };

    const subEmoji = product.sub === "winter" ? "❄️" : product.sub === "summer" ? "☀️" : product.sub === "spring-autumn" ? "🍂" : product.sub === "rubber" ? "🌧️" : "🏠";

    return (
        <div style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
            transition: "all 0.25s ease",
            position: "relative",
            display: "flex",
            flexDirection: "column",
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(10, 25, 49, 0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(10, 25, 49, 0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = COLORS.border;
            }}
        >
            {/* Favorite button */}
            <button
                onClick={() => onToggleFavorite(product.id)}
                style={{
                    position: "absolute", top: 10, right: 10, zIndex: 3,
                    background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
                    width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: isFavorite ? COLORS.primary : COLORS.textMuted,
                    transition: "all 0.2s",
                    backdropFilter: "blur(4px)",
                }}
            >
                <Icons.Heart size={16} filled={isFavorite} />
            </button>

            {/* Badges */}
            <div style={{ position: "absolute", top: 10, left: 10, zIndex: 3, display: "flex", flexDirection: "column", gap: 6 }}>
                {product.isNew && (
                    <div style={{
                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #17366b 100%)`, color: "#fff",
                        padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        boxShadow: "0 2px 4px rgba(10, 25, 49, 0.2)"
                    }}>
                        Новинка
                    </div>
                )}
                {product.isSale && (
                    <div style={{
                        background: `linear-gradient(135deg, #E53E3E 0%, #c62828 100%)`, color: "#fff",
                        padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        boxShadow: "0 2px 4px rgba(229, 62, 62, 0.2)"
                    }}>
                        Акция
                    </div>
                )}
                {isRecentPriceChange && (
                    <div style={{
                        background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`, color: "#fff",
                        padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        boxShadow: "0 2px 4px rgba(245, 158, 11, 0.2)"
                    }}>
                        Новая цена
                    </div>
                )}
            </div>

            {/* Photo area */}
            <div style={{
                height: 180, background: `linear-gradient(135deg, ${COLORS.borderLight}, ${COLORS.bg})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
                fontSize: 24, userSelect: "none",
            }}>
                {
                    hasPhotos ? (
                        <>
                            <img
                                src={photos[photoIdx]}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                            {
                                hasMultiple && (
                                    <>
                                        <button onClick={prevPhoto} style={{
                                            position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)",
                                            width: 28, height: 28, borderRadius: "50%", border: "none",
                                            background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 16, fontWeight: 700, zIndex: 2,
                                        }}>‹</button>
                                        <button onClick={nextPhoto} style={{
                                            position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                                            width: 28, height: 28, borderRadius: "50%", border: "none",
                                            background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 16, fontWeight: 700, zIndex: 2,
                                        }}>›</button>
                                        <div style={{
                                            position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                                            display: "flex", gap: 4, zIndex: 2,
                                        }}>
                                            {photos.map((_, i) => (
                                                <span key={i} onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }} style={{
                                                    width: 7, height: 7, borderRadius: "50%", cursor: "pointer",
                                                    background: i === photoIdx ? COLORS.primary : "rgba(0,0,0,0.3)",
                                                    transition: "background 0.2s",
                                                }} />
                                            ))}
                                        </div>
                                    </>
                                )
                            }
                        </>
                    ) : (
                        subEmoji
                    )}
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.5px", marginBottom: 4 }}>
                    арт. {product.article}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 8, lineHeight: 1.35, minHeight: 44 }}>
                    {product.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.textSecondary }}>
                    <Icons.Package size={16} />
                    <span>Кратность: {product.pack} шт.</span>
                </div>
                {product.sizes && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.primary }}>
                        <Icons.Ruler size={14} />
                        <span>Размеры: {product.sizes}</span>
                    </div>
                )}

                {/* Prices */}
                <div style={{ marginTop: "auto", paddingTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>
                            {product.price.toLocaleString("ru-RU")} ₽
                        </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                        без НДС: {product.priceNoVat.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                    </div>
                </div>

                {/* Quantity + Add to cart */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                    <div style={{
                        display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`,
                        borderRadius: 8, overflow: "hidden", flex: "0 0 auto",
                    }}>
                        <button onClick={() => adjustQty(-1)} style={{
                            width: 32, height: 36, border: "none", background: "transparent",
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
                                width: 44, fontSize: 16, fontWeight: 600,
                                borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`,
                                height: 36, lineHeight: "36px", borderRadius: 0
                            }}
                        />
                        <button onClick={() => adjustQty(1)} style={{
                            width: 32, height: 36, border: "none", background: "transparent",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            color: COLORS.textSecondary,
                        }}>
                            <Icons.Plus size={16} />
                        </button>
                    </div>
                    <button
                        onClick={() => onAddToCart(product, qty)}
                        style={{
                            flex: 1, height: 36, border: "none", borderRadius: 8,
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                            color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        <Icons.Cart size={16} />
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    );
}
