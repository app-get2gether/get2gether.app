import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import { initialize, mswLoader, getWorker } from "msw-storybook-addon";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import i18n from "../src/i18n";
import withContext from "./withContext";

initialize();

const preview: Preview = {
  globals: {
    locale: "en",
    locales: {
      en: "English",
      ru: "Русский",
    },
  },
  parameters: {
    i18n,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        // nameOfTheme: 'dataAttributeForTheme',
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    withContext,
  ],
  // https://github.com/mswjs/msw-storybook-addon/issues/89#issuecomment-2051972538
  loaders: [mswLoader, () => getWorker().start()],
};

export default preview;
