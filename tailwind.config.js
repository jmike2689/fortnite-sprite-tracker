/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                fortniteDark: '#0b0c10',
                fortniteCard: '#151722',
                fortniteBlue: '#00f0ff',
                fortniteGold: '#ffe600',
                fortniteGummy: '#ff007f',
                fortniteGalaxy: '#8a2be2',
                mythic: '#ffd700',
                legendary: '#f4b41a',
                epic: '#c0392b',
                rare: '#2980b9'
            },
            fontFamily: {
                fortnite: ['Impact', 'Arial Black', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}