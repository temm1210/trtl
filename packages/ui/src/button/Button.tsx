import React from "react";

import { css } from "@emotion/react";
import { Slot } from "@rtl/react-primitives";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  buttonType?: "primary" | "secondary" | "danger";
  rounded?: boolean;
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
  buttonType = "primary",
  rounded = false,
  children,
  ...buttonProps
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  const sizeCss = getSizeCss(size);
  const buttonTypeCss = getButtonTypeCss(buttonType);
  const roundCss = rounded ? roundedCss : null;

  return (
    <Comp
      css={[containerCss, sizeCss, roundCss, buttonTypeCss]}
      type="button"
      {...buttonProps}
    >
      {children}
    </Comp>
  );
};

function getButtonTypeCss(
  buttonType: Exclude<ButtonProps["buttonType"], undefined>,
) {
  return {
    primary: primaryCss,
    secondary: secondaryCss,
    danger: dangerCss,
  }[buttonType];
}

function getSizeCss(size: Exclude<ButtonProps["size"], undefined>) {
  return {
    small: smallSizeCss,
    medium: mediumSizeCss,
    large: largeSizeCss,
  }[size];
}

const containerCss = css`
  display: inline-flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 0 1rem;
  border: 1px solid transparent;
  cursor: pointer;

  transition: all 0.13s ease-in-out;
`;

const smallSizeCss = css`
  height: 2rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
`;

const mediumSizeCss = css`
  height: 2.5rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
`;

const largeSizeCss = css`
  height: 3rem;
  font-size: 1rem;
  border-radius: 0.5rem;
`;

const roundedCss = css`
  border-radius: 6rem;
`;

const primaryCss = css`
  background-color: #171717;
  color: #ffffff;

  :hover {
    opacity: 0.8;
  }
`;
const secondaryCss = css`
  background-color: transparent;
  color: #171717;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);

  :hover {
    background-color: rgba(240, 240, 240, 1);
  }
`;
const dangerCss = css`
  background-color: #dc2626;
  color: #ffffff;

  :hover {
    background-color: #e16160;
  }
`;

export default Button;
