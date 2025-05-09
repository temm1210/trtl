import * as React from "react";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { createContext, Portal, Slot } from "@rtl/react-utils";

interface TooltipContextValue {
  open: boolean;
  placement: "top" | "right" | "bottom" | "left";
  onOpenChange: (open: boolean) => void;
}

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
  placement?: TooltipContextValue["placement"];
}

/************************************ ROOT *************************************/
const TooltipRoot = ({
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  placement = "top",
  defaultOpen,
}: TooltipRootProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : isOpen;

  const handleOnOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setIsOpen(isOpen);
      onOpenChangeProp?.(isOpen);
    },
    [onOpenChangeProp],
  );

  return (
    <TooltipPrimitiveProvider
      value={{
        open,
        placement,
        onOpenChange: handleOnOpenChange,
      }}
    >
      {children}
    </TooltipPrimitiveProvider>
  );
};

/************************************ TRIGGER *************************************/
export interface TooltipTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const TooltipTrigger = ({ children, asChild }: TooltipTriggerProps) => {
  const Comp = asChild ? Slot : "button";
  const ctx = useTooltipPrimitiveContext();

  const handlePointerEnter = () => {
    ctx.onOpenChange(true);
  };

  const handlePointerLeave = () => {
    ctx.onOpenChange(false);
  };

  return (
    <Comp
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </Comp>
  );
};

/************************************ PORTAL *************************************/
export interface TooltipPortalProps {
  container?: HTMLElement;
  children: React.ReactNode;
}

const TooltipPortal = ({
  container = document.body,
  children,
}: TooltipPortalProps) => {
  const { open } = useTooltipPrimitiveContext();

  return open ? <Portal container={container}>{children}</Portal> : null;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {}

const TooltipContent = ({
  children,
  style,
  ...restProps
}: TooltipContentProps) => {
  const { open, placement } = useTooltipPrimitiveContext();

  const { floatingStyles } = useFloating({
    placement,
    open,
    whileElementsMounted: autoUpdate,
    middleware: [shift({ padding: 5 }), offset(10), flip({ padding: 5 })],
  });

  return (
    <div role="tooltip" style={{ ...floatingStyles, ...style }} {...restProps}>
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
