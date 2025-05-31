import type { Meta, StoryObj } from "@storybook/react";

import Tooltip from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Design Systems/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Tooltip {...args} content="it is tooltip">
      hover me
    </Tooltip>
  ),
};
