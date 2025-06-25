import type { Meta, StoryObj } from "@storybook/react-vite";

import { CheckboxRoot } from "./checkbox-primitive";
import Checkbox from "./example";

const meta: Meta<typeof CheckboxRoot> = {
  title: "Primitives/Checkbox",
  component: CheckboxRoot,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: StoryObj<Story> = {
  render: (args) => <Checkbox {...args} />,
};

export const DefaultChecked: StoryObj<Story> = {
  argTypes: {
    checked: {
      control: false,
    },
  },
  render: () => <Checkbox defaultChecked />,
};
