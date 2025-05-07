import { ReactNode } from "react";

import { createContext, Portal, Slot } from "@rtl/react-utils";

interface TooltipContextValue {}

const [TooltipPrimitiveProvider, useTooltipPrimitiveContext] =
  createContext<TooltipContextValue>();

export interface TooltipRootProps {
  open?: boolean;
  offset?: number;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  children?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

/************************************ ROOT *************************************/
const TooltipRoot = ({ children }: TooltipRootProps) => {
  return (
    <TooltipPrimitiveProvider value={{}}>{children}</TooltipPrimitiveProvider>
  );
};

/************************************ TRIGGER *************************************/
export interface TooltipTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const TooltipTrigger = ({ children, asChild }: TooltipTriggerProps) => {
  const Comp = asChild ? Slot : "button";

  return <Comp>{children}</Comp>;
};

/************************************ PORTAL *************************************/
export interface TooltipPortalProps {
  container?: HTMLElement;
  children: ReactNode;
}

const TooltipPortal = ({
  container = document.body,
  children,
}: TooltipPortalProps) => {
  return <Portal container={container}>{children}</Portal>;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {}

const TooltipContent = ({ children, ...restProps }: TooltipContentProps) => {
  return (
    <div role="tooltip" {...restProps}>
      {children}
    </div>
  );
};

export interface TooltipArrowProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const TooltipArrow = ({
  asChild = false,
  children,
  ...restProps
}: TooltipArrowProps) => {
  const Comp = asChild ? Slot : "div";

  return <Comp {...restProps}>{children}</Comp>;
};

export {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
  useTooltipPrimitiveContext,
};
