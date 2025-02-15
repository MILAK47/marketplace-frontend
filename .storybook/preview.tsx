import "tailwindcss/tailwind.css";
import "src/assets/css/index.css";
import "remixicon/fonts/remixicon.css";
import "src/assets/fonts/Alfreda/stylesheet.css";
import "src/assets/fonts/GTWalsheimPro/stylesheet.css";
import "src/assets/fonts/Belwe/stylesheet.css";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import withContextProviders from "./decorators/withProviders";

const USER_ID = "e2ee731a-2697-4306-bf4b-c807f6fda0d7";

const customViewports = {
  desktop: {
    name: "Desktop",
    styles: {
      width: "1440px",
      height: "900px",
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "black",
    values: [
      {
        name: "black",
        value: "#000000",
      },
      {
        name: "space",
        value: "url(https://cdn.jsdelivr.net/gh/onlydustxyz/marketplace@2.0/frontend/src/assets/img/bg-space.png)",
      },
    ],
  },
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
    defaultViewport: "desktop",
  },
};

export const decorators = [withContextProviders({ userId: USER_ID })];
