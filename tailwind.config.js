/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                main: "url('src/assets/background.png')",
            },
            fontFamily: {
                sans: ["Lato", "sans-serif"],
            },
        },
    },

    plugins: [],
};
