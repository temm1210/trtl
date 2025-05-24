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
  disabled: boolean;
  delayDuration: number;
  openTooltip: () => void;
  closeTooltip: () => void;
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

  const isControlled = openProp !== undefined;
  const open = disabled ? false : isControlled ? openProp : isOpen;

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
        delayDuration,
        disabled,
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
  const timerRef = React.useRef(0);

  const { openTooltip, setStatus, setAnchor, delayDuration } =
    useTooltipPrimitiveContext();

  const handlePointerEnter = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      openTooltip();
      setStatus("entering");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStatus("mounted"));
      });
    }, delayDuration);
  };

  return (
    <Comp ref={setAnchor} onPointerEnter={handlePointerEnter}>
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
  offset?: number;
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
  const { anchor, open, status, setStatus, closeTooltip, delayDuration } =
    useTooltipPrimitiveContext();

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

    const handleCloseTooltip = () => {
      setStatus("unmounted");
      closeTooltip();
    };

    const animations = contentElement.getAnimations();

    if (animations.length > 0) {
      Promise.allSettled(animations.map((anim) => anim.finished)).then(() => {
        handleCloseTooltip();
      });
    } else {
      handleCloseTooltip();
    }
  }, [closeTooltip, contentElement, setStatus, status]);

  React.useLayoutEffect(() => {
    if (status !== "mounted" || !anchor || !contentElement) return;

    let cleanup: (() => void) | undefined;

    const handlePointerLeave = () => {
      const refRect = anchor.getBoundingClientRect();
      const floRect = contentElement.getBoundingClientRect();
      const safeRectangle = getGapFromRectByPlacement(
        refRect,
        floRect,
        placement,
      );

      const handlePointerMove = (ev: PointerEvent) => {
        const { clientX, clientY } = ev;

        if (!safeRectangle) return;

        if (
          anchor.contains(document.elementFromPoint(clientX, clientY)) ||
          contentElement.contains(document.elementFromPoint(clientX, clientY))
        ) {
          return;
        }

        if (isInSide({ x: clientX, y: clientY }, safeRectangle)) {
          return;
        }

        setTimeout(() => {
          setStatus("exiting");
          cleanup?.();
        }, delayDuration);
      };

      document.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      cleanup = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        anchor.removeEventListener("pointerleave", handlePointerLeave);
        contentElement.removeEventListener("pointerleave", handlePointerLeave);
      };
    };

    anchor.addEventListener("pointerleave", handlePointerLeave);
    contentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      anchor.removeEventListener("pointerleave", handlePointerLeave);
      contentElement.removeEventListener("pointerleave", handlePointerLeave);
      cleanup?.();
    };
  }, [anchor, contentElement, delayDuration, placement, setStatus, status]);

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
        data-open={open && status !== "exiting" ? "" : undefined}
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

function getGapFromRectByPlacement(
  anchor: DOMRect,
  content: DOMRect,
  placement: Placement,
) {
  switch (placement) {
    case "bottom":
      return {
        left: content.left,
        right: content.right,
        top: anchor.bottom,
        bottom: content.top,
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
        left: anchor.right,
        right: content.left,
        top: content.top,
        bottom: content.bottom,
      };
    case "left":
      return {
        left: content.right,
        right: anchor.left,
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
