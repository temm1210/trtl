import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Button from "./button";

const meta: Meta<typeof Button> = {
  title: "Design Systems/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
  argTypes: {
    size: {
      control: false,
    },
    children: {
      control: false,
    },
    asChild: {
      control: false,
    },
  },
  render: (args) => {
    return (
      <div
        style={{
          display: "flex",
          gap: "3rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="small">
          Button(sm)
        </Button>
        <Button {...args} size="medium">
          Button(m)
        </Button>
        <Button {...args} size="large">
          Button(lg)
        </Button>
      </div>
    );
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: "flex",
            gap: "3rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    buttonType: "primary",
  },
};

export const Secondary: Story = {
  args: {
    buttonType: "secondary",
  },
};

export const Danger: Story = {
  args: {
    buttonType: "danger",
  },
};
