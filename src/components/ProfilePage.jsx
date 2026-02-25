import React, { useState, useEffect } from 'react';
import { COLORS, BRANCHES } from '../constants.js';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const { setToast } = useUIStore();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [branch, setBranch] = useState(user?.branch || "");

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setBranch(user.branch || "");
        }
    }, [user, navigate]);

    const handleSave = () => {
        updateUser({ ...user, name, email, phone, branch });
        setToast("Личные данные сохранены");
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 0" }}>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: "0 0 24px 0" }}>Личные данные</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                            ФИО <span style={{ color: "#E53E3E" }}>*</span>
                        </label>
                        <input value={name} onChange={e => setName(e.target.value)} style={{
                            width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                            border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none", boxSizing: "border-box", color: COLORS.text
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                            Эл. почта <span style={{ color: "#E53E3E" }}>*</span>
                        </label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={{
                            width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                            border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none", boxSizing: "border-box", color: COLORS.text
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                            Телефон
                        </label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" style={{
                            width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                            border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none", boxSizing: "border-box", color: COLORS.text
                        }} />
                    </div>

                    {user.role === "buyer" && (
                        <div>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                                Подразделение
                            </label>
                            <select
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                style={{
                                    width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                    border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                    background: "#fff", boxSizing: "border-box", color: COLORS.text,
                                }}
                            >
                                <option value="">— Выберите подразделение —</option>
                                <option>Центральный офис (Кисловодск)</option>
                                {BRANCHES.map((b, i) => (
                                    <option key={i}>{b.region}</option>
                                ))}
                            </select>
                            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                                Измените подразделение, если вы хотите прикрепиться к другому филиалу.
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={!name || !email}
                        style={{
                            marginTop: 16, height: 48, borderRadius: 10, border: "none",
                            background: (name && email) ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` : COLORS.border,
                            color: (name && email) ? "#fff" : COLORS.textMuted,
                            fontSize: 16, fontWeight: 700, cursor: (name && email) ? "pointer" : "not-allowed", transition: "opacity 0.2s"
                        }}
                        onMouseEnter={e => { if (name && email) e.currentTarget.style.opacity = "0.9" }}
                        onMouseLeave={e => { if (name && email) e.currentTarget.style.opacity = "1" }}
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    );
}
