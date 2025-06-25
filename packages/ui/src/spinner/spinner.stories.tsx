import type { Meta, StoryObj } from "@storybook/react-vite";

import Spinner from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Design Systems/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {};
