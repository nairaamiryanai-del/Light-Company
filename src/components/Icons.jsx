import React from 'react';

// Icons as SVG components
export const Icons = {
    Search: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
    ),
    Heart: ({ size = 20, filled = false }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    ),
    Cart: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    ),
    User: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    ),
    ChevronDown: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),
    ChevronRight: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    ),
    Plus: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
    ),
    Minus: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
        </svg>
    ),
    X: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    ),
    Phone: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
    ),
    MapPin: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Package: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
        </svg>
    ),
    Clock: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Star: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Trash: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    ),
    Menu: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    ),
    Send: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" /><path d="m22 2-11 11" />
        </svg>
    ),
    // Category Icons - Detailed Illustrative Style
    Shoe: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 13.5c-1-1.5-2.5-2.5-4.5-2.5h-1c-.5-3-2.5-5-5-5C8.5 6 7 7 6 8c-1.5-.5-3 0-4 1-1.5 1.5-1 4 .5 5-1 1-1 3 0 4.5 1 1.5 3.5 2 6 2 3 0 5-1.5 6-2 3.5 1 6-1 6-3 0-1-.5-1.5 0-2zm-12.5 5c-2 0-3.5-.5-4-1.5 1.5 1.5 4 1.5 6 1 .5.5 1 1.5-2 1.5zm1-5a1 1 0 110-2 1 1 0 010 2zm3 0a1 1 0 110-2 1 1 0 010 2zm-1.5-2.5a1 1 0 110-2 1 1 0 010 2zm-3 0a1 1 0 110-2 1 1 0 010 2z" />
            <path d="M21.5 8.5c-2-1.5-5-2-7-1.5-2 3-5 5-7.5 4-1.5-.5-2.5-1.5-2.5-1.5s-1 1-.5 2.5c.5 1.5 2 2.5 4 2.5 3 0 6.5-2 9-5 1.5-1.5 3-1.5 4.5-1z" opacity="0.8" />
        </svg>
    ),
    Doc: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 14l8-4 8 4-8 4-8-4z" fill={color} />
            <path d="M4 17l8 4 8-4" />
            <path d="M4 11l8-4 8 4" opacity="0.5" />
            <path d="M12 3l8 4-8 4-8-4 8-4z" fill={color} opacity="0.3" />
            <path d="M12 11l-3 1.5 3 3 5-2.5-5-2z" fill="#fff" />
        </svg>
    ),
    Mat: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8c0-1.1.9-2 2-2h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm16 6V8H5v6h14z" />
            <circle cx="7" cy="10" r="1" fill="#fff" />
            <circle cx="10" cy="10" r="1" fill="#fff" />
            <circle cx="13" cy="10" r="1" fill="#fff" />
            <circle cx="16" cy="10" r="1" fill="#fff" />
            <circle cx="7" cy="13" r="1" fill="#fff" />
            <circle cx="10" cy="13" r="1" fill="#fff" />
            <circle cx="13" cy="13" r="1" fill="#fff" />
            <circle cx="16" cy="13" r="1" fill="#fff" />
        </svg>
    ),
    Shield: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="10" r="4" fill={color} />
            <circle cx="8" cy="18" r="4" fill={color} />
            <circle cx="14" cy="14" r="4" fill={color} />
            <path d="M14 10l8 4-6 6-10-5" fill={color} opacity="0.7" />
            <path d="M16 11l4 2-5 5" stroke="#fff" strokeWidth="1" />
            <path d="M14 13l4 2-3 3" stroke="#fff" strokeWidth="1" />
        </svg>
    ),
    Car: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8.1C8 6.4 9.4 5 11.1 5h1.8C14.6 5 16 6.4 16 8.1v3.8c0 1.2.6 2.3 1.6 3l1.1.8c1.3.9 1.6 2.7.7 4C18.6 20.6 17.4 21 16 21H8c-1.4 0-2.6-.4-3.4-1.3-.9-1.3-.6-3.1.7-4l1.1-.8c1-.7 1.6-1.8 1.6-3V8.1z" />
            <rect x="10" y="2" width="4" height="3" rx="1.5" />
            <path d="M9 9l6 4M15 9l-6 4M9 13l6 4M15 13l-6 4M10 17l4 2M14 17l-4 2" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            <path d="M7 16c2 1 6 1 10 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    Rope: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15h6a3 3 0 003-3 3 3 0 00-3-3h-4" />
            <rect x="4" y="10" width="8" height="6" rx="1" fill={color} />
            <circle cx="16" cy="12" r="2" fill={color} />
            <circle cx="16" cy="12" r="1" fill="#fff" />
            <path d="M6 16l-3 4h4l1-4" fill={color} />
        </svg>
    ),
    Thread: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="7" rx="6" ry="3" fill={color} />
            <ellipse cx="12" cy="7" rx="4" ry="1.5" fill="#fff" />
            <path d="M6 7v8c0 1.6 2.7 3 6 3s6-1.4 6-3V7" fill={color} />
            <path d="M6 14c0 1.6 2.7 3 6 3s6-1.4 6-3" fill="none" stroke="#fff" strokeWidth="1" />
            <path d="M6 10c0 1.6 2.7 3 6 3s6-1.4 6-3" fill="none" stroke="#fff" strokeWidth="1" />
            <path d="M3 16h6c0 1.6-2.7 3-6 3H2s-1-1 1-3z" fill={color} />
        </svg>
    ),
    Eye: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    EyeOff: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
    ),
    Grid: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    List: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    ),
    Download: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    Truck: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
        </svg>
    ),
    Bell: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    ),
    Ruler: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
        </svg>
    ),
};
