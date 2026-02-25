import React, { useEffect } from 'react';
import { COLORS } from '../constants.js';

export default function Toast({ message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose, message]);

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
