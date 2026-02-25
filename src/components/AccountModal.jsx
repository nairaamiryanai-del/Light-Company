import React, { useState, useEffect } from 'react';
import { COLORS, BRANCHES } from '../constants.js';
import { Icons } from './Icons.jsx';

export default function AccountModal({ open, onClose, onLogin }) {
    const [tab, setTab] = useState("login"); // 'login' | 'register' | 'verify' | 'forgot'
    const [role, setRole] = useState("buyer");
    const [contactType, setContactType] = useState("email");
    const [selectedManager, setSelectedManager] = useState('');

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [branch, setBranch] = useState('');
    const [error, setError] = useState('');
    const [warningDialog, setWarningDialog] = useState(null);

    // Verification
    const [pendingUser, setPendingUser] = useState(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyInput, setVerifyInput] = useState('');
    const [verifyError, setVerifyError] = useState('');

    // Forgot password
    const [forgotContact, setForgotContact] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSent, setForgotSent] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Dynamically read managers from localStorage every render (ensures fresh data)
    const getFilteredManagers = () => {
        const all = JSON.parse(localStorage.getItem("light_company_managers") || "[]");
        return branch ? all.filter(m => m.branch === branch) : [];
    };
    const filteredManagers = getFilteredManagers();

    // Reset ALL fields whenever the modal opens or closes
    useEffect(() => {
        setTab("login");
        setRole("buyer");
        setContactType("email");
        setSelectedManager('');
        setEmail('');
        setPassword('');
        setName('');
        setPhoneOrEmail('');
        setBranch('');
        setError('');
        setWarningDialog(null);
        setPendingUser(null);
        setVerifyCode('');
        setVerifyInput('');
        setVerifyError('');
        setForgotContact('');
        setForgotError('');
        setForgotSent(null);
    }, [open]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Read registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem("light_company_registered_users") || "[]");

        if (tab === "login") {
            if (!email || !password) {
                setError('Пожалуйста, заполните все поля.');
                return;
            }
            // Look for matching user by email OR phone
            const found = registeredUsers.find(
                u => (u.contact === email || u.phone === email) && u.password === password
            );
            if (!found) {
                setError('Неверный email/телефон или пароль. Зарегистрируйтесь, если у вас нет аккаунта.');
                return;
            }
            onLogin({ name: found.name, email: found.contact, role: found.role, branch: found.branch, phone: found.phone });

        } else {
            if (!name || (!email && !phoneOrEmail) || !password) {
                setError('Пожалуйста, заполните обязательные поля (ФИО, Пароль и Email или Телефон).');
                return;
            }
            if (!branch) {
                setError('Пожалуйста, выберите подразделение.');
                return;
            }

            const contact = email || phoneOrEmail;

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Validate phone: optional +, then 7-15 digits (international format)
            const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

            const looksLikeEmail = contact.includes('@');
            const looksLikePhone = /^\+?[\d\s\-().\s]+$/.test(contact);

            if (looksLikeEmail && !emailRegex.test(contact)) {
                setError('Введите корректный email-адрес (например: name@mail.ru).');
                return;
            }
            if (!looksLikeEmail && looksLikePhone && !phoneRegex.test(contact)) {
                setError('Введите корректный номер телефона в международном формате (например: +7 900 123-45-67 или +1 555 123 4567).');
                return;
            }
            if (!looksLikeEmail && !looksLikePhone) {
                setError('Введите корректный email или номер телефона.');
                return;
            }

            // Check if already registered
            const alreadyExists = registeredUsers.find(u => u.contact === contact);
            if (alreadyExists) {
                setWarningDialog({
                    message: `Пользователь с ${contact.includes('@') ? 'email' : 'номером'} «${contact}» уже зарегистрирован. Войдите в систему.`,
                    contact
                });
                return;
            }
            // Instead of immediate login — send to verification step
            const code = String(Math.floor(1000 + Math.random() * 9000));
            setVerifyCode(code);
            setPendingUser({ name, contact, password, role, branch, phone: phoneOrEmail, manager: selectedManager });
            setVerifyInput('');
            setVerifyError('');
            setTab('verify');
        }
    };

    const handleVerify = () => {
        if (verifyInput.trim() !== verifyCode) {
            setVerifyError('Неверный код. Попробуйте ещё раз.');
            return;
        }
        // Save user
        const registeredUsers = JSON.parse(localStorage.getItem("light_company_registered_users") || "[]");
        const newUser = { ...pendingUser };
        localStorage.setItem("light_company_registered_users", JSON.stringify([...registeredUsers, newUser]));
        if (pendingUser.role === "employee") {
            const managers = JSON.parse(localStorage.getItem("light_company_managers") || "[]");
            localStorage.setItem("light_company_managers", JSON.stringify([...managers, { name: pendingUser.name, contact: pendingUser.contact, branch: pendingUser.branch }]));
        }
        onLogin({ name: pendingUser.name, email: pendingUser.contact, role: pendingUser.role, branch: pendingUser.branch, phone: pendingUser.phone, manager: pendingUser.manager });
    };

    const handleForgot = () => {
        setForgotError('');
        const registeredUsers = JSON.parse(localStorage.getItem("light_company_registered_users") || "[]");
        const found = registeredUsers.find(u => u.contact === forgotContact || u.phone === forgotContact);
        if (!found) {
            setForgotError('Пользователь с таким email или телефоном не найден.');
            return;
        }
        // Generate temp password
        const tempPassword = Math.random().toString(36).slice(-8);
        // Update password in localStorage
        const updated = registeredUsers.map(u =>
            (u.contact === forgotContact || u.phone === forgotContact) ? { ...u, password: tempPassword } : u
        );
        localStorage.setItem("light_company_registered_users", JSON.stringify(updated));
        setForgotSent({ contact: forgotContact, tempPassword });
    };


    return (
        <>
            {/* Duplicate registration warning dialog */}
            {warningDialog && (
                <>
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000 }} onClick={() => setWarningDialog(null)} />
                    <div style={{
                        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                        width: 380, maxWidth: "90vw", background: "#fff", borderRadius: 16, zIndex: 2001,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 28, textAlign: "center"
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#E53E3E", marginBottom: 10 }}>Аккаунт уже существует</div>
                        <div style={{ fontSize: 14, color: "#555", marginBottom: 24, lineHeight: 1.6 }}>{warningDialog.message}</div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setWarningDialog(null)} style={{
                                flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #ddd",
                                background: "#f7f7f7", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#555"
                            }}>Отмена</button>
                            <button onClick={() => { setWarningDialog(null); setTab("login"); setEmail(warningDialog.contact); setPassword(''); }} style={{
                                flex: 1, padding: "10px", borderRadius: 8, border: "none",
                                background: "linear-gradient(135deg, #0A1931, #1a3a6e)",
                                cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff"
                            }}>Перейти во вход</button>
                        </div>
                    </div>
                </>
            )}
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 999, backdropFilter: "blur(2px)" }} />
            <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 440, maxWidth: "90vw", background: COLORS.surface, borderRadius: 16, zIndex: 1000,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden",
            }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>Личный кабинет</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                        <Icons.X size={24} />
                    </button>
                </div>

                {/* Tabs - only show for login/register */}
                {(tab === "login" || tab === "register") && (
                    <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
                        {[["login", "Вход"], ["register", "Регистрация"]].map(([key, label]) => (
                            <button key={key} onClick={() => { setTab(key); setError(''); setEmail(''); setPassword(''); setName(''); setPhoneOrEmail(''); }} style={{
                                flex: 1, padding: "12px 0", border: "none", background: "transparent",
                                fontSize: 16, fontWeight: tab === key ? 700 : 400, cursor: "pointer",
                                color: tab === key ? COLORS.primary : COLORS.textSecondary,
                                borderBottom: tab === key ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                                transition: "all 0.2s",
                            }}>
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ padding: "24px" }}>

                    {/* === VERIFY SCREEN === */}
                    {tab === "verify" && pendingUser && (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 36, marginBottom: 8 }}>📩</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Подтверждение</div>
                            <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 6 }}>
                                Код отправлен на <strong>{pendingUser.contact}</strong>
                            </div>
                            <div style={{ fontSize: 12, color: COLORS.textMuted, background: COLORS.bg, borderRadius: 8, padding: "8px 12px", marginBottom: 20, border: `1px dashed ${COLORS.border}` }}>
                                🧪 Тестовый режим — ваш код: <strong style={{ fontSize: 16, letterSpacing: 4, color: COLORS.primary }}>{verifyCode}</strong>
                            </div>
                            <input
                                value={verifyInput}
                                onChange={e => { setVerifyInput(e.target.value); setVerifyError(''); }}
                                placeholder="Введите 4-значный код"
                                maxLength={4}
                                style={{
                                    width: "100%", height: 52, borderRadius: 10, border: `2px solid ${verifyError ? "#E53E3E" : COLORS.border}`,
                                    fontSize: 24, textAlign: "center", letterSpacing: 8, outline: "none",
                                    boxSizing: "border-box", marginBottom: 8, color: COLORS.text,
                                }}
                            />
                            {verifyError && <div style={{ fontSize: 12, color: "#E53E3E", marginBottom: 10 }}>{verifyError}</div>}
                            <button onClick={handleVerify} style={{
                                width: "100%", height: 46, border: "none", borderRadius: 10, marginTop: 8,
                                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                                color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                            }}>Подтвердить</button>
                            <button type="button" onClick={() => { setTab("register"); setPassword(''); }} style={{
                                marginTop: 10, background: "none", border: "none", color: COLORS.textSecondary,
                                fontSize: 13, cursor: "pointer", textDecoration: "underline"
                            }}>← Назад к регистрации</button>
                        </div>
                    )}

                    {/* === FORGOT PASSWORD SCREEN === */}
                    {tab === "forgot" && !forgotSent && (
                        <div>
                            <button type="button" onClick={() => { setTab("login"); setForgotContact(''); setForgotError(''); }} style={{
                                background: "none", border: "none", color: COLORS.textSecondary, fontSize: 13,
                                cursor: "pointer", marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4
                            }}>← Назад</button>
                            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>Восстановление пароля</div>
                            <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 }}>
                                Введите email или телефон, указанный при регистрации. Мы отправим временный пароль.
                            </div>
                            {forgotError && <div style={{ padding: "10px", marginBottom: "12px", borderRadius: "8px", background: COLORS.bg, border: `1px solid ${COLORS.danger}`, color: COLORS.danger, fontSize: 12, fontWeight: 600 }}>{forgotError}</div>}
                            <input
                                value={forgotContact}
                                onChange={e => { setForgotContact(e.target.value); setForgotError(''); }}
                                placeholder="Email или телефон"
                                style={{ width: "100%", height: 42, padding: "0 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none", boxSizing: "border-box", color: COLORS.text, marginBottom: 14 }}
                                onFocus={e => e.target.style.borderColor = COLORS.primary}
                                onBlur={e => e.target.style.borderColor = COLORS.border}
                            />
                            <button onClick={handleForgot} style={{
                                width: "100%", height: 46, border: "none", borderRadius: 10,
                                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                                color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                            }}>Отправить временный пароль</button>
                        </div>
                    )}

                    {/* === FORGOT SENT SCREEN === */}
                    {tab === "forgot" && forgotSent && (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Пароль сброшен</div>
                            <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
                                Временный пароль отправлен на <strong>{forgotSent.contact}</strong>
                            </div>
                            <div style={{ background: COLORS.bg, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: "12px 20px", marginBottom: 20 }}>
                                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>🧪 Тестовый режим — временный пароль:</div>
                                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, color: COLORS.primary }}>{forgotSent.tempPassword}</div>
                            </div>
                            <button onClick={() => { setTab("login"); setEmail(forgotSent.contact); setPassword(forgotSent.tempPassword); setForgotSent(null); setForgotContact(''); }} style={{
                                width: "100%", height: 46, border: "none", borderRadius: 10,
                                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                                color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                            }}>Войти с временным паролем</button>
                        </div>
                    )}

                    {/* === LOGIN / REGISTER FORMS === */}
                    {(tab === "login" || tab === "register") && (
                        <form onSubmit={handleSubmit}>
                            {tab === "register" && (
                                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                    {[["employee", "Сотрудник"], ["buyer", "Покупатель"]].map(([key, label]) => (
                                        <button type="button" key={key} onClick={() => setRole(key)} style={{
                                            flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
                                            border: `2px solid ${role === key ? COLORS.primary : COLORS.border}`,
                                            background: role === key ? COLORS.surfaceHover : "transparent",
                                            color: role === key ? COLORS.primary : COLORS.textSecondary,
                                            fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                                        }}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {error && (
                                <div style={{ padding: "10px", marginBottom: "16px", borderRadius: "8px", background: COLORS.bg, border: `1px solid ${COLORS.danger}`, color: COLORS.danger, fontSize: 12, fontWeight: 600 }}>
                                    {error}
                                </div>
                            )}

                            {tab === "register" && (
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                                        ФИО <span style={{ color: "#E53E3E" }}>*</span>
                                    </label>
                                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Обязательное поле" style={{
                                        width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                        border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                        boxSizing: "border-box", transition: "border 0.2s", color: COLORS.text,
                                    }}
                                        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                                        onBlur={(e) => e.target.style.borderColor = COLORS.border}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                                    {tab === "login" ? "Email или телефон" : (contactType === "email" ? "Эл. почта" : "Телефон")} <span style={{ color: "#E53E3E" }}>*</span>
                                </label>

                                {/* Registration contact type toggle */}
                                {tab === "register" && (
                                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                                        {[["email", "Емаил"], ["phone", "Телефон"]].map(([key, label]) => (
                                            <button type="button" key={key}
                                                onClick={() => { setContactType(key); setPhoneOrEmail(''); }}
                                                style={{
                                                    flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700,
                                                    border: `2px solid ${contactType === key ? COLORS.primary : COLORS.border}`,
                                                    background: contactType === key ? COLORS.surfaceHover : "transparent",
                                                    color: contactType === key ? COLORS.primary : COLORS.textSecondary,
                                                    transition: "all 0.2s"
                                                }}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {tab === "login" ? (
                                    <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email или телефон" style={{
                                        width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                        border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                        boxSizing: "border-box", transition: "border 0.2s", color: COLORS.text,
                                    }}
                                        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                                        onBlur={(e) => e.target.style.borderColor = COLORS.border}
                                    />
                                ) : (
                                    <>
                                        <input
                                            value={phoneOrEmail}
                                            onChange={e => setPhoneOrEmail(e.target.value)}
                                            type={contactType === "phone" ? "tel" : "email"}
                                            placeholder={contactType === "email" ? "например: name@mail.ru" : "например: +7 900 123-45-67"}
                                            style={{
                                                width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                                border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                                boxSizing: "border-box", transition: "border 0.2s", color: COLORS.text,
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                                            onBlur={(e) => e.target.style.borderColor = COLORS.border}
                                        />
                                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                                            {contactType === "email"
                                                ? "Формат: name@domain.ru — будет использоваться для входа в систему"
                                                : "Формат: +7 900 123-45-67 — будет использоваться для входа в систему"
                                            }
                                        </div>
                                    </>
                                )}
                            </div>

                            {tab === "register" && role === "buyer" && (
                                <>
                                    <div style={{ marginBottom: 14 }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                                            Выбор подразделения <span style={{ color: "#E53E3E" }}>*</span>
                                        </label>
                                        <select
                                            value={branch}
                                            onChange={(e) => setBranch(e.target.value)}
                                            style={{
                                                width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                                border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                                background: "#fff", boxSizing: "border-box", color: COLORS.text,
                                            }}>
                                            <option value="">— Выберите подразделение —</option>
                                            <option>Центральный офис (Кисловодск)</option>
                                            {BRANCHES.map((b, i) => (
                                                <option key={i}>{b.region}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: 14 }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>Выбор менеджера</label>
                                        <select
                                            value={selectedManager}
                                            onChange={e => setSelectedManager(e.target.value)}
                                            disabled={!branch}
                                            style={{
                                                width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                                border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                                background: !branch ? COLORS.bg : "#fff", boxSizing: "border-box", color: COLORS.text,
                                                opacity: !branch ? 0.5 : 1, cursor: !branch ? "not-allowed" : "pointer"
                                            }}>
                                            <option value="">
                                                {!branch
                                                    ? "— Сначала выберите подразделение —"
                                                    : filteredManagers.length === 0
                                                        ? "— Нет менеджеров в этом подразделении —"
                                                        : "— Выберите менеджера —"
                                                }
                                            </option>
                                            {filteredManagers.map((m, i) => (
                                                <option key={i} value={m.name}>{m.name}</option>
                                            ))}
                                        </select>
                                        {branch && filteredManagers.length === 0 && (
                                            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                                                Сотрудники этого подразделения ещё не зарегистрированы.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {tab === "register" && role === "employee" && (
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                                        Выбор подразделения <span style={{ color: "#E53E3E" }}>*</span>
                                    </label>
                                    <select
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        style={{
                                            width: "100%", height: 42, padding: "0 14px", borderRadius: 8,
                                            border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none",
                                            background: "#fff", boxSizing: "border-box", color: COLORS.text,
                                        }}>
                                        <option value="">— Выберите подразделение —</option>
                                        <option>Центральный офис (Кисловодск)</option>
                                        {BRANCHES.map((b, i) => (
                                            <option key={i}>{b.region}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 4 }}>
                                    Пароль <span style={{ color: "#E53E3E" }}>*</span>
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Обязательное поле" style={{
                                        width: "100%", height: 42, padding: "0 42px 0 14px", borderRadius: 8,
                                        border: `1px solid ${COLORS.border}`, fontSize: 16, outline: "none", boxSizing: "border-box", color: COLORS.text,
                                    }} />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted,
                                        display: "flex", alignItems: "center", padding: 4,
                                    }}>
                                        {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" style={{
                                width: "100%", height: 46, border: "none", borderRadius: 10, marginTop: 8,
                                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                                color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                            }}>
                                {tab === "login" ? "Войти" : "Зарегистрироваться"}
                            </button>

                            {tab === "login" && (
                                <div style={{ textAlign: "center", marginTop: 14 }}>
                                    <button type="button" onClick={() => { setTab("forgot"); setForgotContact(email); setForgotError(''); setForgotSent(null); }} style={{
                                        background: "none", border: "none", color: COLORS.textSecondary,
                                        fontSize: 13, cursor: "pointer", textDecoration: "underline"
                                    }}>Забыли пароль?</button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
