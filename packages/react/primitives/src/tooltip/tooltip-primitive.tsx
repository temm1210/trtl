import * as React from "react";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { createContext, mergeRefs, Portal, Slot } from "@rtl/react-utils";

type Status = "mounted" | "unmounted" | "entering" | "exiting";

interface TooltipContextValue {
  status: Status;
  setStatus: (status: Status) => void;
  open: boolean;
  placement: "top" | "right" | "bottom" | "left";
  openTooltip: () => void;
  closeTooltip: () => void;
  anchor: HTMLElement | null;
  setAnchor: (anchor: HTMLElement | null) => void;
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
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : isOpen;

  const handleOpenTooltip = React.useCallback(() => {
    setIsOpen(true);
    onOpenChangeProp?.(true);
  }, [onOpenChangeProp]);

  const handleCloseChange = React.useCallback(() => {
    setIsOpen(false);
    onOpenChangeProp?.(false);
  }, [onOpenChangeProp]);

  return (
    <TooltipPrimitiveProvider
      value={{
        anchor,
        setAnchor,
        status,
        setStatus,
        openTooltip: handleOpenTooltip,
        closeTooltip: handleCloseChange,
        open,
        placement,
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
    ctx.openTooltip();
    ctx.setStatus("entering");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => ctx.setStatus("mounted"));
    });
  };

  const handlePointerLeave = () => {
    ctx.setStatus("unmounted");
    ctx.closeTooltip();
  };

  return (
    <Comp
      ref={ctx.setAnchor}
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
  extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const TooltipContent = ({
  children,
  style,
  ref: refProp,
  asChild = false,
  ...restProps
}: TooltipContentProps) => {
  const Comp = asChild ? Slot : "div";
  const ctx = useTooltipPrimitiveContext();

  const { floatingStyles, refs } = useFloating({
    placement: ctx.placement,
    elements: {
      reference: ctx.anchor,
    },
    transform: false,
    open: ctx.open,
    whileElementsMounted: autoUpdate,
    middleware: [shift({ padding: 5 }), offset(10), flip({ padding: 5 })],
  });

  const attr = {
    "data-status":
      ctx.status === "entering"
        ? "enter"
        : ctx.status === "unmounted"
          ? "exit"
          : undefined,
  };

  return (
    <Comp
      role="tooltip"
      ref={mergeRefs([refProp, refs.setFloating])}
      style={{ ...floatingStyles, ...style }}
      {...restProps}
      {...attr}
    >
      {children}
    </Comp>
  );
};

/************************************ ARROW *************************************/
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
