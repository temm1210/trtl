import { Meta, StoryObj } from "@storybook/react";

import Tooltip from "./example";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: false },
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: StoryObj<Story> = {
  render: (args) => <Tooltip {...args} />,
};

export const DefaultOpen: StoryObj<Story> = {
  render: () => <Tooltip defaultOpen />,
};

export const DelayDuration: StoryObj<Story> = {
  argTypes: {
    delayDuration: {
      control: "number",
    },
  },
  args: {
    delayDuration: 1000,
  },
  render: (props) => <Tooltip {...props} />,
};

export const Disabled: StoryObj<Story> = {
  args: {
    disabled: true,
  },
  render: (props) => <Tooltip {...props} />,
};
