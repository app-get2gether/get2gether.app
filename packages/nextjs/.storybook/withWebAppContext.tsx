import { WebAppContext } from "../src/contexts";
import mockWebApp from "../src/utils/mockWebApp";
import React from "react";

import type { Decorator } from "@storybook/react";

const withWebAppContext: Decorator = (Story): React.ReactElement => {
  const webApp = mockWebApp();
  return (
    <WebAppContext.Provider value={webApp}>
      <Story />
    </WebAppContext.Provider>
  );
};

export default withWebAppContext;
