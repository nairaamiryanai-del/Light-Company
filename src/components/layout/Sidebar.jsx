import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, COLORS } from '../../constants';
import { useUIStore } from '../../store/uiStore';
import SidebarCategory from '../SidebarCategory';
import { Icons } from '../Icons';
import { PRODUCTS } from '../../products-data';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { setMobileMenuOpen } = useUIStore();

    const parts = location.pathname.split('/');
    const isCatalog = parts[1] === 'catalog';
    const activeCategory = isCatalog && parts.length > 2 ? parts[2] : null;
    const activeSub = isCatalog && parts.length > 3 ? parts[3] : null;

    const newCount = PRODUCTS.filter(p => p.isNew).length;
    const saleCount = PRODUCTS.filter(p => p.isSale).length;

    const handleNav = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const navBtnStyle = (isActive) => ({
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", border: "none", borderRadius: 10,
        cursor: "pointer", fontSize: 14, fontWeight: 600,
        background: isActive ? COLORS.surfaceHover : "transparent",
        color: isActive ? COLORS.primary : COLORS.textSecondary,
        transition: "all 0.15s", textAlign: "left",
    });

    return (
        <nav style={{ padding: "0 12px" }}>
            <div style={{
                fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
                textTransform: "uppercase", letterSpacing: "1.5px",
                padding: "0 16px", marginBottom: 16,
            }}>
                Каталог
            </div>

            {CATEGORIES.map((cat) => (
                <SidebarCategory
                    key={cat.id}
                    category={cat}
                    activeCategory={activeCategory}
                    activeSub={activeSub}
                    onCategoryClick={() => handleNav(`/catalog/${cat.id}`)}
                    onSubClick={(subId) => handleNav(`/catalog/${cat.id}/${subId}`)}
                />
            ))}

            <div style={{ height: 1, background: COLORS.borderLight, margin: "16px 8px" }} />

            {/* Новинки */}
            <button
                onClick={() => handleNav('/new')}
                style={navBtnStyle(location.pathname === '/new')}
                onMouseEnter={e => { if (location.pathname !== '/new') e.currentTarget.style.background = COLORS.surfaceHover; }}
                onMouseLeave={e => { if (location.pathname !== '/new') e.currentTarget.style.background = "transparent"; }}
            >
                <Icons.Clock size={18} />
                <span style={{ color: "#E53E3E", fontWeight: 700 }}>Новинки</span>
                {newCount > 0 && (
                    <span style={{
                        marginLeft: "auto", background: "#E53E3E", color: "#fff",
                        borderRadius: 12, fontSize: 11, minWidth: 20, height: 20,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, padding: "0 6px",
                    }}>{newCount}</span>
                )}
            </button>

            {/* Акции */}
            <button
                onClick={() => handleNav('/sale')}
                style={navBtnStyle(location.pathname === '/sale')}
                onMouseEnter={e => { if (location.pathname !== '/sale') e.currentTarget.style.background = COLORS.surfaceHover; }}
                onMouseLeave={e => { if (location.pathname !== '/sale') e.currentTarget.style.background = "transparent"; }}
            >
                <Icons.Star size={18} />
                <span style={{ color: "#E53E3E", fontWeight: 700 }}>Акции</span>
                {saleCount > 0 && (
                    <span style={{
                        marginLeft: "auto", background: "#E53E3E", color: "#fff",
                        borderRadius: 12, fontSize: 11, minWidth: 20, height: 20,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, padding: "0 6px",
                    }}>{saleCount}</span>
                )}
            </button>

            <div style={{ height: 1, background: COLORS.borderLight, margin: "16px 8px" }} />

            {/* Контакты */}
            <button
                onClick={() => handleNav('/contacts')}
                style={navBtnStyle(location.pathname === '/contacts')}
                onMouseEnter={e => { if (location.pathname !== '/contacts') e.currentTarget.style.background = COLORS.surfaceHover; }}
                onMouseLeave={e => { if (location.pathname !== '/contacts') e.currentTarget.style.background = "transparent"; }}
            >
                <Icons.MapPin size={18} />
                Контакты
            </button>
        </nav>
    );
}
