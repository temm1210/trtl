import { Meta, StoryObj } from "@storybook/react";

import { HeadlessTooltip, StyledTooltip } from "./example";

const meta: Meta<typeof StyledTooltip> = {
  title: "Primitives/Tooltip",
  component: StyledTooltip,
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
  render: (args) => <StyledTooltip {...args} />,
};

export const DefaultOpen: StoryObj<Story> = {
  render: () => <StyledTooltip defaultOpen />,
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
  render: (props) => <StyledTooltip {...props} />,
};

export const Disabled: StoryObj<Story> = {
  args: {
    disabled: true,
  },
  render: (props) => <StyledTooltip {...props} />,
};

export const Headless: StoryObj<Story> = {
  render: (args) => <HeadlessTooltip {...args} />,
};
