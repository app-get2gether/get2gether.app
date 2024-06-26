import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [daisyui],
};
export default config;

// Below is the telegram theme
// NOT USED at this moment
const TelegramTheme = {
  body: {
    "background-color": "var(--tg-theme-bg-color)",
    color: "var(--tg-theme-text-color)",
  },
  ".btn-primary": {
    "background-color": "var(--tg-theme-button-color)",
    color: "var(--tg-theme-button-text-color)",
  },
  header: {
    "background-color": "var(--tg-theme-header-bg-color)",
  },
  ".link": {
    color: "var(--tg-theme-link-color)",
  },
  primary: "var(--tg-theme-bg-color)",
  secondary: "var(--tg-theme-secondary-bg-color)",
  "accent-content": "var(--tg-theme-accent-text-color).",
  "primary-content": "var(--tg-theme-text-color)",
  "base-content": "var(--tg-theme-text-color)",
  colors: {
    hint: "var(--tg-theme-hint-color)",
  },
};

// set Config.themes = telegramThemes for telegram themes
const telegramThemes = [
  {
    light: {
      ...themes["light"],
      ...TelegramTheme,
    },
    dark: {
      ...themes["dark"],
      // Contains telegram theme colors for browser development
      // Needs to create the same for light them
      // minor, because daisyui themes are used a this moment
      // maybe would be required in future
      "--tg-theme-bg-color": "#282828",
      "--tg-theme-text-color": "#ffffff",
      "--tg-theme-hint-color": "#ffffff",
      "--tg-theme-link-color": "#007aff",
      "--tg-theme-button-color": "#007aff",
      "--tg-theme-button-text-color": "#ffffff",
      "--tg-theme-secondary-bg-color": "#1c1c1c",
      "--tg-theme-header-bg-color": "#1c1c1c",
      "--tg-theme-accent-text-color": "#007aff",
      "--tg-theme-section-bg-color": "#282828",
      "--tg-theme-section-header-text-color": "#e5e5e5",
      "--tg-theme-subtitle-text-color": "#ffffff",
      "--tg-theme-destructive-text-color": "#ff453a",
      ...TelegramTheme,
    },
  },
];
