import React from "react";

import { css } from "@emotion/react";
import { Slot, Slottable } from "@rtl/react-utils";

import Spinner, { SpinnerProps } from "@/spinner";

export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
  size?: "small" | "medium" | "large";
  buttonType?: "primary" | "secondary" | "danger";
  rounded?: boolean;
  loading?: boolean;
  loadingPlacement?: "left" | "right";
  /** if set true, renders a child element and passes props to the child. */
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  asChild = false,
  size = "medium",
  buttonType = "primary",
  rounded = false,
  loading = false,
  loadingPlacement = "left",
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  ...buttonProps
}: ButtonProps) => {
  const sizeCss = getSizeCss(size);
  const spinnerSize = getSpinnerSize(size);

  const buttonTypeCss = getButtonTypeCss(buttonType);
  const roundCss = rounded ? roundedCss : null;

  const isDisabled = disabled || loading;

  const Comp = asChild ? Slot : "button";
  const hasSlottable = asChild && React.isValidElement<{ children: React.ReactNode }>(children);

  return (
    <Comp
      css={[containerCss, sizeCss.button, roundCss, buttonTypeCss]}
      type="button"
      disabled={isDisabled}
      data-disabled={isDisabled}
      {...buttonProps}
    >
      {loadingPlacement === "left" && loading ? (
        <Spinner size={spinnerSize} />
      ) : leftIcon ? (
        <IconWrapper css={sizeCss.icon} icon={leftIcon} />
      ) : null}

      {hasSlottable ? (
        <Slottable>
          {React.cloneElement(
            children,
            undefined,
            <ButtonContent css={sizeCss.text}>{children.props.children}</ButtonContent>,
          )}
        </Slottable>
      ) : (
        <ButtonContent css={sizeCss.text}>{children}</ButtonContent>
      )}

      {loadingPlacement === "right" && loading ? (
        <Spinner size={spinnerSize} />
      ) : rightIcon ? (
        <IconWrapper css={sizeCss.icon} icon={rightIcon} />
      ) : null}
    </Comp>
  );
};

interface IconWrapperProps {
  icon: React.ReactNode;
  className?: string;
}

const IconWrapper = ({ icon, className }: IconWrapperProps) => {
  return (
    <span className={className} css={iconContainerCss}>
      {icon}
    </span>
  );
};

interface ButtonContentProps {
  children: React.ReactNode;
  className?: string;
}

const ButtonContent = ({ children, className }: ButtonContentProps) => {
  return (
    <span className={className} css={textCss}>
      {children}
    </span>
  );
};

function getSpinnerSize(
  size: Exclude<ButtonProps["size"], undefined>,
): Exclude<SpinnerProps["size"], undefined> {
  const map = {
    small: "small",
    medium: "small",
    large: "medium",
  } as const;

  return map[size];
}

function getButtonTypeCss(buttonType: Exclude<ButtonProps["buttonType"], undefined>) {
  return {
    primary: primaryCss,
    secondary: secondaryCss,
    danger: dangerCss,
  }[buttonType];
}

function getSizeCss(size: Exclude<ButtonProps["size"], undefined>) {
  return {
    small: {
      button: smallButtonSizeCss,
      text: smallTextSizeCss,
      icon: smallIconCss,
    },
    medium: {
      button: mediumButtonSizeCss,
      text: mediumTextSizeCss,
      icon: mediumIconCss,
    },
    large: {
      button: largeButtonSizeCss,
      text: largeTextSizeCss,
      icon: largeIconCss,
    },
  }[size];
}

const containerCss = css`
  display: inline-flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 0 0.625rem;
  border: 1px solid transparent;
  cursor: pointer;

  width: 100%;
  height: 100%;
  transition: all 0.13s ease-in-out;

  &[data-disabled="true"],
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    user-select: none;
    position: relative;
  }
`;

const smallButtonSizeCss = css`
  height: 2rem;
  border-radius: 0.375rem;
`;

const smallTextSizeCss = css`
  font-size: 0.875rem;
`;

const mediumButtonSizeCss = css`
  height: 2.5rem;
  border-radius: 0.375rem;
`;

const mediumTextSizeCss = css`
  font-size: 0.875rem;
`;

const largeButtonSizeCss = css`
  height: 3rem;
  border-radius: 0.5rem;
`;

const largeTextSizeCss = css`
  font-size: 1rem;
`;

const roundedCss = css`
  border-radius: 6rem;
`;

const primaryCss = css`
  background-color: #171717;
  color: #ffffff;

  &[data-disabled="false"] {
    &:hover {
      opacity: 0.8;
    }
  }
`;
const secondaryCss = css`
  background-color: transparent;
  color: #171717;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);

  &[data-disabled="false"] {
    &:hover {
      background-color: rgba(240, 240, 240, 1);
    }
  }
`;
const dangerCss = css`
  background-color: #dc2626;
  color: #ffffff;

  &[data-disabled="false"] {
    &:hover {
      background-color: #e16160;
    }
  }
`;

const textCss = css`
  display: inline-block;
  padding: 0 0.5rem;
`;

const iconContainerCss = css`
  line-height: 0;
`;

const smallIconCss = css`
  font-size: 1rem;
`;

const mediumIconCss = css`
  font-size: 1.25rem;
`;

const largeIconCss = css`
  font-size: 1.375rem;
`;

export default Button;
