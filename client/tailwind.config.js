/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: { themes: ["light", "dark", "emerald"] },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
