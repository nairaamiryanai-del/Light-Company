import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../Icons.jsx';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useUIStore } from '../../store/uiStore';
import { COLORS } from '../../constants';

export default function Header() {
    const { user, logout } = useAuthStore();
    const { cart } = useCartStore();
    const { favorites } = useFavoritesStore();
    const {
        mobileMenuOpen, setMobileMenuOpen,
        searchQuery, setSearchQuery,
        setCartOpen, setAccountOpen, setToast
    } = useUIStore();

    const navigate = useNavigate();
    const location = useLocation();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        // If on homepage or non-catalog page, navigate to /?q=
        const onCatalog = location.pathname.startsWith('/catalog') || location.pathname === '/new' || location.pathname === '/sale' || location.pathname === '/favorites';
        if (!onCatalog) {
            if (val) {
                navigate(`/?q=${encodeURIComponent(val)}`);
            } else {
                navigate(`/`);
            }
        }
        // On catalog pages, search filters in-place via activeSearch in CatalogPage
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        setToast("Вы вышли из аккаунта");
        navigate('/');
    };

    return (
        <header style={{
            background: COLORS.surface,
            borderBottom: `1px solid ${COLORS.border}`,
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <div style={{
                maxWidth: 1400, margin: "0 auto", padding: "0 24px",
                height: 64, display: "flex", alignItems: "center", gap: 20,
            }}>
                {/* Hamburger for mobile */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: COLORS.text, padding: 6, borderRadius: 8,
                        display: "none", alignItems: "center", justifyContent: "center",
                    }}
                >
                    <Icons.Menu size={24} />
                </button>

                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setSearchQuery("")}
                    style={{ textDecoration: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
                >
                    <img src="/logo.png" alt="Light Company" style={{ height: 44, objectFit: "contain" }} />
                    <div className="header-nav-text" style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: COLORS.primary, lineHeight: 1, letterSpacing: "0.2px" }}>
                            LIGHT
                        </span>
                        <span style={{ fontSize: 20, fontWeight: 600, color: COLORS.accent, letterSpacing: "1.5px" }}>
                            COMPANY
                        </span>
                    </div>
                </Link>

                {/* Search */}
                <div className="header-search" style={{ flex: 1, maxWidth: 480, position: "relative", marginLeft: "auto", marginRight: 16 }}>
                    <input
                        placeholder="Поиск по артикулу или названию..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{
                            width: "100%", height: 40, paddingLeft: 38, paddingRight: 14,
                            borderRadius: 12, border: `1px solid ${COLORS.border}`,
                            fontSize: 16, outline: "none", background: COLORS.bg,
                            transition: "all 0.2s", color: COLORS.text,
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = COLORS.primaryDark;
                            e.target.style.boxShadow = "0 0 0 3px rgba(33,74,140,0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = COLORS.border;
                            e.target.style.boxShadow = "none";
                        }}
                    />
                    <div style={{
                        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                        color: COLORS.textMuted, pointerEvents: "none",
                    }}>
                        <Icons.Search size={16} />
                    </div>
                </div>

                {/* Nav buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Link
                        to="/favorites"
                        style={{
                            textDecoration: "none", background: "transparent", border: "none",
                            cursor: "pointer", padding: 0, display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 4, transition: "all 0.2s",
                            color: location.pathname === '/favorites' ? COLORS.primary : COLORS.textSecondary,
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <Icons.Heart size={24} filled={location.pathname === '/favorites'} />
                            {favorites.size > 0 && (
                                <span style={{
                                    position: "absolute", top: -4, right: -8,
                                    background: COLORS.primary, color: "#fff",
                                    borderRadius: 10, padding: "2px 5px", fontSize: 11, fontWeight: 700,
                                }}>{favorites.size}</span>
                            )}
                        </div>
                        <span className="header-nav-text" style={{ fontSize: 12, fontWeight: 600 }}>Избранное</span>
                    </Link>

                    <button
                        onClick={() => setCartOpen(true)}
                        style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            padding: 0, display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 4, transition: "all 0.2s",
                            color: COLORS.textSecondary,
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <Icons.Cart size={24} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: "absolute", top: -4, right: -8,
                                    background: COLORS.primary, color: "#fff",
                                    borderRadius: 10, padding: "2px 5px", fontSize: 11, fontWeight: 700,
                                }}>{cartCount}</span>
                            )}
                        </div>
                        <span className="header-nav-text" style={{ fontSize: 12, fontWeight: 600 }}>Корзина</span>
                    </button>

                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => {
                                if (user) {
                                    setUserMenuOpen(!userMenuOpen);
                                } else {
                                    setAccountOpen(true);
                                }
                            }}
                            style={{
                                background: "transparent", border: "none", cursor: "pointer",
                                padding: 0, display: "flex", flexDirection: "column",
                                alignItems: "center", gap: 4, transition: "all 0.2s",
                                color: user ? COLORS.primary : COLORS.textSecondary,
                            }}
                            title={user ? "Профиль" : "Войти"}
                        >
                            <Icons.User size={24} />
                            <span className="header-nav-text" style={{ fontSize: 12, fontWeight: 600 }}>{user ? user.name : "Войти"}</span>
                        </button>

                        {/* Dropdown User Menu */}
                        {userMenuOpen && user && (
                            <>
                                <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 110 }} />
                                <div style={{
                                    position: "absolute", top: "100%", right: 0, marginTop: 16,
                                    width: 200, background: COLORS.surface,
                                    border: `1px solid ${COLORS.border}`, borderRadius: 12,
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)", zIndex: 120, padding: 8,
                                }}>
                                    <div style={{
                                        borderBottom: `1px solid ${COLORS.borderLight}`,
                                        padding: "8px 12px 12px", marginBottom: 8,
                                    }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{user.name}</div>
                                        <div style={{ fontSize: 12, color: COLORS.textMuted }}>{user.email || user.phone || 'Пользователь'}</div>
                                    </div>
                                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                                        style={{
                                            display: "block", width: "100%", padding: "10px 12px", textAlign: "left",
                                            background: "transparent", border: "none", textDecoration: "none",
                                            cursor: "pointer", fontSize: 14, color: COLORS.text, borderRadius: 6,
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        Личный кабинет
                                    </Link>
                                    <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                                        style={{
                                            display: "block", width: "100%", padding: "10px 12px", textAlign: "left",
                                            background: "transparent", border: "none", textDecoration: "none",
                                            cursor: "pointer", fontSize: 14, color: COLORS.text, borderRadius: 6,
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        Мои заказы
                                    </Link>
                                    <div style={{ height: 1, background: COLORS.borderLight, margin: "4px 0" }} />
                                    <button onClick={handleLogout}
                                        style={{
                                            width: "100%", padding: "10px 12px", textAlign: "left",
                                            background: "transparent", border: "none",
                                            cursor: "pointer", fontSize: 14, color: "#E53E3E", borderRadius: 6,
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(229,62,62,0.05)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        Выйти из аккаунта
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
