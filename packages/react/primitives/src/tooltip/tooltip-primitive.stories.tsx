import { Meta, StoryObj } from "@storybook/react-vite";

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
};

export default meta;
type Story = StoryObj<typeof meta>;

export type TooltipStoryArgs = NonNullable<Story["args"]>;

export const Base: StoryObj<Story> = {
  args: {
    showSafeArea: false,
  },
  render: (args) => <Tooltip {...args} />,
};

export const DefaultOpen: StoryObj<Story> = {
  render: () => <Tooltip defaultOpen />,
};

export const DelayDuration: StoryObj<Story> = {
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

export const Headless: StoryObj<Story> = {
  render: (args) => <Tooltip {...args} />,
};
