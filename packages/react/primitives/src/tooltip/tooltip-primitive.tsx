import { useRef, useState } from "react";

import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  FloatingPortalProps,
  offset,
  shift,
  useFloating,
  UseFloatingReturn,
  useHover,
  useInteractions,
  UseInteractionsReturn,
} from "@floating-ui/react";
import { createContext, Slot } from "@rtl/react-utils";

interface TooltipContextValue {
  floatingElement: UseFloatingReturn;
  interaction: {
    getReferenceProps: UseInteractionsReturn["getReferenceProps"];
    getFloatingProps: UseInteractionsReturn["getFloatingProps"];
  };
  arrowRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}

const [TooltipPrimitiveProvider, useTooltipPrimitiveContext] =
  createContext<TooltipContextValue>();

export interface TooltipRootProps {
  children?: React.ReactNode;
}

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

  const hover = useHover(floatingElement.context, {
    delay: { open: 200, close: 100 },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <TooltipPrimitiveProvider
      value={{
        interaction: {
          getReferenceProps,
          getFloatingProps,
        },
        arrowRef,
        floatingElement,
        isOpen,
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

const TooltipPortal = ({ children }: TooltipPortalProps) => {
  const { floatingElement, interaction, isOpen } = useTooltipPrimitiveContext();
  const { refs, floatingStyles } = floatingElement;

  return isOpen ? (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        {...interaction.getFloatingProps()}
      >
        {children}
      </div>
    </FloatingPortal>
  ) : null;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps
  extends React.ComponentPropsWithRef<"div"> {}
const TooltipContent = ({ children, ...restProps }: TooltipContentProps) => {
  return <div {...restProps}>{children}</div>;
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
  const { middlewareData } = floatingElement;

  return (
    <Comp
      ref={arrowRef}
      {...restProps}
      style={{
        position: "absolute",
        left: middlewareData.arrow?.x,
        top: middlewareData.arrow?.y,
        height: `${DEFAULT_ARROW_HEIGHT}px`,
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
