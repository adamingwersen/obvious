import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        sand: {
          50: "#FDF5EE",
          100: "#FCECDD",
          200: "#E6D5C5",
          300: "#CFBEAE",
          400: "#B8A798",
          500: "#A29182",
          600: "#8B7C6D",
          700: "#74665A",
          800: "#5E5246",
          900: "#473D34",
        },
        aquamarine: {
          50: "#F8FFFE",
          100: "#D4FAF5",
          200: "#AFF4EB",
          300: "#99DAD2",
          400: "#83C1B9",
          500: "#6EA7A0",
          600: "#5A8D87",
          700: "#48746F",
          800: "#365B56",
          900: "#25413E",
        },
        nightsky: {
          50: "#E8FAFF",
          100: "#D7F6FF",
          200: "#C7F2FF",
          300: "#B4EAFA",
          400: "#86C6D8",
          500: "#5FA2B6",
          600: "#3F8194",
          700: "#256172",
          800: "#124250",
          900: "#06252E",
        },
        blue: {
          50: "#EFF9FF",
          100: "#CBEDFF",
          200: "#A7E1FF",
          300: "#83D5FF",
          400: "#5CC4F8",
          500: "#40A4D6",
          600: "#2986B4",
          700: "#176992",
          800: "#0A4E70",
          900: "#01344E",
        },
        lilla: {
          50: "#F4F4FF",
          100: "#D2D4FF",
          200: "#B1B4FF",
          300: "#8F94FE",
          400: "#797DE1",
          500: "#6468C4",
          600: "#5155A7",
          700: "#404389",
          800: "#2F326C",
          900: "#21234F",
        },
        red: {
          50: "#FFF1F3",
          100: "#FFC9CF",
          200: "#FA9DA8",
          300: "#EF707F",
          400: "#D25C6A",
          500: "#B54956",
          600: "#983944",
          700: "#7A2A34",
          800: "#5D1D25",
          900: "#401217",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        gradientBackdrop: "url('/backdrop-1-2x.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
