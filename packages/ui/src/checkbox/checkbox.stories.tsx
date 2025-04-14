import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Design Systems/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
  render: (args) => {
    return <Checkbox {...args}>Checkbox</Checkbox>;
  },
};
