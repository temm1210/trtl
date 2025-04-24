import type { Meta, StoryObj } from "@storybook/react";

import Tooltip from "./tooltip-primitive";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/TooltipPrimitive",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: StoryObj<Story> = {
  render: (args) => <Tooltip {...args} />,
};
