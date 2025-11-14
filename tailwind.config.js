/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 7%)', // Dark gray
        foreground: 'hsl(0 0% 95%)', // Nearly white
        card: 'hsl(0 0% 10%)',
        'card-foreground': 'hsl(0 0% 95%)',
        popover: 'hsl(0 0% 9%)',
        'popover-foreground': 'hsl(0 0% 95%)',
        primary: 'hsl(210 80% 60%)', // Blue accent
        'primary-foreground': 'hsl(0 0% 100%)',
        secondary: 'hsl(0 0% 15%)',
        'secondary-foreground': 'hsl(0 0% 95%)',
        muted: 'hsl(0 0% 15%)',
        'muted-foreground': 'hsl(0 0% 65%)',
        accent: 'hsl(0 0% 15%)',
        'accent-foreground': 'hsl(0 0% 95%)',
        destructive: 'hsl(0 70% 50%)',
        'destructive-foreground': 'hsl(0 0% 95%)',
        border: 'hsl(0 0% 20%)',
        input: 'hsl(0 0% 20%)',
        ring: 'hsl(210 80% 60%)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
};