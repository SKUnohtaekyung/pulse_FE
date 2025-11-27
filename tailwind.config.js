/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#002B7A',       // Primary Main
                    hover: '#002B7AE6',       // Primary Hover
                    sub: '#002B7ACC',         // Primary Sub (80%)
                    inactive: '#002B7A99',    // Primary Inactive (60%)
                    border: '#002B7A66',      // Primary Border (40%)
                    tint: '#002B7A1A',        // Primary Tint
                    stripe: '#002B7A0D',      // Table Stripe
                },
                point: {
                    DEFAULT: '#FF5A36CC',     // Action Main
                    bg: '#FF5A361A',          // Action Bg
                    hover: '#FF5A3633',       // Action Hover
                },
                bg: {
                    page: '#F5F7FA',          // Bg Page
                    card: '#FFFFFF',          // Bg Card
                },
                text: {
                    main: '#191F28',          // Text Main
                },
                success: '#059669',
                warning: '#D97706',
            },
            fontFamily: {
                pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 43, 122, 0.15)',
            }
        },
    },
    plugins: [],
}
