import type { Meta, StoryObj } from "@storybook/react";

import Presence from "./example";

const meta: Meta<typeof Presence> = {
  title: "Utils/Presence",
  component: Presence,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
  render: (props) => {
    return <Presence {...props} />;
  },
};
