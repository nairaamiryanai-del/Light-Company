import React, { useState } from 'react';
import { COLORS } from '../constants.js';
import { Icons } from './Icons.jsx';
import { QuantityInput } from './QuantityInput.jsx';

export default function CartDrawer({ open, onClose, cart, products, onUpdateQty, onSetQty, onRemove, onSubmitOrder, onClearCart }) {
    const [shippingDate, setShippingDate] = useState("");
    const minDate = new Date().toISOString().split('T')[0];

    const total = cart.reduce((sum, item) => {
        const p = products.find((pr) => pr.id === item.productId);
        return sum + (p ? p.price * item.qty : 0);
    }, 0);

    const totalNoVat = cart.reduce((sum, item) => {
        const p = products.find((pr) => pr.id === item.productId);
        return sum + (p ? (p.priceNoVat || p.price) * item.qty : 0);
    }, 0);

    return (
        <>
            {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 999, backdropFilter: "blur(2px)" }} />}
            <div style={{
                position: "fixed", top: 0, right: 0, bottom: 0, width: 420, maxWidth: "90vw",
                background: COLORS.surface, zIndex: 1000, transform: open ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                display: "flex", flexDirection: "column",
                boxShadow: open ? "-10px 0 40px rgba(0,0,0,0.1)" : "none",
            }}>
                {/* Header */}
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>Корзина</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {cart.length > 0 && (
                            <button onClick={onClearCart} style={{
                                background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 6,
                                padding: "4px 12px", fontSize: 12, color: COLORS.textSecondary,
                                cursor: "pointer", transition: "all 0.2s"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#E53E3E"; e.currentTarget.style.color = "#E53E3E"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textSecondary; }}
                            >
                                Очистить
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                            <Icons.X size={24} />
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: "center", paddingTop: 60, color: COLORS.textMuted }}>
                            <Icons.Cart size={48} />
                            <div style={{ marginTop: 12, fontSize: 16 }}>Корзина пуста</div>
                        </div>
                    ) : (
                        cart.map((item) => {
                            const p = products.find((pr) => pr.id === item.productId);
                            if (!p) return null;
                            return (
                                <div key={item.productId} style={{
                                    display: "flex", gap: 12, padding: "14px 0",
                                    borderBottom: `1px solid ${COLORS.borderLight}`,
                                }}>
                                    <div style={{
                                        width: 60, height: 60, borderRadius: 8, overflow: "hidden",
                                        background: COLORS.bg, flexShrink: 0,
                                    }}>
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: COLORS.borderLight }}>
                                            📦
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{p.name}</div>
                                        <div style={{ fontSize: 12, color: COLORS.textMuted }}>арт. {p.article} · кратность {p.pack} шт.</div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${COLORS.border}`, borderRadius: 6 }}>
                                                <button onClick={() => onUpdateQty(item.productId, -p.pack)} style={{ width: 26, height: 28, border: "none", background: "transparent", cursor: "pointer", fontSize: 16, color: COLORS.textSecondary }}>−</button>
                                                <QuantityInput
                                                    value={item.qty}
                                                    packSize={p.pack}
                                                    onChange={(newQty) => onSetQty(item.productId, newQty)}
                                                    style={{ width: 36, fontSize: 12, fontWeight: 600, borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`, height: 28, lineHeight: "28px", borderRadius: 0 }}
                                                />
                                                <button onClick={() => onUpdateQty(item.productId, p.pack)} style={{ width: 26, height: 28, border: "none", background: "transparent", cursor: "pointer", fontSize: 16, color: COLORS.textSecondary }}>+</button>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>
                                                    {(p.price * item.qty).toLocaleString("ru-RU")} ₽
                                                </div>
                                                <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                                                    {((p.priceNoVat || p.price) * item.qty).toLocaleString("ru-RU")} ₽ без НДС
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => onRemove(item.productId)} style={{
                                        background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted,
                                        padding: 4, alignSelf: "flex-start",
                                    }}>
                                        <Icons.Trash size={16} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: COLORS.textMuted }}>Сумма без НДС:</span>
                            <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>{totalNoVat.toLocaleString("ru-RU")} ₽</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                            <span style={{ fontSize: 16, color: COLORS.textSecondary }}>Итого:</span>
                            <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{total.toLocaleString("ru-RU")} ₽</span>
                        </div>
                        <div style={{ padding: "16px 0", borderTop: `1px solid ${COLORS.borderLight}`, borderBottom: `1px solid ${COLORS.borderLight}`, marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8 }}>
                                Желаемая дата отгрузки <span style={{ color: "#E53E3E" }}>*</span>
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                value={shippingDate}
                                onChange={(e) => setShippingDate(e.target.value)}
                                style={{
                                    width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                    border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none", boxSizing: "border-box", color: COLORS.text,
                                }}
                            />
                        </div>

                        <button
                            onClick={() => onSubmitOrder(shippingDate)}
                            disabled={!shippingDate}
                            style={{
                                width: "100%", height: 48, border: "none", borderRadius: 10,
                                background: shippingDate ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` : COLORS.border,
                                color: shippingDate ? "#fff" : COLORS.textMuted, fontSize: 16, fontWeight: 700, cursor: shippingDate ? "pointer" : "not-allowed",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => { if (shippingDate) e.currentTarget.style.opacity = "0.9" }}
                            onMouseLeave={(e) => { if (shippingDate) e.currentTarget.style.opacity = "1" }}
                        >
                            <Icons.Send size={16} />
                            Отправить заказ менеджеру
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
