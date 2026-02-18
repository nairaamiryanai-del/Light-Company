import { useState, useEffect, useRef, useCallback } from "react";
import { PRODUCTS } from "./products-data.js";
import { getProductPhotos } from "./photo-map.js";

const COLORS = {
    primary: "#00B4D8",
    primaryDark: "#0096B7",
    accent: "#E91E8C",
    accentLight: "#FF4DA6",
    bg: "#F7F9FC",
    surface: "#FFFFFF",
    surfaceHover: "#F0F6FA",
    text: "#1A2332",
    textSecondary: "#5A6B7F",
    textMuted: "#8E9BAA",
    border: "#E2E8F0",
    borderLight: "#F0F4F8",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
};

const CATEGORIES = [
    {
        id: "shoes",
        name: "Обувь",
        icon: "👟",
        subcategories: [
            { id: "winter", name: "Зима" },
            { id: "summer", name: "Лето" },
            { id: "spring-autumn", name: "Весна-осень" },
            { id: "rubber", name: "Резина" },
            { id: "home", name: "Домашняя обувь" },
        ],
    },
    {
        id: "eva-sheets",
        name: "ЭВА-листы",
        icon: "📄",
        subcategories: [
            { id: "rhombus", name: "Ромб" },
            { id: "honeycomb", name: "Сота" },
            { id: "large-rhombus", name: "Крупный ромб" },
            { id: "bubble", name: "Пупырышки" },
        ],
    },
    {
        id: "doormats",
        name: "Придверные коврики",
        icon: "🚪",
        subcategories: [
            { id: "sizes", name: "По размерам" },
            { id: "pattern", name: "По рисунку" },
        ],
    },
    {
        id: "covers",
        name: "Чехлы",
        icon: "🛡️",
        subcategories: [{ id: "assortment", name: "Ассортимент" }],
    },
    {
        id: "car-covers",
        name: "Автонакидки",
        icon: "🚗",
        subcategories: [{ id: "all", name: "Все модели" }],
    },
    {
        id: "straps",
        name: "Стропа",
        icon: "🔗",
        subcategories: [],
    },
    {
        id: "braid",
        name: "Тесьма",
        icon: "🧵",
        subcategories: [],
    },
];

// PRODUCTS imported from ./products-data.js (627 items from CSV)

const HQ = {
    address: "357748, Россия, Ставропольский край, г. Кисловодск, ул. Чехова, 66",
    mailAddress: "357700, Россия, Ставропольский край, г. Кисловодск ОПС 36 а/я 5",
    phones: [
        { label: "Центральный офис", number: "+7 (863) 303-34-23" },
        { label: "Бесплатный по России", number: "8 (800) 550-60-67" },
        { label: "Коммерческий отдел", number: "+7 (928) 97-1111-2" },
        { label: "Отдел контроля качества", number: "+7 (928) 35-1111-2" },
    ],
    email: "light-c@mail.ru",
    schedule: "Пн.-Пт. с 09:00 до 18:00, перерыв 12:00-13:00. Сб., Вс. — выходной",
};

const BRANCHES = [
    { region: "ЦФО (Москва)", address: "Московская область, г. Дзержинский, Дзержинское шоссе, 2", phone: "+7 (916) 017-44-54, +7 (928) 6-500-900", email: "light-c@mail.ru" },
    { region: "Санкт-Петербург", address: "г. Санкт-Петербург, метро Фрунзенская, ул. Киевская, 5А3, склад 58", phone: "+7 (921) 569-84-59, +7 (928) 370-95-75", email: "obyvlait.spb@mail.ru" },
    { region: "Волгоградская область", address: "г. Волгоград, ул. Шопена, 4Б", phone: "+7 (960) 869-41-00", email: "light.volgograd@mail.ru" },
    { region: "Воронежская область", address: "г. Воронеж, ул. Волгоградская, д. 30, офис 333", phone: "+7 (920) 212-63-84", email: "light-voronej@mail.ru" },
    { region: "Свердловская область (Екатеринбург)", address: "г. Екатеринбург, ул. Фронтовых бригад, 15/15", phone: "+7 (992) 018-38-01", email: "company-light@mail.ru" },
    { region: "Ивановская область", address: "г. Иваново, ул. Громобоя, д1, территория базы \"Зима-Авто\"", phone: "+7 (910) 991-28-78, +7 (938) 355-19-38", email: "light-i37@mail.ru" },
    { region: "Республика Татарстан (Казань)", address: "г. Казань, Горьковское шоссе 53а, офис 209", phone: "+7 (917) 273-76-81", email: "light-kzn@bk.ru" },
    { region: "Краснодарский край", address: "г. Краснодар, хутор Октябрьский, ул. Живописная, 72, офис 27", phone: "+7 (918) 381-21-21, +7 (918) 997-92-25", email: "company.light@mail.ru" },
    { region: "Республика Крым", address: "г. Симферополь, ул. Жени Дерюгиной, 9А", phone: "+7 (978) 746-69-08", email: "light-krim@mail.ru" },
    { region: "Самарская область", address: "пос. Смышляевка, ул. Механиков, 2, офис 11", phone: "+7 (927) 009-71-06, +7 (938) 349-19-38", email: "light-samara@mail.ru" },
    { region: "Саратовская область", address: "г. Саратов, пос. Строитель, ул. Автокомбинатовская, 12", phone: "+7 (919) 839-81-71", email: "light-saratov@mail.ru" },
    { region: "Республика Башкортостан (Уфа)", address: "г. Уфа, ул. Трамвайная 16/6 «б»", phone: "+7 (937) 314-45-33", email: "ufa.light-c@yandex.ru" },
];

