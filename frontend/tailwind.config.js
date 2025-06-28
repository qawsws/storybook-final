/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gowun: ['Gowun Dodum', 'sans-serif'],
      },
      colors: {
        pastelBlue: '#ADD8E6',
        pastelPink: '#FFB6C1',
        pastelGreen: '#90EE90',
        pastelYellow: '#FFFFE0',
        rainbowRed: '#FF6347',
        rainbowOrange: '#FFA07A',
        rainbowYellow: '#FFD700',
        rainbowGreen: '#7CFC00',
        rainbowBlue: '#4169E1',
        rainbowPurple: '#9370DB',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};
