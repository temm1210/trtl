import type { Meta } from "@storybook/react";

import { CheckboxIndicator, CheckboxRoot } from "./checkbox-primitive";

const meta: Meta<typeof CheckboxRoot> = {
  title: "Primitives/CheckboxPrimitive",
  component: CheckboxRoot,

  // https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { Indicator: CheckboxIndicator } as any,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
  tags: ["autodocs"],
};

export default meta;

export { default as Base } from "./example";
