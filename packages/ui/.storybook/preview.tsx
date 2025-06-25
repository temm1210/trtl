import type { Preview } from "@storybook/react-vite";
import React from "react";
import { RtlProvider } from "../src/provider";

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <RtlProvider>
          <Story />
        </RtlProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
