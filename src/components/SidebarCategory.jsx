import React, { useState } from 'react';
import { COLORS } from '../constants.js';
import { Icons } from './Icons.jsx';

export default function SidebarCategory({ category, activeCategory, activeSub, onCategoryClick, onSubClick }) {
    const [open, setOpen] = useState(activeCategory === category.id);
    const hasSubs = category.subcategories && category.subcategories.length > 0;
    const isActive = activeCategory === category.id;

    return (
        <div>
            <button
                onClick={() => {
                    if (hasSubs) {
                        setOpen(!open);
                    }
                    onCategoryClick();
                }}
                style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 14px", border: "none", background: "transparent",
                    cursor: "pointer", fontSize: 16, fontWeight: isActive && !activeSub ? 600 : 500,
                    color: isActive && !activeSub ? COLORS.primary : COLORS.text,
                    borderRadius: 8, transition: "all 0.15s", textAlign: "left",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
                <div style={{ width: 24, height: 24, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                    {category.iconImg ? (
                        <img src={category.iconImg} alt={category.name} style={{ width: 24, height: 24, objectFit: "contain" }} />
                    ) : category.iconName && Icons[category.iconName] ? (
                        React.createElement(Icons[category.iconName], { size: 24, color: category.iconColor })
                    ) : (
                        category.icon
                    )}
                </div>
                <span style={{ flex: 1, fontSize: 16 }}>{category.name}</span>
                {hasSubs && (
                    <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "0.2s", color: COLORS.textMuted }}>
                        <Icons.ChevronDown size={16} />
                    </span>
                )}
            </button>
            {open && hasSubs && (
                <div style={{ paddingLeft: 52, paddingBottom: 8, paddingTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                    {category.subcategories.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => onSubClick(sub.id)}
                            style={{
                                display: "block", width: "100%", textAlign: "left",
                                padding: "8px 12px", border: "none", borderRadius: 6,
                                background: activeSub === sub.id ? COLORS.surfaceHover : "transparent",
                                color: activeSub === sub.id ? COLORS.primary : COLORS.textSecondary,
                                fontSize: 14, cursor: "pointer", fontWeight: activeSub === sub.id ? 700 : 500,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (activeSub !== sub.id) e.currentTarget.style.background = COLORS.surfaceHover; }}
                            onMouseLeave={(e) => { if (activeSub !== sub.id) e.currentTarget.style.background = "transparent"; }}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
