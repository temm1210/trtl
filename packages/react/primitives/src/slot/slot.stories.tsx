import type { Meta, StoryObj } from "@storybook/react";

import Slot from "./slot";

const meta: Meta<typeof Slot> = {
  title: "Primitives/Slot",
  component: Slot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
  render: () => {
    return (
      <Slot
        className="slot classname"
        onClick={() => console.log("slot clicked")}
      >
        <button
          className="child classname"
          onClick={() => console.log("child clicked")}
        >
          Slot
        </button>
      </Slot>
    );
  },
};