const DEALERS = [
    { region: "Республика Беларусь", company: "ООО \"РосОбувьТрейд\"", office: "г. Минск, ул. Платонова, 36, каб. 18", warehouse: "г. Минск, ул. Платонова, 34/1", phone: "+375 29 679 63 61, +375 29 233-31-69", email: "rosobuvtorg@mail.ru", site: "www.rosobuvtrad.by" },
];

// Icons as SVG components
const Icons = {
    Search: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
    ),
    Heart: ({ size = 20, filled = false }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    ),
    Cart: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    ),
    User: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    ),
    ChevronDown: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),
    ChevronRight: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    ),
    Plus: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
    ),
    Minus: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
        </svg>
    ),
    X: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    ),
    Phone: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
    ),
    MapPin: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Package: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
        </svg>
    ),
    Clock: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Star: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Trash: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    ),
    Menu: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    ),
    Send: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" /><path d="m22 2-11 11" />
        </svg>
    ),
};

// Badge component
function Badge({ children, color = COLORS.accent, style = {} }) {
    return (
        <span style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "#fff",
            backgroundColor: color,
            ...style,
        }}>
            {children}
        </span>
    );
}

// Product Card
function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite, cartQty, onUpdateCart }) {
    const [qty, setQty] = useState(product.pack);
    const [photoIdx, setPhotoIdx] = useState(0);
    const photos = getProductPhotos(product.article);
    const hasPhotos = photos.length > 0;
    const hasMultiple = photos.length > 1;

    const adjustQty = (delta) => {
        const newQty = Math.max(product.pack, qty + delta * product.pack);
        setQty(newQty);
    };

    const prevPhoto = (e) => { e.stopPropagation(); setPhotoIdx((i) => (i - 1 + photos.length) % photos.length); };
    const nextPhoto = (e) => { e.stopPropagation(); setPhotoIdx((i) => (i + 1) % photos.length); };

    const subEmoji = product.sub === "winter" ? "\u2744\ufe0f" : product.sub === "summer" ? "\u2600\ufe0f" : product.sub === "spring-autumn" ? "\ud83c\udf42" : product.sub === "rubber" ? "\ud83c\udf27\ufe0f" : "\ud83c\udfe0";

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
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,180,216,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
            }}
        >
            {/* Favorite button */}
            <button
                onClick={() => onToggleFavorite(product.id)}
                style={{
                    position: "absolute", top: 10, right: 10, zIndex: 3,
                    background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
                    width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: isFavorite ? COLORS.accent : COLORS.textMuted,
                    transition: "all 0.2s",
                    backdropFilter: "blur(4px)",
                }}
            >
                <Icons.Heart size={18} filled={isFavorite} />
            </button>

            {/* Photo area */}
            <div style={{
                height: 180, background: `linear-gradient(135deg, ${COLORS.borderLight}, ${COLORS.bg})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
                fontSize: 48, userSelect: "none",
            }}>
                {hasPhotos ? (
                    <>
                        <img
                            src={photos[photoIdx]}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                        {hasMultiple && (
                            <>
                                <button onClick={prevPhoto} style={{
                                    position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)",
                                    width: 28, height: 28, borderRadius: "50%", border: "none",
                                    background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 700, zIndex: 2,
                                }}>‹</button>
                                <button onClick={nextPhoto} style={{
                                    position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                                    width: 28, height: 28, borderRadius: "50%", border: "none",
                                    background: "rgba(0,0,0,0.4)", color: "#fff", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 700, zIndex: 2,
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
                        )}
                    </>
                ) : (
                    subEmoji
                )}
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.5px", marginBottom: 4 }}>
                    арт. {product.article}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 8, lineHeight: 1.35, minHeight: 38 }}>
                    {product.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.textSecondary }}>
                    <Icons.Package size={14} />
                    <span>Кратность: {product.pack} шт.</span>
                </div>

                {/* Prices */}
                <div style={{ marginTop: "auto", paddingTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>
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
                            <Icons.Minus size={14} />
                        </button>
                        <span style={{
                            width: 44, textAlign: "center", fontSize: 13, fontWeight: 600, color: COLORS.text,
                            borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`,
                            lineHeight: "36px",
                        }}>
                            {qty}
                        </span>
                        <button onClick={() => adjustQty(1)} style={{
                            width: 32, height: 36, border: "none", background: "transparent",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            color: COLORS.textSecondary,
                        }}>
                            <Icons.Plus size={14} />
                        </button>
                    </div>
                    <button
                        onClick={() => onAddToCart(product, qty)}
                        style={{
                            flex: 1, height: 36, border: "none", borderRadius: 8,
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        <Icons.Cart size={15} />
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sidebar Category
function SidebarCategory({ cat, activeSub, onSelect }) {
    const [open, setOpen] = useState(false);
    const hasSubs = cat.subcategories.length > 0;

    return (
        <div>
            <button
                onClick={() => hasSubs ? setOpen(!open) : onSelect(cat.id, null)}
                style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", border: "none", background: "transparent",
                    cursor: "pointer", fontSize: 14, fontWeight: 500, color: COLORS.text,
                    borderRadius: 8, transition: "all 0.15s", textAlign: "left",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{cat.icon}</span>
                <span style={{ flex: 1 }}>{cat.name}</span>
                {hasSubs && (
                    <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "0.2s", color: COLORS.textMuted }}>
                        <Icons.ChevronDown size={14} />
                    </span>
                )}
            </button>
            {open && hasSubs && (
                <div style={{ paddingLeft: 48, paddingBottom: 4 }}>
                    {cat.subcategories.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => onSelect(cat.id, sub.id)}
                            style={{
                                display: "block", width: "100%", textAlign: "left",
                                padding: "7px 12px", border: "none", borderRadius: 6,
                                background: activeSub === sub.id ? `${COLORS.primary}12` : "transparent",
                                color: activeSub === sub.id ? COLORS.primary : COLORS.textSecondary,
                                fontSize: 13, cursor: "pointer", fontWeight: activeSub === sub.id ? 600 : 400,
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

// Promo Banner
function PromoBanner({ type, count }) {
    const isNew = type === "new";
    return (
        <div style={{
            flex: 1, minWidth: 260, padding: "24px 28px", borderRadius: 14,
            background: isNew
                ? `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.primary}08)`
                : `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.accent}05)`,
            border: `1px solid ${isNew ? COLORS.primary + "25" : COLORS.accent + "20"}`,
            position: "relative", overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", top: -20, right: -20, width: 100, height: 100,
                borderRadius: "50%", background: isNew ? `${COLORS.primary}10` : `${COLORS.accent}10`,
            }} />
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: isNew ? COLORS.primary : COLORS.accent, marginBottom: 8 }}>
                {isNew ? "Новинки" : "Акции"}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>
                {count} {isNew ? "новых товаров" : "специальных цен"}
            </div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6 }}>
                {isNew ? "Свежие поступления этого сезона" : "Успейте заказать по сниженной цене"}
            </div>
        </div>
    );
}

// Cart Drawer
function CartDrawer({ open, onClose, cart, products, onUpdateQty, onRemove, onSubmitOrder }) {
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
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Корзина</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                        <Icons.X size={22} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: "center", paddingTop: 60, color: COLORS.textMuted }}>
                            <Icons.Cart size={48} />
                            <div style={{ marginTop: 12, fontSize: 15 }}>Корзина пуста</div>
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
                                        <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{p.name}</div>
                                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>арт. {p.article} · кратность {p.pack} шт.</div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${COLORS.border}`, borderRadius: 6 }}>
                                                <button onClick={() => onUpdateQty(item.productId, -p.pack)} style={{ width: 26, height: 28, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: COLORS.textSecondary }}>−</button>
                                                <span style={{ width: 36, textAlign: "center", fontSize: 12, fontWeight: 600, borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`, lineHeight: "28px" }}>{item.qty}</span>
                                                <button onClick={() => onUpdateQty(item.productId, p.pack)} style={{ width: 26, height: 28, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: COLORS.textSecondary }}>+</button>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
                                                    {(p.price * item.qty).toLocaleString("ru-RU")} ₽
                                                </div>
                                                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                                                    {((p.priceNoVat || p.price) * item.qty).toLocaleString("ru-RU")} ₽ без НДС
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => onRemove(item.productId)} style={{
                                        background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted,
                                        padding: 4, alignSelf: "flex-start",
                                    }}>
                                        <Icons.Trash size={14} />
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
                            <span style={{ fontSize: 13, color: COLORS.textMuted }}>Сумма без НДС:</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{totalNoVat.toLocaleString("ru-RU")} ₽</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                            <span style={{ fontSize: 15, color: COLORS.textSecondary }}>Итого:</span>
                            <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>{total.toLocaleString("ru-RU")} ₽</span>
                        </div>
                        <button
                            onClick={onSubmitOrder}
                            style={{
                                width: "100%", height: 48, border: "none", borderRadius: 10,
                                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                        >
                            <Icons.Send size={18} />
                            Отправить заказ менеджеру
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// Account Modal
function AccountModal({ open, onClose }) {
    const [tab, setTab] = useState("login");
    const [role, setRole] = useState("buyer");

    if (!open) return null;
    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 999, backdropFilter: "blur(2px)" }} />
            <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 440, maxWidth: "90vw", background: COLORS.surface, borderRadius: 16, zIndex: 1000,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden",
            }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Личный кабинет</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                        <Icons.X />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
                    {[["login", "Вход"], ["register", "Регистрация"]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{
                            flex: 1, padding: "12px 0", border: "none", background: "transparent",
                            fontSize: 14, fontWeight: tab === key ? 700 : 400, cursor: "pointer",
                            color: tab === key ? COLORS.primary : COLORS.textSecondary,
                            borderBottom: tab === key ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                            transition: "all 0.2s",
                        }}>
                            {label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: "24px" }}>
                    {tab === "register" && (
                        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                            {[["employee", "Сотрудник"], ["buyer", "Покупатель"]].map(([key, label]) => (
                                <button key={key} onClick={() => setRole(key)} style={{
                                    flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
                                    border: `2px solid ${role === key ? COLORS.primary : COLORS.border}`,
                                    background: role === key ? `${COLORS.primary}08` : "transparent",
                                    color: role === key ? COLORS.primary : COLORS.textSecondary,
                                    fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                                }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}

                    {["ФИО", "Телефон", "Эл. почта"].map((label) => (
                        <div key={label} style={{ marginBottom: 14 }}>
                            <label style={{ block: "block", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary, marginBottom: 5 }}>{label}</label>
                            <input style={{
                                width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none",
                                boxSizing: "border-box", transition: "border 0.2s",
                            }}
                                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                                onBlur={(e) => e.target.style.borderColor = COLORS.border}
                            />
                        </div>
                    ))}

                    {tab === "register" && role === "buyer" && (
                        <>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary, marginBottom: 5 }}>Выбор подразделения</label>
                                <select style={{
                                    width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                    border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none",
                                    background: "#fff", boxSizing: "border-box",
                                }}>
                                    <option value="">— Выберите подразделение —</option>
                                    <option>Центральный офис (Кисловодск)</option>
                                    {BRANCHES.map((b, i) => (
                                        <option key={i}>{b.region}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary, marginBottom: 5 }}>Выбор менеджера</label>
                                <select style={{
                                    width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                    border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none",
                                    background: "#fff", boxSizing: "border-box",
                                }}>
                                    <option value="">— Выберите менеджера —</option>
                                    <option>Менеджер 1</option>
                                    <option>Менеджер 2</option>
                                    <option>Менеджер 3</option>
                                </select>
                            </div>
                        </>
                    )}

                    {tab === "register" && role === "employee" && (
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary, marginBottom: 5 }}>Выбор подразделения</label>
                            <select style={{
                                width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none",
                                background: "#fff", boxSizing: "border-box",
                            }}>
                                <option value="">— Выберите подразделение —</option>
                                <option>Центральный офис (Кисловодск)</option>
                                {BRANCHES.map((b, i) => (
                                    <option key={i}>{b.region}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {tab === "login" && (
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary, marginBottom: 5 }}>Пароль</label>
                            <input type="password" style={{
                                width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box",
                            }} />
                        </div>
                    )}

                    <button style={{
                        width: "100%", height: 46, border: "none", borderRadius: 10, marginTop: 8,
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                        color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                    }}>
                        {tab === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                </div>
            </div>
        </>
    );
}

// Contacts Page
function ContactsPage() {
    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 24 }}>Контакты</h2>

            {/* HQ Section */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>🏢</span> Центральный офис
                </h3>
                <div style={{
                    padding: 24, borderRadius: 12, border: `1px solid ${COLORS.border}`,
                    background: `linear-gradient(135deg, ${COLORS.primary}08, ${COLORS.primary}03)`,
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 14, color: COLORS.textSecondary }}>
                        <Icons.MapPin size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>{HQ.address}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8, marginBottom: 12 }}>
                        {HQ.phones.map((p, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.textSecondary }}>
                                <Icons.Phone size={14} />
                                <span><b>{p.number}</b> — {p.label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13, color: COLORS.textSecondary }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span>✉️</span> <a href={`mailto:${HQ.email}`} style={{ color: COLORS.primary, textDecoration: "none" }}>{HQ.email}</a>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span>🕐</span> {HQ.schedule}
                        </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: COLORS.textMuted }}>
                        📮 Почтовый адрес: {HQ.mailAddress}
                    </div>
                </div>
            </div>

            {/* Regional offices */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>🗺️</span> Представительства
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                    {BRANCHES.map((b, i) => (
                        <div key={i} style={{
                            padding: 18, borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.surface,
                            transition: "box-shadow 0.2s",
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                        >
                            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{b.region}</div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6, fontSize: 13, color: COLORS.textSecondary }}>
                                <Icons.MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                                <span>{b.address}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 13, color: COLORS.textSecondary }}>
                                <Icons.Phone size={14} />
                                <span>{b.phone}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                <span style={{ fontSize: 12 }}>✉️</span>
                                <a href={`mailto:${b.email}`} style={{ color: COLORS.primary, textDecoration: "none", fontSize: 13 }}>{b.email}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dealers */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>🤝</span> Официальные дилеры
                </h3>
                {DEALERS.map((d, i) => (
                    <div key={i} style={{
                        padding: 18, borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.surface,
                    }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{d.region}</div>
                        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, fontStyle: "italic" }}>{d.company}</div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4, fontSize: 13, color: COLORS.textSecondary }}>
                            <Icons.MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span>Офис: {d.office}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4, fontSize: 13, color: COLORS.textSecondary }}>
                            <Icons.MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span>Склад: {d.warehouse}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 13, color: COLORS.textSecondary }}>
                            <Icons.Phone size={14} />
                            <span>{d.phone}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12 }}>✉️</span>
                                <a href={`mailto:${d.email}`} style={{ color: COLORS.primary, textDecoration: "none" }}>{d.email}</a>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12 }}>🌐</span>
                                <a href={`http://${d.site}`} target="_blank" rel="noreferrer" style={{ color: COLORS.primary, textDecoration: "none" }}>{d.site}</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Order Success Toast
