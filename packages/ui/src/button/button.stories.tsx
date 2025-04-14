import { ArrowUpOutlineIcon, DownloadSolidIcon } from "@rtl/icons";
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
    buttonType: {
      control: false,
    },
    size: {
      control: false,
    },
    children: {
      control: false,
    },
    asChild: {
      control: false,
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
    disabled: {
      control: "boolean",
    },
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

export const Type: Story = {
  render: (args) => {
    return (
      <>
        <Button buttonType="primary" size="small" {...args}>
          Primary(sm)
        </Button>
        <Button buttonType="secondary" size="medium" {...args}>
          Secondary(m)
        </Button>
        <Button buttonType="danger" size="large" {...args}>
          Danger(lg)
        </Button>
      </>
    );
  },
};

export const Loading: Story = {
  argTypes: {
    loading: {
      control: false,
    },
  },
  render: (args) => {
    return (
      <>
        <Button buttonType="primary" size="medium" loading {...args}>
          Primary
        </Button>
        <Button buttonType="secondary" size="medium" loading loadingPlacement="right" {...args}>
          Secondary
        </Button>
        <Button buttonType="danger" size="medium" loading {...args}>
          Danger
        </Button>
      </>
    );
  },
};

export const WithIcon: Story = {
  render: (args) => {
    return (
      <>
        <Button buttonType="primary" size="small" leftIcon={<DownloadSolidIcon />} {...args}>
          Primary
        </Button>
        <Button buttonType="secondary" size="medium" rightIcon={<DownloadSolidIcon />} {...args}>
          Secondary
        </Button>
        <Button
          buttonType="danger"
          size="large"
          leftIcon={<DownloadSolidIcon />}
          rightIcon={<ArrowUpOutlineIcon />}
          {...args}
        >
          Danger
        </Button>
      </>
    );
  },
};

export const SlotWithDisabled: Story = {
  render: (args) => {
    return (
      <Button asChild {...args}>
        <a
          data-disabled="true"
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          link
        </a>
      </Button>
    );
  },
};
