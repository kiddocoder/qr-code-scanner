/** @type {import('tailwindcss').Config} */
const shadcnConfig = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...shadcnConfig.theme.extend,
      colors: {
        primary: "#1E293B", // Slate-800
        secondary: "#FACC15", // Yellow-400
        accent: "#0EA5E9", // Sky-500
        background: "#F8FAFC", // Slate-50
        foreground: "#020617", // Slate-900
        mainBlue: "#1DA1F2",
        mainOrange: "#F29D35",
        mainWhite: "#FFFFFF",
        darkBlue: "#2C3E50",
        mainBlack: "#1E1E1E",
        ...shadcnConfig.theme.extend.colors,
      },
      fontFamily: {
        onest: ["Onest", "sans-serif"], // Primary font for headings
        nunito: ["Nunito", "sans-serif"], // Secondary font for body text
      },
      animation: {
        scanline: "scanline 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [...shadcnConfig.plugins],
};
