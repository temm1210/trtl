import { useRef, useState } from "react";

import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  FloatingPortalProps,
  offset,
  shift,
  useClick,
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
  children?: React.ReactNode;
}

const DEFAULT_ARROW_WIDTH = 20;
const DEFAULT_ARROW_HEIGHT = 15;

/************************************ ROOT *************************************/
const TooltipRoot = ({ children }: TooltipRootProps) => {
  const arrowRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const floatingElement = useFloating({
    placement: "top",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({ padding: 5 }),
      offset(DEFAULT_ARROW_HEIGHT),
      flip({ padding: 5 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const click = useClick(floatingElement.context);
  const hover = useHover(floatingElement.context, {
    delay: { open: 200, close: 100 },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
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
  extends React.ComponentPropsWithRef<"button"> {}

const TooltipTrigger = ({ children, ...restProps }: TooltipTriggerProps) => {
  const { floatingElement, interaction } = useTooltipPrimitiveContext();
  const { refs } = floatingElement;

  return (
    <button
      type="button"
      ref={refs.setReference}
      {...restProps}
      {...interaction.getReferenceProps()}
    >
      {children}
    </button>
  );
};

/************************************ PORTAL *************************************/
export interface TooltipPortalProps extends FloatingPortalProps {}

const TooltipPortal = ({ children, ...restProps }: TooltipPortalProps) => {
  const { isOpen } = useTooltipPrimitiveContext();

  return isOpen ? (
    <FloatingPortal {...restProps}>{children}</FloatingPortal>
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
