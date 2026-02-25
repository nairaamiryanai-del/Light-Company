import React from 'react';
import { COLORS } from '../constants.js';

export default function Badge({ children, color = COLORS.accent, style = {} }) {
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
