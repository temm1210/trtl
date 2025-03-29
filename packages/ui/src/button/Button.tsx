import React from "react";

import { css } from "@emotion/react";
import { Slot } from "@rtl/react-primitives";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  buttonType?: "primary" | "secondary" | "danger";
  loading?: boolean;
  loadingText?: string;
  /** if set true, renders a child element and passes props to the child. */
  asChild?: boolean;
  spinnerPlacement?: "left" | "right";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button = ({
  asChild = false,
  size = "medium",
  children,
  ...buttonProps
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  const sizeCss = getSizeCss(size);

  return (
    <Comp css={[containerCss, sizeCss]} type="button" {...buttonProps}>
      {children}
    </Comp>
  );
};

function getSizeCss(size: Exclude<ButtonProps["size"], undefined>) {
  return {
    small: smallSizeCss,
    medium: mediumSizeCss,
    large: largeSizeCss,
  }[size];
}

const containerCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #16a349;
  white-space: nowrap;
  padding: 0 1rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  color: #fff;
  cursor: pointer;

  :hover {
    opacity: 0.9;
  }
`;

const smallSizeCss = css`
  height: 2rem;
`;

const mediumSizeCss = css`
  height: 2.5rem;
`;

const largeSizeCss = css`
  height: 3rem;
`;

export default Button;
