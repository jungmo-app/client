/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      maxWidth: {
        mobile: '500px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'shadow-15': 'rgba(0, 0, 0, 0.15)',
        'shadow-30': 'rgba(0, 0, 0, 0.3)',
        'shadow-50': 'rgba(0, 0, 0, 0.5)',
        'shadow-70': 'rgba(0, 0, 0, 0.7)',
        'white-shadow-15': 'rgba(256, 256, 256, 0.15)',
        'white-shadow-30': 'rgba(256, 256, 256, 0.30)',
        'white-shadow-50': 'rgba(256, 256, 256, 0.50)',
        'white-shadow-70': 'rgba(256, 256, 256, 0.70)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'zoom-in': {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'zoom-out': {
          from: { transform: 'scale(1.2)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-up-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        rotate: {
          '100%': { transform: 'rotate(360deg)' },
        },
        prixClipFix: {
          '0%': { clipPath: 'polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)' },
          '25%': { clipPath: 'polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)' },
          '50%': { clipPath: 'polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)' },
          '75%': { clipPath: 'polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)' },
          '100%': { clipPath: 'polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'zoom-in': 'zoom-in 0.3s ease-out forwards',
        'zoom-out': 'zoom-out 0.3s ease-out forwards',
        'bounce-up-down': 'bounce-up-down 0.8s infinite ease-in-out',
        rotate: 'rotate 1s linear infinite',
        'clip-fix': 'prixClipFix 2s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      addUtilities({
        '.fixed-mobile': {
          '@apply fixed left-1/2 w-full max-w-mobile -translate-x-1/2': {},
        },
        '.fixed-mobile-top': {
          '@apply fixed-mobile top-0': {},
        },
        '.fixed-mobile-bottom': {
          '@apply fixed-mobile bottom-0': {},
        },
        '.fixed-mobile-right': {
          '@apply fixed-mobile right-0': {},
        },
        '.mobile-container': {
          '@apply w-full max-w-mobile mx-auto': {},
        },
        '.fixed-mobile-bottom-right': {
          '@apply fixed-mobile-bottom fixed-mobile-right': {},
        },
        '.fixed-mobile-bottom-right-button': {
          '@apply absolute bottom-6 right-6 z-10': {},
        },
      });
    },
  ],
};
