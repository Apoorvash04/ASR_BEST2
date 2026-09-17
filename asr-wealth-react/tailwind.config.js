/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/MFFormsDynamic/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        "on-primary": "var(--on-primary)",
        surface: "var(--surface)",
        "surface-container": "var(--surface-container)",
        "on-surface": "var(--on-surface)",
        "text-muted": "var(--text-muted)",
        "border-light": "var(--border-light)",
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
