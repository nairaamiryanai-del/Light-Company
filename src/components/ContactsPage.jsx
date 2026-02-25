import React from 'react';
import { COLORS, HQ, BRANCHES, DEALERS } from '../constants.js';
import { Icons } from './Icons.jsx';

export default function ContactsPage() {
    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 24 }}>Контакты</h2>

            {/* HQ Section */}
            <div style={{ marginBottom: 32 }}>
                <div style={{
                    padding: "32px", borderRadius: 16, border: `1px solid ${COLORS.border}`,
                    background: "#ffffff", boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                }}>
                    {/* Top Row: Banner Style */}
                    <div style={{
                        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32,
                        borderBottom: `1px solid ${COLORS.borderLight}`, paddingBottom: 28, marginBottom: 24
                    }}>
                        {/* Logo */}
                        <div style={{ flexShrink: 0, paddingRight: 20 }}>
                            <img src="/logo1.png" alt="Light Company" style={{ height: 100, objectFit: "contain" }} />
                        </div>

                        {/* Phones Container */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, flex: 1, justifyContent: "space-between" }}>
                            {/* Block 1: Central Office */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                <div style={{ color: COLORS.primary, fontSize: 16, marginBottom: 4 }}>Центральный офис:</div>
                                <div style={{ fontSize: 24, fontWeight: 400, color: COLORS.text, letterSpacing: "-0.5px" }}>8 (800) 550-60-67</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginTop: 4 }}>Звонок по России бесплатный</div>
                                <div style={{ fontSize: 16, color: COLORS.text, marginTop: 4, fontWeight: 400 }}>+7 (863) 303-34-23</div>
                            </div>

                            {/* Block 2: Commercial */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                <div style={{ color: COLORS.primary, fontSize: 16, marginBottom: 4 }}>Коммерческий отдел:</div>
                                <div style={{ fontSize: 24, fontWeight: 400, color: COLORS.text, letterSpacing: "-0.5px" }}>+7 (928) 97-1111-2</div>
                            </div>

                            {/* Block 3: QA */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                <div style={{ color: COLORS.primary, fontSize: 16, marginBottom: 4 }}>Отдел контроля качества:</div>
                                <div style={{ fontSize: 24, fontWeight: 400, color: COLORS.text, letterSpacing: "-0.5px" }}>+7 (928) 35-1111-2</div>
                            </div>

                            {/* Block 4: Email */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        width: 28, height: 20, borderRadius: 2,
                                        background: COLORS.borderLight,
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <svg width="20" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: 16, color: COLORS.text }}>
                                        <span style={{ fontWeight: 700 }}>Эл. почта:</span>{" "}
                                        <a href={`mailto:${HQ.email}`} style={{ color: COLORS.primary, textDecoration: "none" }}>{HQ.email}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Address and extra info (smaller) */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, fontSize: 12, color: COLORS.textSecondary }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: "1 1 auto" }}>
                            <Icons.MapPin size={16} color={COLORS.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: 600, color: COLORS.text, marginBottom: 4, fontSize: 16 }}>Адрес:</div>
                                <div style={{ marginBottom: 4 }}>{HQ.address}</div>
                                <div style={{ fontSize: 12, color: COLORS.textMuted }}>📮 {HQ.mailAddress}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>🕐</span>
                            <div>
                                <div style={{ fontWeight: 600, color: COLORS.text, marginBottom: 4, fontSize: 16 }}>График работы:</div>
                                <div>{HQ.schedule}</div>
                            </div>
                        </div>
                    </div>

                    {/* HQ Map */}
                    <div style={{ marginTop: 24, borderRadius: 12, overflow: "hidden", height: 250, border: `1px solid ${COLORS.border}` }}>
                        <iframe src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(HQ.address)}`} width="100%" height="100%" frameBorder="0" allowFullScreen={true} title="HQ Map"></iframe>
                    </div>
                </div>
            </div>

            {/* Regional offices */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🗺️</span> Представительства
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
                            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{b.region}</div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6, fontSize: 12, color: COLORS.textSecondary }}>
                                <Icons.MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                                <span>{b.address}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.textSecondary }}>
                                <Icons.Phone size={12} />
                                <span>{b.phone}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                                <span style={{ fontSize: 12 }}>✉️</span>
                                <a href={`mailto:${b.email}`} style={{ color: COLORS.primary, textDecoration: "none", fontSize: 12 }}>{b.email}</a>
                            </div>

                            {/* Branch Map */}
                            <div style={{ marginTop: 14, borderRadius: 8, overflow: "hidden", height: 180, border: `1px solid ${COLORS.border}` }}>
                                <iframe src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(b.address)}`} width="100%" height="100%" frameBorder="0" allowFullScreen={true} title={`Map for ${b.region}`}></iframe>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dealers */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🤝</span> Официальные дилеры
                </h3>
                {DEALERS.map((d, i) => (
                    <div key={i} style={{
                        padding: 18, borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.surface,
                    }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{d.region}</div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 8, fontStyle: "italic" }}>{d.company}</div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.textSecondary }}>
                            <Icons.MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span>Офис: {d.office}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.textSecondary }}>
                            <Icons.MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span>Склад: {d.warehouse}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12, color: COLORS.textSecondary }}>
                            <Icons.Phone size={12} />
                            <span>{d.phone}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12 }}>✉️</span>
                                <a href={`mailto:${d.email}`} style={{ color: COLORS.primary, textDecoration: "none" }}>{d.email}</a>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12 }}>🌐</span>
                                <a href={`http://${d.site}`} target="_blank" rel="noreferrer" style={{ color: COLORS.primary, textDecoration: "none" }}>{d.site}</a>
                            </div>
                        </div>

                        {/* Dealer Map */}
                        <div style={{ marginTop: 14, borderRadius: 8, overflow: "hidden", height: 180, border: `1px solid ${COLORS.border}` }}>
                            <iframe src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(d.office)}`} width="100%" height="100%" frameBorder="0" allowFullScreen={true} title={`Map for ${d.company}`}></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
