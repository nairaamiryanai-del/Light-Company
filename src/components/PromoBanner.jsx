import React from 'react';
import { COLORS } from '../constants.js';

export default function PromoBanner({ type, count, onClick }) {
    const isNew = type === "new";
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1, minWidth: 260, padding: "24px 28px", borderRadius: 14,
                background: isNew
                    ? `linear-gradient(135deg, ${COLORS.primary} 0%, #17366b 100%)`
                    : `linear-gradient(135deg, #E53E3E 0%, #c62828 100%)`,
                border: "none",
                position: "relative", overflow: "hidden",
                cursor: "pointer", textAlign: "left",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
            }}
        >
            <div style={{
                position: "absolute", top: -20, right: -20, width: 120, height: 120,
                borderRadius: "50%", background: "rgba(255,255,255,0.1)",
                pointerEvents: "none"
            }} />
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
                {isNew ? "Новинки ассортимента" : "Специальные цены"}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                {count} {isNew ? "новых" : "акционных"} товаров
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                К каталогу →
            </div>
        </button>
    );
}
