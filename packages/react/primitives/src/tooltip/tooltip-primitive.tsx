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
  const { openTooltip, setStatus, closeTooltip, setAnchor } =
    useTooltipPrimitiveContext();

  const handlePointerEnter = () => {
    openTooltip();
    setStatus("entering");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setStatus("mounted"));
    });
  };

  const handleTransitionEnd = () => {
    if (status === "exiting") {
      setStatus("unmounted");
      closeTooltip();
    }
  };

  return (
    <Comp
      ref={setAnchor}
      onPointerEnter={handlePointerEnter}
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
  const { open } = useTooltipPrimitiveContext();

  return open ? <Portal container={container}>{children}</Portal> : null;
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
  const { anchor, open, status, setStatus } = useTooltipPrimitiveContext();

  const [arrowELement, setArrowElement] = React.useState<HTMLElement | null>(
    null,
  );

  const { floatingStyles, refs, middlewareData } = useFloating({
    placement,
    elements: {
      reference: anchor,
    },
    transform: false,
    open,
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

  const content = refs.floating.current;

  React.useEffect(() => {
    if (status !== "mounted") return;

    const handlePointerMove = (ev: PointerEvent) => {
      if (!anchor || !content) {
        setStatus("exiting");
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      const gapRect = getGapFromRectByPlacement(
        anchorRect,
        contentRect,
        placement,
      );

      if (!gapRect) {
        setStatus("exiting");
        return;
      }

      const pointerX = ev.clientX;
      const pointerY = ev.clientY;

      const isPointerRangeGap =
        pointerX >= gapRect.minX &&
        pointerX <= gapRect.maxX &&
        pointerY >= gapRect.minY &&
        pointerY <= gapRect.maxY;

      const isPointerInRangeElement = [content, anchor].some((element) =>
        element.contains(document.elementFromPoint(pointerX, pointerY)),
      );

      if (!isPointerInRangeElement && !isPointerRangeGap) {
        setStatus("exiting");
      }
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, [anchor, content, placement, setStatus, status]);

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
        data-status={status}
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
  const { arrowX, arrowY, setArrow, placement } =
    useTooltipPrimitiveContentContext();

  const TRANSFORM: Record<Placement, string> = {
    top: "translateY(100%)",
    right: "translateY(50%) rotate(90deg) translateX(-50%)",
    bottom: `rotate(180deg)`,
    left: "translateY(50%) rotate(-90deg) translateX(50%)",
  };

  const OPPOSITE_PLACEMENT: Record<Placement, Placement> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  const TRANSFORM_ORIGIN: Record<Placement, string> = {
    top: "",
    right: "0 0",
    bottom: "center 0",
    left: "100% 0",
  };

  return (
    <Comp
      ref={setArrow}
      {...restProps}
      style={{
        position: "absolute",
        left: arrowX,
        top: arrowY,
        transform: TRANSFORM[placement],
        transformOrigin: TRANSFORM_ORIGIN[placement],
        [OPPOSITE_PLACEMENT[placement]]: 0,
        ...style,
      }}
    >
      {children}
    </Comp>
  );
};

function getGapFromRectByPlacement(
  anchor: DOMRect,
  content: DOMRect,
  placement: Placement,
) {
  switch (placement) {
    case "bottom":
      return {
        minX: content.left,
        maxX: content.right,
        minY: anchor.bottom,
        maxY: content.top,
      };
    case "top":
      return {
        minX: content.left,
        maxX: content.right,
        minY: content.bottom,
        maxY: anchor.top,
      };
    case "right":
      return {
        minX: anchor.right,
        maxX: content.left,
        minY: content.top,
        maxY: content.bottom,
      };
    case "left":
      return {
        minX: content.right,
        maxX: anchor.left,
        minY: content.top,
        maxY: content.bottom,
      };
    default:
      return null;
  }
}

export {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
  useTooltipPrimitiveContext,
};
