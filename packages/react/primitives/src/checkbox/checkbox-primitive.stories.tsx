import type { Meta, StoryObj } from "@storybook/react";

import { CheckboxRoot } from "./checkbox-primitive";
import CheckboxExample from "./example";

const meta: Meta<typeof CheckboxRoot> = {
  title: "Primitives/CheckboxPrimitive",
  component: CheckboxRoot,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: StoryObj<Story> = {
  render: (args) => <CheckboxExample {...args} />,
};

export const DefaultChecked: StoryObj<Story> = {
  argTypes: {
    checked: {
      control: false,
    },
  },
  render: () => <CheckboxExample defaultChecked />,
};
