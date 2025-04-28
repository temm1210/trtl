import { useState } from "react";

import {
  autoUpdate,
  FloatingPortal,
  FloatingPortalProps,
  useFloating,
  UseFloatingReturn,
  useHover,
  useInteractions,
  UseInteractionsReturn,
} from "@floating-ui/react";
import { createContext } from "@rtl/react-utils";

interface TooltipContextValue {
  floatingElement: UseFloatingReturn;
  interaction: {
    getReferenceProps: UseInteractionsReturn["getReferenceProps"];
    getFloatingProps: UseInteractionsReturn["getFloatingProps"];
  };

  isOpen: boolean;
}

const [TooltipPrimitiveProvider, useTooltipPrimitiveContext] = createContext<TooltipContextValue>();

export interface TooltipRootProps {
  children?: React.ReactNode;
}

/************************************ ROOT *************************************/
const TooltipRoot = ({ children }: TooltipRootProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const floatingElement = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(floatingElement.context, { delay: { open: 200, close: 100 } });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <TooltipPrimitiveProvider
      value={{
        interaction: {
          getReferenceProps,
          getFloatingProps,
        },
        floatingElement,
        isOpen,
      }}
    >
      {children}
      {/* <button ref={refs.setReference} {...getReferenceProps}>
        trigger
      </button>

      <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps}>
        it is tooltip
      </div> */}
    </TooltipPrimitiveProvider>
  );
};

/************************************ TRIGGER *************************************/
export interface TooltipTriggerProps extends React.ComponentPropsWithRef<"button"> {}

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

  console.log("isOpen:", isOpen);

  return isOpen ? (
    <FloatingPortal>
      <div ref={refs.setFloating} style={floatingStyles} {...interaction.getFloatingProps()}>
        {children}
      </div>
    </FloatingPortal>
  ) : null;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps extends React.ComponentPropsWithRef<"div"> {}
const TooltipContent = ({ children, ...restProps }: TooltipContentProps) => {
  return <div {...restProps}>{children}</div>;
};

const TooltipArrow = (props: TooltipPortalProps) => {
  return <span {...props} />;
};

export {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
  useTooltipPrimitiveContext,
};
