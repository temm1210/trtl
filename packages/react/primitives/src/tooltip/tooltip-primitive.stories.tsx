import { Meta, StoryObj } from "@storybook/react";

import Tooltip from "./example";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/CheckboxPrimitive",
  component: Tooltip,
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
  render: (args) => <Tooltip {...args} />,
};
