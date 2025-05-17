import * as React from "react";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { createContext, Portal, Slot } from "@rtl/react-utils";

type Status = "mounted" | "unmounted" | "entering" | "exiting";

interface TooltipContextValue {
  status: Status;
  setStatus: (status: Status) => void;
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
  const [status, setStatus] = React.useState<Status>("unmounted");

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
        status,
        setStatus,
        // open: status === "entering" || status === "mounted"
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

  const { setStatus } = ctx;

  const handlePointerEnter = () => {
    ctx.onOpenChange(true);
    setStatus("entering");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => ctx.setStatus("mounted"));
    });
  };

  const handlePointerLeave = () => {
    console.log("leave");
    ctx.setStatus("unmounted");
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
  const ctx = useTooltipPrimitiveContext();

  return ctx.open ? <Portal container={container}>{children}</Portal> : null;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {}

const TooltipContent = ({
  children,
  style,
  ...restProps
}: TooltipContentProps) => {
  const ctx = useTooltipPrimitiveContext();

  const { floatingStyles } = useFloating({
    placement: ctx.placement,
    open: ctx.open,
    whileElementsMounted: autoUpdate,
    middleware: [shift({ padding: 5 }), offset(10), flip({ padding: 5 })],
  });

  const attr = {
    "data-status": ctx.status === "entering" ? "enter" : undefined,
  };

  return (
    <div
      role="tooltip"
      style={{ ...floatingStyles, ...style }}
      {...restProps}
      {...attr}
    >
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
