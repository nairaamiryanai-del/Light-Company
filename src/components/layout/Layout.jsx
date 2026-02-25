import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import CartDrawer from '../CartDrawer';
import AccountModal from '../AccountModal';
import Toast from '../Toast';

import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { PRODUCTS } from '../../products-data';
import { COLORS } from '../../constants';

export default function Layout() {
    const {
        mobileMenuOpen, setMobileMenuOpen,
        cartOpen, setCartOpen,
        accountOpen, setAccountOpen,
        toast, setToast
    } = useUIStore();

    const { user, login } = useAuthStore();
    const { cart, updateCartQty, setCartQty, removeFromCart, clearCart } = useCartStore();
    const { addOrder } = useOrderStore();

    const handleSubmitOrder = (shippingDate) => {
        if (cart.length === 0) return;

        let text = "Здравствуйте! Хочу сделать заказ:\n\n";
        let totalSum = 0;
        const orderItems = [];

        cart.forEach((item, index) => {
            const p = PRODUCTS.find((pr) => pr.id === item.productId);
            if (p) {
                const itemSum = p.price * item.qty;
                totalSum += itemSum;
                orderItems.push({ productId: item.productId, qty: item.qty });
                text += `${index + 1}. ${p.name} (арт. ${p.article})\n`;
                text += `   ${item.qty} шт. x ${p.price} ₽ = ${itemSum} ₽\n\n`;
            }
        });

        text += `*Итого: ${totalSum.toLocaleString("ru-RU")} ₽*\n`;
        text += `Желаемая дата отгрузки: ${new Date(shippingDate).toLocaleDateString("ru-RU")}\n\n`;
        text += "Жду подтверждения!";

        const newOrder = {
            id: Math.floor(100000 + Math.random() * 900000).toString(),
            date: new Date().toISOString(),
            shippingDate: shippingDate,
            items: orderItems,
            total: totalSum,
            status: "Сформирован",
            buyerName: user?.name || "Неизвестно",
            buyerContact: user?.email || user?.phone || "Неизвестно",
            branch: user?.branch || "",
            managerName: user?.manager || ""
        };

        addOrder(newOrder);

        const tgUser = "manager_light_company";
        const encodedText = encodeURIComponent(text);
        window.open(`https://t.me/${tgUser}?text=${encodedText}`, "_blank");

        clearCart();
        setCartOpen(false);
        setToast("Заказ сформирован!");
    };

    const handleLogin = (userData) => {
        login(userData);
        setAccountOpen(false);
        setToast(`Добро пожаловать, ${userData.name}!`);
    };

    return (
        <div style={{
            fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
            background: COLORS.bg,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}>
            <Header />

            <div style={{
                flex: 1,
                maxWidth: 1400,
                margin: "0 auto",
                width: "100%",
                display: "flex",
            }}>
                {/* Mobile menu overlay */}
                {mobileMenuOpen && (
                    <div
                        style={{
                            position: "fixed", inset: 0,
                            background: "rgba(0,0,0,0.3)", zIndex: 50,
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile sidebar */}
                {mobileMenuOpen && (
                    <div style={{
                        position: "fixed", top: 64, left: 0, bottom: 0,
                        width: 280, background: COLORS.surface, zIndex: 51,
                        overflowY: "auto",
                        boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
                        paddingTop: 12,
                    }}>
                        <Sidebar />
                    </div>
                )}

                {/* Desktop Sidebar */}
                <aside className="desktop-sidebar" style={{
                    width: 260,
                    flexShrink: 0,
                    background: COLORS.surface,
                    borderRight: `1px solid ${COLORS.border}`,
                    overflowY: "auto",
                    paddingTop: 16,
                    paddingBottom: 24,
                    position: "sticky",
                    top: 64,
                    height: "calc(100vh - 64px)",
                }}>
                    <Sidebar />
                </aside>

                {/* Content */}
                <main className="main-content-area" style={{
                    flex: 1,
                    padding: "24px 28px",
                    minWidth: 0,
                }}>
                    <Outlet />
                </main>
            </div>

            {/* Drawers & Modals */}
            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                products={PRODUCTS}
                onUpdateQty={updateCartQty}
                onSetQty={setCartQty}
                onRemove={removeFromCart}
                onSubmitOrder={handleSubmitOrder}
                onClearCart={() => { clearCart(); setToast("Корзина очищена"); }}
            />

            <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} onLogin={handleLogin} />

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}
