import { GuardIcon } from "@rtl/icons";
import type { Meta, StoryObj } from "@storybook/react";

import CheckboxCard from "./checkbox-card";

const meta: Meta<typeof CheckboxCard> = {
  title: "Design Systems/CheckboxCard",
  component: CheckboxCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => {
    return <CheckboxCard {...args} icon={<GuardIcon />} />;
  },
};
