/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard"],
      },

      screens: {
        xs: "390px",
        sm: "640px",
        md: "768px",
        lg: "991px",
        xl: "1280px",
        "2xl": "1440px",
      },

      fontSize: {
        xxlarge36: ["2.25rem", { lineHeight: "3rem" }],
        xxlarge32: ["2rem", { lineHeight: "2.625rem" }],
        xlarge28: ["1.75rem", { lineHeight: "2.375rem" }],
        xlarge26: ["1.625rem", { lineHeight: "2.125rem" }],
        large24: ["1.5rem", { lineHeight: "2rem" }],
        large22: ["1.375rem", { lineHeight: "1.875rem" }],
        medium20: ["1.25rem", { lineHeight: "1.75rem" }],
        medium18: ["1.125rem", { lineHeight: "1.625rem" }],
        small17: ["1.0625rem", { lineHeight: "1.625rem" }],
        small16: ["1rem", { lineHeight: "1.5rem" }],
        xsmall15: ["0.9375rem", { lineHeight: "1.5rem" }],
        xsmall14: ["0.875rem", { lineHeight: "1.25rem" }],
        xxsmall12: ["0.75rem", { lineHeight: "1rem" }],
        xxsmall10: ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        none: "0",
        xxs: "0.25rem",
        xs: "0.375rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        xxl: "1.5rem",
        full: "9999px",
      },
      colors: {
        primary: {
          100: "#FFBB00",
          90: "#FFC116",
          80: "#FFCB42",
          70: "#FED057",
          60: "#FFD872",
          50: "#FFDF89",
          40: "#FFE7A8",
          30: "#FFEFC3",
          20: "#FFF4D7",
          10: "#FFFAEE",
          0: "#FFFFFF",
          DEFAULT: "#FED057",
          dark: "#FAC608",
          light: "#FFEB03",
          xlight: "#FFFF9F",
        },
        secondary: {
          100: "#002752",
          90: "#0C2D51",
          80: "#152E49",
          70: "#26394E",
          60: "#43505F",
          50: "#4E555E",
          40: "#66696D",
          30: "#8D8F91",
          20: "#B0B2B5",
          10: "#DFE0E2",
          0: "#FFFFFF",
          DEFAULT: "#26394E",
          dark: "#0B2D51",
          light: "#4A5E75",
        },
        tertiary: "#8BD94B",
        fourth: "#F0FC61",
        point: "#DAFF7C",
        error: "#F65E39",
        neutral: {
          0: "#27272D",
          10: "#2A2D34",
          20: "#3E4148",
          30: "#4C4F56",
          35: "#5C5F66",
          40: "#7A7D84",
          45: "#989BA2",
          50: "#ACAFB6",
          60: "#BDBDBD",
          70: "#CFCFCF",
          75: "#D8D8D8",
          80: "#E7E7E7",
          85: "#EFEFEF",
          90: "#F3F3F3",
          95: "#F9F9F8",
          100: "#FAFAFA",
        },
      },
    },
    minHeight: {
      "real-screen": "calc(var(--vh) * 100)",
    },
  },
  plugins: [],
}