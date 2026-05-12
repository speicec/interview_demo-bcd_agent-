/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE",
          300: "#93C5FD", 400: "#60A5FA", 500: "#3B82F6",
          600: "#2563EB", 700: "#1D4ED8", 800: "#1E40AF", 900: "#1E3A8A",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0",
          300: "#CBD5E1", 400: "#94A3B8", 500: "#64748B",
          600: "#475569", 700: "#334155", 800: "#1E293B", 900: "#0F172A",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          50: "#FEF2F2", 100: "#FEE2E2", 500: "#EF4444", 600: "#DC2626",
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        safe: {
          50: "#ECFDF5", 100: "#D1FAE5", 500: "#16A34A", 600: "#059669",
          DEFAULT: "hsl(var(--safe))",
          foreground: "hsl(var(--safe-foreground))",
        },
        warn: {
          50: "#FFFBEB", 100: "#FEF3C7", 500: "#F59E0B", 600: "#D97706",
          DEFAULT: "hsl(var(--warn))",
          foreground: "hsl(var(--warn-foreground))",
        },
        danger: {
          50: "#FEF2F2", 100: "#FEE2E2", 500: "#DC2626", 600: "#B91C1C",
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        info: {
          50: "#EFF6FF", 100: "#DBEAFE", 500: "#2563EB", 600: "#1D4ED8",
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"SimSun"', "serif"],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "blink-cursor": "blink 1s step-end infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "breathe": "breathe 2s ease-in-out 1",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        fadeIn: { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        breathe: { "0%, 100%": { boxShadow: "inset 4px 0 0 hsl(var(--danger))" }, "50%": { boxShadow: "inset 4px 0 0 hsl(var(--danger) / 0.3)" } },
      },
    },
  },
  plugins: [],
};
