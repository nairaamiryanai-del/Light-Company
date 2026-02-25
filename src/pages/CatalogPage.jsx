import { useState, useMemo } from 'react';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../products-data';
import { CATEGORIES, COLORS } from '../constants';
import { Icons } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import ProductTableRow from '../components/ProductTableRow';
import PromoBanner from '../components/PromoBanner';
import PriceListExport from '../components/PriceListExport';

import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useUIStore } from '../store/uiStore';

export default function CatalogPage() {
    const { category, subcategory } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // UI state that's global: search query could come from store or from URL.
    // We already put it in uiStore, but URL `?q=` is also good. We'll use URL search for shareable links,
    // and store search for immediate UI. But wait, Header.jsx uses `navigate(\`/?q=...\`)` OR `searchQuery`. 
    // It's better to just read `useSearchParams().get('q')` OR `searchQuery`.
    const { searchQuery, setSearchQuery } = useUIStore();
    const activeSearch = searchParams.get('q') || searchQuery;

    const { cart, addToCart } = useCartStore();
    const { favorites, toggleFavorite } = useFavoritesStore();
    const { setToast } = useUIStore();

    const [sortBy, setSortBy] = useState("default");
    const [viewMode, setViewMode] = useState("grid");

    const isFavoritesPage = location.pathname === '/favorites';
    const isNewPage = location.pathname === '/new';
    const isSalePage = location.pathname === '/sale';
    const isHomePage = location.pathname === '/' && !activeSearch;

    const handleAddToCart = (product, qty) => {
        addToCart(product, qty);
        setToast(`${product.name} добавлен в корзину`);
    };

    // Filter products
    const filtered = useMemo(() => {
        let result = PRODUCTS;

        if (isFavoritesPage) {
            result = result.filter((p) => favorites.has(p.id));
        } else if (isNewPage) {
            result = result.filter((p) => p.isNew);
        } else if (isSalePage) {
            result = result.filter((p) => p.isSale);
        } else {
            if (category) result = result.filter((p) => p.category === category);
            if (subcategory) result = result.filter((p) => p.sub === subcategory);
        }

        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            result = result.filter(
                (p) => p.name.toLowerCase().includes(q) || p.article.toLowerCase().includes(q)
            );
        }

        if (sortBy !== "default") {
            result = [...result];
            if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
            else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
            else if (sortBy === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [isFavoritesPage, isNewPage, isSalePage, category, subcategory, activeSearch, sortBy, favorites]);

    const randomProducts = useMemo(() => {
        const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 20);
    }, []);

    const newCount = PRODUCTS.filter((p) => p.isNew).length;
    const saleCount = PRODUCTS.filter((p) => p.isSale).length;

    // View: Home Page Recommendations (Dashboard)
    if (isHomePage) {
        return (
            <>
                {(newCount > 0 || saleCount > 0) && (
                    <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                        {newCount > 0 && (
                            <PromoBanner type="new" count={newCount} onClick={() => navigate("/new")} />
                        )}
                        {saleCount > 0 && (
                            <PromoBanner type="sale" count={saleCount} onClick={() => navigate("/sale")} />
                        )}
                    </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <div>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            Рекомендуем
                            <span style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 500, alignSelf: "flex-end", marginBottom: 3 }}>
                                {randomProducts.length} товаров
                            </span>
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                            {randomProducts.map((product) => (
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
                    </div>
                </div>
            </>
        );
    }

    // View: List / Grid for catalog, new, sale, favs, search
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: (isNewPage || isSalePage) ? "#E53E3E" : COLORS.text, margin: 0 }}>
                        {isFavoritesPage ? "Избранное"
                            : isNewPage ? "Новинки"
                                : isSalePage ? "Акции"
                                    : activeSearch ? `Поиск: ${activeSearch}`
                                        : category ? CATEGORIES.find((c) => c.id === category)?.name || "Каталог"
                                            : "Каталог"}
                    </h2>
                    <div style={{ fontSize: 16, color: COLORS.textMuted, marginTop: 4 }}>
                        {filtered.length} {filtered.length === 1 ? "товар" : filtered.length < 5 && filtered.length !== 0 ? "товара" : "товаров"}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Sorting */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
                            background: COLORS.surface, color: COLORS.text, outline: "none",
                            cursor: "pointer", fontSize: 14,
                        }}
                    >
                        <option value="default">Сортировка</option>
                        <option value="price_asc">Сначала дешевые</option>
                        <option value="price_desc">Сначала дорогие</option>
                        <option value="name_asc">По алфавиту</option>
                    </select>

                    {/* View toggle */}
                    <div style={{ display: "flex", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden", height: 36 }}>
                        <button
                            onClick={() => setViewMode("grid")}
                            style={{
                                background: viewMode === "grid" ? COLORS.surfaceHover : "transparent",
                                border: "none", padding: "0 12px", cursor: "pointer",
                                color: viewMode === "grid" ? COLORS.primary : COLORS.textSecondary,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                            title="Плитка"
                        >
                            <Icons.Grid size={18} />
                        </button>
                        <div style={{ width: 1, background: COLORS.border }} />
                        <button
                            onClick={() => setViewMode("table")}
                            style={{
                                background: viewMode === "table" ? COLORS.surfaceHover : "transparent",
                                border: "none", padding: "0 12px", cursor: "pointer",
                                color: viewMode === "table" ? COLORS.primary : COLORS.textSecondary,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                            title="Список"
                        >
                            <Icons.List size={18} />
                        </button>
                    </div>

                    <PriceListExport
                        products={filtered}
                        categoryName={
                            isFavoritesPage ? "Избранное"
                                : isNewPage ? "Новинки"
                                    : isSalePage ? "Акции"
                                        : category ? CATEGORIES.find((c) => c.id === category)?.name || "Каталог"
                                            : "Все товары"
                        }
                    />

                    <button
                        onClick={() => { setSearchQuery(""); navigate("/"); }}
                        style={{
                            background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8,
                            padding: "8px 14px", fontSize: 14, color: COLORS.textSecondary,
                            cursor: "pointer", height: 36, display: "flex", alignItems: "center"
                        }}
                    >
                        На главную
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textMuted }}>
                    <Icons.Search size={48} />
                    <div style={{ marginTop: 12, fontSize: 16 }}>Товары не найдены</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Попробуйте изменить параметры поиска или фильтры</div>
                </div>
            ) : viewMode === "grid" ? (
                <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
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
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filtered.map((product) => (
                        <ProductTableRow
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favorites.has(product.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
