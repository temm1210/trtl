import * as React from "react";

import {
  arrow,
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
  anchor: HTMLElement | null;
  setAnchor: (anchor: HTMLElement | null) => void;
  open: boolean;
  openTooltip: () => void;
  closeTooltip: () => void;
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
}

/************************************ ROOT *************************************/
const TooltipRoot = ({
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
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
    ctx.setStatus("exiting");
  };

  const handleTransitionEnd = () => {
    if (ctx.status === "exiting") {
      ctx.setStatus("unmounted");
      ctx.closeTooltip();
    }
  };

  return (
    <Comp
      ref={ctx.setAnchor}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTransitionEnd={handleTransitionEnd}
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

/************************************ CONTENT CONTEXT*************************************/

type Placement = "top" | "right" | "bottom" | "left";
interface TooltipContentContextValue {
  arrow: HTMLElement | null;
  setArrow: (arrow: HTMLElement | null) => void;
  arrowX?: number;
  arrowY?: number;
  placement: Placement;
}

const [TooltipPrimitiveContentProvider, useTooltipPrimitiveContentContext] =
  createContext<TooltipContentContextValue>();

/************************************ CONTENT *************************************/
export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
  placement?: Placement;
}

const TooltipContent = ({
  children,
  style,
  ref: refProp,
  asChild = false,
  placement = "top",
  ...restProps
}: TooltipContentProps) => {
  const Comp = asChild ? Slot : "div";
  const ctx = useTooltipPrimitiveContext();

  const [arrowELement, setArrowElement] = React.useState<HTMLElement | null>(
    null,
  );

  const { floatingStyles, refs, middlewareData } = useFloating({
    placement,
    elements: {
      reference: ctx.anchor,
    },
    transform: false,
    open: ctx.open,
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({ padding: 5 }),
      offset(10),
      flip({ padding: 5 }),
      arrow({
        element: arrowELement,
      }),
    ],
  });

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  return (
    <TooltipPrimitiveContentProvider
      value={{
        arrow: arrowELement,
        setArrow: setArrowElement,
        arrowX,
        arrowY,
        placement,
      }}
    >
      <Comp
        role="tooltip"
        ref={mergeRefs([refProp, refs.setFloating])}
        style={{ ...floatingStyles, ...style }}
        data-status={ctx.status}
        {...restProps}
      >
        {children}
      </Comp>
    </TooltipPrimitiveContentProvider>
  );
};

/************************************ ARROW *************************************/
export interface TooltipArrowProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

const TooltipArrow = ({
  asChild = false,
  children,
  style,
  ...restProps
}: TooltipArrowProps) => {
  const Comp = asChild ? Slot : "div";
  const contentCtx = useTooltipPrimitiveContentContext();

  const transformStyle = {
    top: "translateY(100%)",
    right: "translateY(50%) rotate(90deg) translateX(-50%)",
    bottom: `rotate(180deg)`,
    left: "translateY(50%) rotate(-90deg) translateX(50%)",
  };

  const OPPOSITE_SIDE: Record<Placement, Placement> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  return (
    <Comp
      ref={contentCtx.setArrow}
      {...restProps}
      style={{
        position: "absolute",
        left: contentCtx.arrowX,
        top: contentCtx.arrowY,
        transform: transformStyle[contentCtx.placement],
        [OPPOSITE_SIDE[contentCtx.placement]]: 0,
        ...style,
      }}
    >
      {children}
    </Comp>
  );
};

export {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
  useTooltipPrimitiveContext,
};
