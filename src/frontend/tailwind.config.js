import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif']
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                success: {
                    DEFAULT: 'oklch(var(--success) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                emerald: {
                    DEFAULT: 'oklch(0.65 0.18 165)',
                    light: 'oklch(0.70 0.20 165)',
                    dark: 'oklch(0.60 0.16 165)',
                    50: 'oklch(0.96 0.04 165)',
                    100: 'oklch(0.92 0.08 165)',
                    200: 'oklch(0.85 0.12 165)',
                    300: 'oklch(0.75 0.16 165)',
                    400: 'oklch(0.65 0.18 165)',
                    500: 'oklch(0.60 0.18 165)',
                    600: 'oklch(0.55 0.16 165)',
                    700: 'oklch(0.48 0.14 165)',
                    800: 'oklch(0.40 0.12 165)',
                    900: 'oklch(0.32 0.10 165)'
                },
                coral: {
                    DEFAULT: 'oklch(0.68 0.16 35)',
                    light: 'oklch(0.72 0.18 35)',
                    dark: 'oklch(0.64 0.14 35)',
                    50: 'oklch(0.96 0.04 35)',
                    100: 'oklch(0.92 0.08 35)',
                    200: 'oklch(0.85 0.12 35)',
                    300: 'oklch(0.75 0.14 35)',
                    400: 'oklch(0.68 0.16 35)',
                    500: 'oklch(0.64 0.16 35)',
                    600: 'oklch(0.58 0.14 35)',
                    700: 'oklch(0.52 0.12 35)',
                    800: 'oklch(0.44 0.10 35)',
                    900: 'oklch(0.36 0.08 35)'
                },
                teal: {
                    DEFAULT: 'oklch(0.58 0.15 195)',
                    light: 'oklch(0.62 0.18 195)',
                    dark: 'oklch(0.54 0.13 195)',
                    50: 'oklch(0.96 0.03 195)',
                    100: 'oklch(0.90 0.06 195)',
                    200: 'oklch(0.82 0.10 195)',
                    300: 'oklch(0.70 0.14 195)',
                    400: 'oklch(0.58 0.15 195)',
                    500: 'oklch(0.54 0.15 195)',
                    600: 'oklch(0.48 0.13 195)',
                    700: 'oklch(0.42 0.11 195)',
                    800: 'oklch(0.35 0.09 195)',
                    900: 'oklch(0.28 0.07 195)'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.04)',
                sm: '0 2px 6px 0 rgba(0,0,0,0.06)',
                md: '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.04)',
                lg: '0 8px 20px 0 rgba(0,0,0,0.10), 0 4px 8px 0 rgba(0,0,0,0.06)',
                xl: '0 16px 36px 0 rgba(0,0,0,0.12), 0 8px 16px 0 rgba(0,0,0,0.08)',
                '2xl': '0 24px 56px 0 rgba(0,0,0,0.14), 0 12px 24px 0 rgba(0,0,0,0.10)',
                'inner-lg': 'inset 0 2px 8px 0 rgba(0,0,0,0.06)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in': {
                    from: { transform: 'translateX(-100%)' },
                    to: { transform: 'translateX(0)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.4s ease-out',
                'slide-in': 'slide-in 0.3s ease-out'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
