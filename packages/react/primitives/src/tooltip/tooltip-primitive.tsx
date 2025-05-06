import { useRef, useState } from "react";

import {
  arrow,
  autoUpdate,
  Delay,
  flip,
  FloatingPortal,
  FloatingPortalProps,
  offset,
  shift,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useHover,
  useInteractions,
  UseInteractionsReturn,
  useTransitionStyles,
} from "@floating-ui/react";
import { createContext, Slot } from "@rtl/react-utils";

interface TooltipContextValue {
  floatingElement: UseFloatingReturn;
  interaction: {
    getReferenceProps: UseInteractionsReturn["getReferenceProps"];
    getFloatingProps: UseInteractionsReturn["getFloatingProps"];
  };
  contentStyles: React.CSSProperties;
  arrowRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}

const [TooltipPrimitiveProvider, useTooltipPrimitiveContext] =
  createContext<TooltipContextValue>();

export interface TooltipRootProps {
  open?: boolean;
  offset?: number;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: Delay;
  children?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const DEFAULT_ARROW_WIDTH = 20;
const DEFAULT_ARROW_HEIGHT = 15;

/************************************ ROOT *************************************/
const TooltipRoot = ({
  open: openProp,
  side = "top",
  offset: offsetProp = 0,
  defaultOpen,
  disabled = false,
  onOpenChange,
  delayDuration = 300,
  children,
}: TooltipRootProps) => {
  const arrowRef = useRef(null);
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : isOpen;

  const floatingElement = useFloating({
    placement: side,
    open,
    onOpenChange: (open) => {
      if (!isControlled) {
        setIsOpen(open);
      }
      onOpenChange?.(open);
    },
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({ padding: 5 }),
      offset(DEFAULT_ARROW_HEIGHT + offsetProp),
      flip({ padding: 5 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const dismiss = useDismiss(floatingElement.context);
  const hover = useHover(floatingElement.context, {
    delay: delayDuration,
    enabled: !disabled,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
  ]);

  const arrowX = floatingElement.middlewareData.arrow?.x ?? 0;
  const arrowY = floatingElement.middlewareData.arrow?.y ?? 0;
  const transformX = arrowX + DEFAULT_ARROW_WIDTH / 2;
  const transformY = arrowY + DEFAULT_ARROW_HEIGHT;

  const { isMounted, styles } = useTransitionStyles(floatingElement.context, {
    initial: {
      transform: "scale(0)",
    },
    common: ({ side }) => ({
      transformOrigin: {
        top: `${transformX}px calc(100% + ${DEFAULT_ARROW_HEIGHT}px)`,
        bottom: `${transformX}px ${-DEFAULT_ARROW_HEIGHT}px`,
        left: `calc(100% + ${DEFAULT_ARROW_HEIGHT}px) ${transformY}px`,
        right: `${-DEFAULT_ARROW_HEIGHT}px ${transformY}px`,
      }[side],
    }),
  });

  return (
    <TooltipPrimitiveProvider
      value={{
        interaction: {
          getReferenceProps,
          getFloatingProps,
        },
        contentStyles: styles,
        arrowRef,
        floatingElement,
        isOpen: isMounted,
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
  const { floatingElement, interaction } = useTooltipPrimitiveContext();
  const { refs } = floatingElement;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={refs.setReference}
      {...restProps}
      {...interaction.getReferenceProps()}
    >
      {children}
    </Comp>
  );
};

/************************************ PORTAL *************************************/
export interface TooltipPortalProps extends FloatingPortalProps {
  container?: HTMLElement;
}

const TooltipPortal = ({
  children,
  container = document.body,
  ...restProps
}: TooltipPortalProps) => {
  const { isOpen } = useTooltipPrimitiveContext();

  return isOpen ? (
    <FloatingPortal root={container} {...restProps}>
      {children}
    </FloatingPortal>
  ) : null;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {}

const TooltipContent = ({
  children,
  style,
  ...restProps
}: TooltipContentProps) => {
  const { contentStyles, floatingElement, interaction } =
    useTooltipPrimitiveContext();

  const { refs, floatingStyles } = floatingElement;

  return (
    <div
      role="tooltip"
      ref={refs.setFloating}
      style={floatingStyles}
      {...interaction.getFloatingProps()}
    >
      <div {...restProps} style={{ ...contentStyles, ...style }}>
        {children}
      </div>
    </div>
  );
};

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
  const { arrowRef, floatingElement } = useTooltipPrimitiveContext();
  const { middlewareData, placement } = floatingElement;

  const arrowX = middlewareData.arrow?.x ?? 0;
  const arrowY = middlewareData.arrow?.y ?? 0;

  const rotate = placement.startsWith("top")
    ? "0"
    : placement.startsWith("bottom")
      ? "-180deg"
      : placement.startsWith("left")
        ? "-90deg"
        : "90deg";

  return (
    <Comp
      ref={arrowRef}
      {...restProps}
      style={{
        position: "absolute",
        height: `${DEFAULT_ARROW_HEIGHT}px`,
        width: `${DEFAULT_ARROW_WIDTH}px`,
        transform: `rotate(${rotate})`,
        ...(placement.startsWith("top") && {
          left: arrowX,
          bottom: -DEFAULT_ARROW_HEIGHT,
        }),
        ...(placement.startsWith("bottom") && {
          left: arrowX,
          top: -DEFAULT_ARROW_HEIGHT,
        }),
        ...(placement.startsWith("left") && {
          top: arrowY,
          right: -DEFAULT_ARROW_HEIGHT,
        }),
        ...(placement.startsWith("right") && {
          top: arrowY,
          left: -DEFAULT_ARROW_HEIGHT,
        }),
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
