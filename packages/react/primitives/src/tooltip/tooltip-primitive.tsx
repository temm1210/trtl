import * as React from "react";

import ReactDOM from "react-dom";

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
  anchor: HTMLElement | null;
  setAnchor: (anchor: HTMLElement | null) => void;
  open: boolean;
  openTooltip: () => void;
  closeTooltip: () => void;
  startExitingTooltip: () => void;
}

const [TooltipPrimitiveProvider, useTooltipPrimitiveContext] =
  createContext<TooltipContextValue>();

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  delayDuration?: number;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/************************************ ROOT *************************************/
const TooltipRoot = ({
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  disabled = false,
  delayDuration = 0,
  defaultOpen,
}: TooltipRootProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? false);
  const [status, setStatus] = React.useState<Status>("unmounted");
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const timerRef = React.useRef(0);

  const isControlled = openProp !== undefined;
  const open = disabled ? false : isControlled ? openProp : isOpen;

  const handleOpenTooltip = React.useCallback(() => {
    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setIsOpen(true);
      setStatus("entering");
      onOpenChangeProp?.(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStatus("mounted");
        });
      });
    }, delayDuration);
  }, [delayDuration, onOpenChangeProp]);

  const handleCloseTooltip = React.useCallback(() => {
    setIsOpen(false);
    setStatus("unmounted");
    onOpenChangeProp?.(false);
  }, [onOpenChangeProp]);

  const handleDelayedExiting = React.useCallback(() => {
    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setStatus("exiting");
    }, delayDuration);
  }, [delayDuration]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, []);

  return (
    <TooltipPrimitiveProvider
      value={{
        anchor,
        setAnchor,
        status,
        openTooltip: handleOpenTooltip,
        closeTooltip: handleCloseTooltip,
        startExitingTooltip: handleDelayedExiting,
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

const TooltipTrigger = ({
  children,
  asChild,
  ...restProps
}: TooltipTriggerProps) => {
  const Comp = asChild ? Slot : "button";

  const { setAnchor, openTooltip } = useTooltipPrimitiveContext();

  return (
    <Comp ref={setAnchor} onPointerEnter={openTooltip} {...restProps}>
      {children}
    </Comp>
  );
};

/************************************ PORTAL *************************************/
export interface TooltipPortalProps {
  forceMount?: boolean;
  container?: HTMLElement;
  children: React.ReactNode;
}

const TooltipPortal = ({
  container = document.body,
  forceMount = false,
  children,
}: TooltipPortalProps) => {
  const { open = true } = useTooltipPrimitiveContext();

  return forceMount || open ? (
    <Portal container={container}>{children}</Portal>
  ) : null;
};

/************************************ CONTENT *************************************/
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

export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
  placement?: Placement;
  offset?: number;
}

interface SafeRectangleArea {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const TooltipContent = ({
  children,
  style,
  offset: offsetProp = 10,
  ref: refProp,
  asChild = false,
  placement = "top",
  ...restProps
}: TooltipContentProps) => {
  const Comp = asChild ? Slot : "div";

  const { anchor, open, status, startExitingTooltip, closeTooltip } =
    useTooltipPrimitiveContext();
  const [safeRectangle, setSafeRectangle] =
    React.useState<SafeRectangleArea | null>(null);
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
      offset(offsetProp),
      flip({ padding: 5 }),
      arrow({
        element: arrowELement,
      }),
    ],
  });

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  const contentElement = refs.floating.current;

  React.useEffect(() => {
    if (!contentElement || status !== "exiting") return;

    const animations = contentElement.getAnimations();

    if (animations.length > 0) {
      Promise.allSettled(animations.map((anim) => anim.finished)).then(() => {
        // or forward
        ReactDOM.flushSync(() => {
          closeTooltip();
        });
      });
    } else {
      closeTooltip();
    }
  }, [closeTooltip, contentElement, status]);

  React.useEffect(() => {
    if (!safeRectangle) return;

    const handlePointerMove = (ev: PointerEvent) => {
      if (isInSide({ x: ev.clientX, y: ev.clientY }, safeRectangle)) {
        return;
      }

      startExitingTooltip();
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, [startExitingTooltip, safeRectangle]);

  React.useEffect(() => {
    if (!anchor || !contentElement) return;

    const handlePointerLeave = () => {
      const refRect = anchor.getBoundingClientRect();
      const floRect = contentElement.getBoundingClientRect();
      const safeRectangle = getSafeRectangleByPlacement(
        refRect,
        floRect,
        placement,
      );

      setSafeRectangle(safeRectangle);
    };

    anchor.addEventListener("pointerleave", handlePointerLeave);
    contentElement.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      anchor.removeEventListener("pointerleave", handlePointerLeave);
      contentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [anchor, contentElement, placement]);

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
        data-open={open && status !== "unmounted" ? "" : undefined}
        data-closed={
          status === "unmounted" || status === "exiting" ? "" : undefined
        }
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
    right: "rotate(90deg)",
    bottom: `rotate(180deg)`,
    left: "rotate(-90deg)",
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

/************************************ UTILS *************************************/
function isInSide(
  point: { x: number; y: number },
  rect: { left: number; right: number; top: number; bottom: number },
): boolean {
  return (
    point.x > rect.left &&
    point.x < rect.right &&
    point.y > rect.top &&
    point.y < rect.bottom
  );
}

function getSafeRectangleByPlacement(
  anchor: DOMRect,
  content: DOMRect,
  placement: Placement,
) {
  switch (placement) {
    case "bottom":
      return {
        left: content.left,
        right: content.right,
        top: anchor.top,
        bottom: content.bottom,
      };
    case "top":
      return {
        left: content.left,
        right: content.right,
        top: content.top,
        bottom: anchor.bottom,
      };
    case "right":
      return {
        left: anchor.left,
        right: content.right,
        top: content.top,
        bottom: content.bottom,
      };
    case "left":
      return {
        left: content.left,
        right: anchor.right,
        top: content.top,
        bottom: content.bottom,
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
