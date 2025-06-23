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
  dataAttribute: Record<string, any>;
  openTooltip: () => void;
  closeTooltip: () => void;
  exitTooltip: () => void;
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
  const [status, setStatus] = React.useState<Status>(
    isOpen ? "mounted" : "unmounted",
  );

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
    }, delayDuration);
  }, [delayDuration, onOpenChangeProp]);

  const handleCloseTooltip = React.useCallback(() => {
    setIsOpen(false);
    setStatus("unmounted");
    onOpenChangeProp?.(false);
  }, [onOpenChangeProp]);

  const handleExitTooltip = React.useCallback(() => {
    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setStatus("exiting");
    }, delayDuration);
  }, [delayDuration]);

  const dataAttribute = React.useMemo(() => {
    return {
      "data-entering": status === "entering" ? "" : undefined,
      "data-exiting": status === "exiting" ? "" : undefined,
      "data-open":
        status === "entering" || status === "mounted" ? "" : undefined,
      "data-close":
        status === "unmounted" || status === "exiting" ? "" : undefined,
    };
  }, [status]);

  React.useEffect(() => {
    if (status === "entering") {
      const timerId = setTimeout(() => {
        setStatus("mounted");
      });

      return () => clearTimeout(timerId);
    }
  }, [status]);

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
        dataAttribute,
        openTooltip: handleOpenTooltip,
        closeTooltip: handleCloseTooltip,
        exitTooltip: handleExitTooltip,
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

  const { setAnchor, openTooltip, dataAttribute } =
    useTooltipPrimitiveContext();

  return (
    <Comp
      ref={setAnchor}
      onPointerEnter={openTooltip}
      {...dataAttribute}
      {...restProps}
    >
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
export type Placement = "top" | "right" | "bottom" | "left";
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
  /**
   * @internal
   * This prop is for internal debugging purposes only.
   */
  showSafeArea?: boolean;
}

interface Point {
  x: number;
  y: number;
}

const TooltipContent = ({
  children,
  style,
  offset: offsetProp = 10,
  ref: refProp,
  asChild = false,
  placement = "top",
  showSafeArea = false,
  ...restProps
}: TooltipContentProps) => {
  const Comp = asChild ? Slot : "div";

  const { anchor, open, status, dataAttribute, exitTooltip, closeTooltip } =
    useTooltipPrimitiveContext();
  const [safePolygon, setSafePolygon] = React.useState<Point[] | null>(null);
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
    if (!safePolygon) return;

    const handlePointerMove = (ev: PointerEvent) => {
      if (isPointInPolygon({ x: ev.clientX, y: ev.clientY }, safePolygon)) {
        return;
      }
      exitTooltip();
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, [exitTooltip, safePolygon]);

  React.useEffect(() => {
    if (!anchor || !contentElement) return;

    const handlePointerLeave = () => {
      const refRect = anchor.getBoundingClientRect();
      const floRect = contentElement.getBoundingClientRect();
      const safePolygon = calculateSafePolygon(refRect, floRect, placement);

      setSafePolygon(safePolygon);
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
      {showSafeArea && <SafeAreaOverlay points={safePolygon} />}
      <Comp
        role="tooltip"
        ref={mergeRefs([refProp, refs.setFloating])}
        style={{ ...floatingStyles, ...style }}
        {...dataAttribute}
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

const SafeAreaOverlay: React.FC<{
  points: Point[] | null;
}> = ({ points: pointsProp }) => {
  const points = pointsProp?.map(({ x, y }) => `${x},${y}`).join(" ");

  return points ? (
    <svg
      data-testid="safe-area-overlay"
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <polygon
        points={points}
        fill="rgba(255,165,0,0.15)"
        stroke="rgba(255,165,0,0.9)"
        strokeWidth="2"
      />
    </svg>
  ) : null;
};

function isPointInPolygon(targetPoint: Point, polygonPoints: Point[]): boolean {
  let isInside = false;
  const pointCount = polygonPoints.length;

  for (let i = 0; i < polygonPoints.length; i++) {
    const currentPoint = polygonPoints[i];
    const nextPoint = polygonPoints[(i + 1) % pointCount];

    if (!currentPoint || !nextPoint) continue;

    const currentX = currentPoint.x;
    const currentY = currentPoint.y;
    const nextX = nextPoint.x;
    const nextY = nextPoint.y;

    const intersect =
      currentY > targetPoint.y !== nextY > targetPoint.y &&
      /**
       * 해당식은 currentPoint와 prevPoint를 잇는 선분(CP라고 가정)의 기울기를 이용하여 교차지점인 x를 구하는 식
       */
      targetPoint.x <
        ((nextX - currentX) * (targetPoint.y - currentY)) / (nextY - currentY) +
          currentX;

    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function calculateSafePolygon(
  anchor: DOMRect,
  content: DOMRect,
  placement: "top" | "bottom" | "right" | "left",
): { x: number; y: number }[] {
  switch (placement) {
    case "top":
      return [
        { x: content.left, y: content.top },
        { x: content.right, y: content.top },
        { x: content.right, y: anchor.top },
        { x: anchor.right, y: anchor.top },
        // { x: anchor.right, y: anchor.bottom },
        // { x: anchor.left, y: anchor.bottom },
        // { x: anchor.left, y: anchor.top },
        // { x: content.left, y: anchor.top },
      ];

    case "right":
      return [
        { x: anchor.left, y: anchor.top },
        { x: anchor.right, y: anchor.top },
        { x: anchor.right, y: content.top },
        { x: content.right, y: content.top },
        { x: content.right, y: content.bottom },
        { x: anchor.right, y: content.bottom },
        { x: anchor.right, y: anchor.bottom },
        { x: anchor.left, y: anchor.bottom },
      ];

    case "bottom":
      return [
        { x: anchor.left, y: anchor.top },
        { x: anchor.right, y: anchor.top },
        { x: anchor.right, y: anchor.bottom },
        { x: content.right, y: anchor.bottom },
        { x: content.right, y: content.bottom },
        { x: content.left, y: content.bottom },
        { x: content.left, y: anchor.bottom },
        { x: anchor.left, y: anchor.bottom },
      ];

    case "left":
      return [
        { x: content.left, y: content.top },
        { x: anchor.left, y: content.top },
        { x: anchor.left, y: anchor.top },
        { x: anchor.right, y: anchor.top },
        { x: anchor.right, y: anchor.bottom },
        { x: anchor.left, y: anchor.bottom },
        { x: anchor.left, y: content.bottom },
        { x: content.left, y: content.bottom },
      ];

    default:
      return [];
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
