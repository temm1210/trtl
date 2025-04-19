import type { Meta, StoryObj } from "@storybook/react";

import { CheckboxIndicator, CheckboxRoot } from "./checkbox-primitive";

const CheckboxPrimitive = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};

const meta: Meta<typeof CheckboxPrimitive.Root> = {
  title: "Primitives/CheckboxPrimitive",
  component: CheckboxPrimitive.Root,
  // https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { Indicator: CheckboxPrimitive.Indicator } as any,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: StoryObj<Story> = {
  render: (props) => {
    return (
      <CheckboxPrimitive.Root {...props}>
        <CheckboxIndicator>indicator</CheckboxIndicator>
      </CheckboxPrimitive.Root>
    );
  },
};
