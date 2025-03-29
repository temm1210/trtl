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
  args: { onClick: fn() },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: "flex",
            gap: "1rem",
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
    children: <span>text</span>,
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
  render: (args) => (
    <>
      <Button {...args} size="small">
        Button
      </Button>
      <Button {...args} size="medium">
        Button
      </Button>
      <Button {...args} size="large">
        Button
      </Button>
    </>
  ),
};
