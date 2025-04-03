import { SVGProps } from "react";

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
        <Button buttonType="primary" size="small" leftIcon={<DownloadSolidSvg />} {...args}>
          Primary
        </Button>
        <Button buttonType="secondary" size="medium" rightIcon={<DownloadSolidSvg />} {...args}>
          Secondary
        </Button>
        <Button
          buttonType="danger"
          size="large"
          leftIcon={<DownloadSolidSvg />}
          rightIcon={<ArrowUpOutline />}
          {...args}
        >
          Danger
        </Button>
      </>
    );
  },
};

export const Slot: Story = {
  render: () => {
    return (
      <Button asChild loading>
        <a href="#">link</a>
      </Button>
    );
  },
};

function ArrowUpOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 5.714a1 1 0 0 1 1 1v12.5a1 1 0 0 1-2 0v-12.5a1 1 0 0 1 1-1"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 4.214a1 1 0 0 1 .707.293l4.5 4.5a1 1 0 0 1-1.414 1.415L12 6.628l-3.793 3.793a1 1 0 0 1-1.414-1.415l4.5-4.5A1 1 0 0 1 12 4.214"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

function DownloadSolidSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 16.25a.75.75 0 0 1 .75.75v2c0 .138.112.25.25.25h12a.25.25 0 0 0 .25-.25v-2a.75.75 0 0 1 1.5 0v2A1.75 1.75 0 0 1 18 20.75H6A1.75 1.75 0 0 1 4.25 19v-2a.75.75 0 0 1 .75-.75"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        d="M10.738 3.75a.99.99 0 0 0-.988.906a37 37 0 0 0-.082 5.27q-.37.02-.74.047l-1.49.109a.76.76 0 0 0-.585 1.167a15.6 15.6 0 0 0 4.032 4.258l.597.429a.89.89 0 0 0 1.036 0l.597-.429a15.6 15.6 0 0 0 4.032-4.258a.76.76 0 0 0-.585-1.167l-1.49-.109a42 42 0 0 0-.74-.047a37 37 0 0 0-.081-5.27a.99.99 0 0 0-.989-.906z"
      ></path>
    </svg>
  );
}
