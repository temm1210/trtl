import React from "react";

import { css } from "@emotion/react";
import { Slot } from "@rtl/react-primitives";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size: "small" | "medium" | "large";
  loading?: boolean;
  loadingText?: string;
  variant?: "solid" | "outlined" | "filled";
  useChild?: boolean;
  spinnerPlacement?: "left" | "right";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button = ({
  useChild = false,
  children,
  ...buttonProps
}: ButtonProps) => {
  const Comp = useChild ? Slot : "button";

  return (
    <Comp css={containerCss} type="button" {...buttonProps}>
      {children}
    </Comp>
  );
};

const containerCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #16a349;
`;

export default Button;
