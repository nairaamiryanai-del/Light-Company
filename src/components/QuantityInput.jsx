import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants.js';

export function QuantityInput({ value, packSize, onChange, style }) {
    const [localVal, setLocalVal] = useState(value);

    // Sync from props
    useEffect(() => {
        setLocalVal(value);
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setLocalVal('');
            return;
        }
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
            setLocalVal(parsed);
        }
    };

    const handleBlur = () => {
        let finalVal = localVal;

        // If empty or less than pack size, reset to minimum pack size
        if (finalVal === '' || finalVal < packSize) {
            finalVal = packSize;
        } else {
            // Check if it's a multiple of packSize
            const remainder = finalVal % packSize;
            if (remainder !== 0) {
                // Round to the nearest multiple of packSize
                finalVal = Math.round(finalVal / packSize) * packSize;
                // Ensure it's at least packSize
                finalVal = Math.max(packSize, finalVal);
            }
        }

        setLocalVal(finalVal);
        if (finalVal !== value) {
            onChange(finalVal);
        }
    };

    // Also handle Enter key to trigger blur logic
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    return (
        <input
            type="text"
            value={localVal}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
                textAlign: "center",
                borderTop: "none",
                borderBottom: "none",
                background: "transparent",
                outline: "none",
                margin: 0,
                color: COLORS.text,
                ...style
            }}
        />
    );
}
