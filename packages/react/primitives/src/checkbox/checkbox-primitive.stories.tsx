import { CheckIcon } from "@rtl/icons";
import type { Meta, StoryObj } from "@storybook/react";

import { CheckboxIndicator, CheckboxRoot } from "./checkbox-primitive";

const CheckboxPrimitive = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};

const meta: Meta<typeof CheckboxPrimitive.Root> = {
  title: "Primitives/CheckboxPrimitive",
  component: CheckboxPrimitive.Root,
  // https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { Indicator: CheckboxPrimitive.Indicator } as any,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: StoryObj<Story> = {
  render: (props) => {
    return (
      <label style={{ display: "inline-flex", alignItems: "center" }}>
        <CheckboxPrimitive.Root {...props}>
          <CheckboxPrimitive.Indicator
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.25rem",
              height: "1.25rem",
              border: "2px solid #e4e4e7",
              borderRadius: "0.25rem",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
            }}
          >
            <CheckIcon />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <span>checkbox</span>
      </label>
    );
  },
};
