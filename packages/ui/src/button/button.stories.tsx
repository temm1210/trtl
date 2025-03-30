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

// function DownloadSolidSvg(props: SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       width="1em"
//       height="1em"
//       {...props}
//     >
//       <path
//         fill="currentColor"
//         fillRule="evenodd"
//         d="M5 16.25a.75.75 0 0 1 .75.75v2c0 .138.112.25.25.25h12a.25.25 0 0 0 .25-.25v-2a.75.75 0 0 1 1.5 0v2A1.75 1.75 0 0 1 18 20.75H6A1.75 1.75 0 0 1 4.25 19v-2a.75.75 0 0 1 .75-.75"
//         clipRule="evenodd"
//       ></path>
//       <path
//         fill="currentColor"
//         d="M10.738 3.75a.99.99 0 0 0-.988.906a37 37 0 0 0-.082 5.27q-.37.02-.74.047l-1.49.109a.76.76 0 0 0-.585 1.167a15.6 15.6 0 0 0 4.032 4.258l.597.429a.89.89 0 0 0 1.036 0l.597-.429a15.6 15.6 0 0 0 4.032-4.258a.76.76 0 0 0-.585-1.167l-1.49-.109a42 42 0 0 0-.74-.047a37 37 0 0 0-.081-5.27a.99.99 0 0 0-.989-.906z"
//       ></path>
//     </svg>
//   );
// }

export const Type: Story = {
  render: () => {
    return (
      <>
        <Button buttonType="primary" size="small">
          Primary(sm)
        </Button>
        <Button buttonType="secondary" size="medium">
          Secondary(m)
        </Button>
        <Button buttonType="danger" size="large">
          Danger(lg)
        </Button>
      </>
    );
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <>
        <Button buttonType="primary" size="medium" loading>
          Primary
        </Button>
        <Button
          buttonType="secondary"
          size="medium"
          loading
          loadingPlacement="right"
        >
          Secondary
        </Button>
        <Button buttonType="danger" size="medium" loading>
          Danger
        </Button>
      </>
    );
  },
};
