import React from "react";

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

// #16A349
export const Button = ({
  useChild = false,
  children,
  ...buttonProps
}: ButtonProps) => {
  const Comp = useChild ? Slot : "button";

  return (
    <Comp type="button" {...buttonProps}>
      {children}
    </Comp>
  );
};
