import type { Meta, StoryObj } from "@storybook/react";

import Slot from "./slot";

const meta: Meta<typeof Slot> = {
  title: "Primitive/Slot",
  component: Slot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Slot1: Story = {
  args: {},
  render: () => {
    return (
      <Slot onClick={() => console.log("clicked")}>
        <div onClick={() => console.log("clicked2")}>Slot 1</div>
      </Slot>
    );
  },
};