function Toast({ message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 2000,
            background: COLORS.success, color: "#fff", padding: "14px 22px",
            borderRadius: 10, fontSize: 14, fontWeight: 600,
            boxShadow: "0 6px 20px rgba(16,185,129,0.3)",
            animation: "slideUp 0.3s ease",
        }}>
            {message}
        </div>
    );
}

// Main App
export default function LightCompanyApp() {
    const [page, setPage] = useState("catalog");
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSub, setActiveSub] = useState(null);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [cartOpen, setCartOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSelectCategory = (catId, subId) => {
        setActiveCategory(catId);
        setActiveSub(subId);
        setPage("catalog");
        setShowFavoritesOnly(false);
        setMobileMenuOpen(false);
    };

    const handleAddToCart = (product, qty) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.id ? { ...item, qty: item.qty + qty } : item
                );
            }
            return [...prev, { productId: product.id, qty }];
        });
        setToast(`${product.name} добавлен в корзину`);
    };

    const handleUpdateCartQty = (productId, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.productId !== productId) return item;
                const p = PRODUCTS.find((pr) => pr.id === productId);
                const newQty = item.qty + delta;
                return newQty < p.pack ? item : { ...item, qty: newQty };
            })
        );
    };

    const handleRemoveFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
    };

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSubmitOrder = () => {
        setCart([]);
        setCartOpen(false);
        setToast("Заказ успешно отправлен менеджеру!");
    };

    // Filter products
    let filtered = PRODUCTS;
    if (showFavoritesOnly) {
        filtered = filtered.filter((p) => favorites.has(p.id));
    } else {
        if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
        if (activeSub) filtered = filtered.filter((p) => p.sub === activeSub);
    }
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.article.toLowerCase().includes(q)
        );
    }

    const newCount = PRODUCTS.filter((p) => p.isNew).length;
    const saleCount = PRODUCTS.filter((p) => p.isSale).length;
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const sidebarContent = (
        <>
            <div style={{ padding: "0 10px", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: COLORS.textMuted, padding: "8px 14px" }}>
                    Каталог
                </div>
            </div>
            {CATEGORIES.map((cat) => (
                <SidebarCategory key={cat.id} cat={cat} activeSub={activeSub} onSelect={handleSelectCategory} />
            ))}
            <div style={{ height: 1, background: COLORS.border, margin: "12px 14px" }} />
            <button
                onClick={() => { setPage("contacts"); setMobileMenuOpen(false); }}
                style={{
                    width: "calc(100% - 20px)", margin: "0 10px", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", border: "none", borderRadius: 8,
                    background: page === "contacts" ? `${COLORS.primary}10` : "transparent",
                    cursor: "pointer", fontSize: 14, fontWeight: 500,
                    color: page === "contacts" ? COLORS.primary : COLORS.text,
                    textAlign: "left",
                }}
            >
                <Icons.MapPin size={16} />
                Контакты
            </button>
        </>
    );

    return (
        <div style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", background: COLORS.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textMuted}; }
        input::placeholder { color: ${COLORS.textMuted}; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-overlay { display: none !important; }
          .mobile-sidebar { display: none !important; }
        }
      `}</style>

            {/* HEADER */}
            <header style={{
                background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
                position: "sticky", top: 0, zIndex: 100,
            }}>
                <div style={{
                    maxWidth: 1400, margin: "0 auto", padding: "0 24px",
                    height: 64, display: "flex", alignItems: "center", gap: 20,
                }}>
                    {/* Mobile menu button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.text, display: "none", alignItems: "center" }}
                    >
                        <Icons.Menu />
                    </button>

                    {/* Logo */}
                    <div
                        onClick={() => { setPage("catalog"); setActiveCategory(null); setActiveSub(null); setShowFavoritesOnly(false); }}
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
                    >
                        <img src="/logo.png" alt="Logo" style={{ height: 42, objectFit: "contain" }} />
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, lineHeight: 1.1, letterSpacing: "-0.3px" }}>
                                LIGHT
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: COLORS.accent, letterSpacing: "2px", textTransform: "uppercase" }}>
                                COMPANY
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{
                        flex: 1, maxWidth: 480, position: "relative",
                    }}>
                        <Icons.Search size={17} />
                        <input
                            placeholder="Поиск по артикулу или названию..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%", height: 40, paddingLeft: 38, paddingRight: 14,
                                borderRadius: 10, border: `1px solid ${COLORS.border}`,
                                fontSize: 13, outline: "none", background: COLORS.bg,
                                transition: "all 0.2s",
                            }}
                            onFocus={(e) => { e.target.style.borderColor = COLORS.primary; e.target.style.background = "#fff"; }}
                            onBlur={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.background = COLORS.bg; }}
                        />
                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.textMuted, pointerEvents: "none" }}>
                            <Icons.Search size={17} />
                        </div>
                    </div>

                    {/* Nav buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                            onClick={() => { setShowFavoritesOnly(true); setPage("catalog"); }}
                            style={{
                                background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
                                display: "flex", alignItems: "center", gap: 6, borderRadius: 8,
                                color: showFavoritesOnly ? COLORS.accent : COLORS.textSecondary,
                                fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                            }}
                        >
                            <Icons.Heart size={18} filled={showFavoritesOnly} />
                            <span style={{ display: "inline-block" }}>Избранное</span>
                            {favorites.size > 0 && (
                                <span style={{
                                    background: COLORS.accent, color: "#fff", borderRadius: 10,
                                    padding: "1px 6px", fontSize: 10, fontWeight: 700,
                                }}>
                                    {favorites.size}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setCartOpen(true)}
                            style={{
                                background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
                                display: "flex", alignItems: "center", gap: 6, borderRadius: 8,
                                color: COLORS.textSecondary, fontSize: 13, fontWeight: 500, position: "relative",
                            }}
                        >
                            <Icons.Cart size={18} />
                            <span>Корзина</span>
                            {cartCount > 0 && (
                                <span style={{
                                    background: COLORS.primary, color: "#fff", borderRadius: 10,
                                    padding: "1px 6px", fontSize: 10, fontWeight: 700,
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setAccountOpen(true)}
                            style={{
                                width: 38, height: 38, borderRadius: 10, border: `1px solid ${COLORS.border}`,
                                background: COLORS.surface, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: COLORS.textSecondary, transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
                        >
                            <Icons.User size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <div style={{ flex: 1, maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex" }}>
                {/* Mobile menu overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50,
                    }} />
                )}

                {/* Mobile sidebar */}
                {mobileMenuOpen && (
                    <div className="mobile-sidebar" style={{
                        position: "fixed", top: 64, left: 0, bottom: 0, width: 280,
                        background: COLORS.surface, zIndex: 51, overflowY: "auto",
                        boxShadow: "4px 0 20px rgba(0,0,0,0.1)", paddingTop: 12,
                    }}>
                        {sidebarContent}
                    </div>
                )}

                {/* Desktop Sidebar */}
                <aside className="desktop-sidebar" style={{
                    width: 260, flexShrink: 0, background: COLORS.surface,
                    borderRight: `1px solid ${COLORS.border}`,
                    overflowY: "auto", paddingTop: 16, paddingBottom: 24,
                    position: "sticky", top: 64, height: "calc(100vh - 64px)",
                }}>
                    {sidebarContent}
                </aside>

                {/* Content */}
                <main style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>
                    {page === "contacts" ? (
                        <ContactsPage />
                    ) : (
                        <>
                            {/* Promo banners */}
                            {!activeCategory && !showFavoritesOnly && (
                                <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                                    <PromoBanner type="new" count={newCount} />
                                    <PromoBanner type="sale" count={saleCount} />
                                </div>
                            )}

                            {/* Page title */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>
                                        {showFavoritesOnly
                                            ? "Избранное"
                                            : activeCategory
                                                ? CATEGORIES.find((c) => c.id === activeCategory)?.name || "Каталог"
                                                : "Все товары"}
                                    </h2>
                                    <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
                                        {filtered.length} {filtered.length === 1 ? "товар" : filtered.length < 5 ? "товара" : "товаров"}
                                    </div>
                                </div>
                                {activeCategory && (
                                    <button
                                        onClick={() => { setActiveCategory(null); setActiveSub(null); }}
                                        style={{
                                            background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8,
                                            padding: "6px 14px", fontSize: 12, color: COLORS.textSecondary,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Показать все
                                    </button>
                                )}
                            </div>

                            {/* Products grid */}
                            {filtered.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textMuted }}>
                                    <Icons.Search size={48} />
                                    <div style={{ marginTop: 12, fontSize: 15 }}>Товары не найдены</div>
                                    <div style={{ fontSize: 13, marginTop: 4 }}>Попробуйте изменить параметры поиска</div>
                                </div>
                            ) : (
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                    gap: 18,
                                }}>
                                    {filtered.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                            onToggleFavorite={toggleFavorite}
                                            isFavorite={favorites.has(product.id)}
                                            cartQty={cart.find((c) => c.productId === product.id)?.qty || 0}
                                            onUpdateCart={() => { }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Drawers & Modals */}
            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                products={PRODUCTS}
                onUpdateQty={handleUpdateCartQty}
                onRemove={handleRemoveFromCart}
                onSubmitOrder={handleSubmitOrder}
            />
            <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}
