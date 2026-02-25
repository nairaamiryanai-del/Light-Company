import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import CatalogPage from "./pages/CatalogPage";
import ContactsPage from "./components/ContactsPage";
import OrdersPage from "./components/OrdersPage";
import ProfilePage from "./components/ProfilePage";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Home / Dashboard */}
                <Route path="/" element={<CatalogPage />} />

                {/* Category catalog */}
                <Route path="/catalog/:category" element={<CatalogPage />} />
                <Route path="/catalog/:category/:subcategory" element={<CatalogPage />} />

                {/* Special pages */}
                <Route path="/new" element={<CatalogPage />} />
                <Route path="/sale" element={<CatalogPage />} />
                <Route path="/favorites" element={<CatalogPage />} />

                {/* Info pages */}
                <Route path="/contacts" element={<ContactsPage />} />

                {/* User pages */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
            </Route>
        </Routes>
    );
}
