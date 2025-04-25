import { useState } from "react";

import { autoUpdate, useFloating, useHover, useInteractions } from "@floating-ui/react";

export interface TooltipRootProps {}

/************************************ ROOT *************************************/
const TooltipRoot = (props: TooltipRootProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { delay: 200 });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <div {...props}>
      <button ref={refs.setReference} {...getReferenceProps}>
        trigger
      </button>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps}>
          it is tooltip
        </div>
      )}
    </div>
  );
};

//  0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
/************************************ TRIGGER *************************************/
export interface TooltipTriggerProps extends React.ComponentPropsWithRef<"button"> {}
const TooltipTrigger = (props: TooltipTriggerProps) => {
  return <button {...props} />;
};

/************************************ PORTAL *************************************/
export interface TooltipPortalProps {
  children: React.ReactNode;
}
const TooltipPortal = (props: TooltipPortalProps) => {
  return <button {...props} />;
};

/************************************ CONTENT *************************************/
export interface TooltipContentProps extends React.ComponentPropsWithRef<"div"> {}
const TooltipContent = ({ children, ...restProps }: TooltipContentProps) => {
  return <div {...restProps}>{children}</div>;
};

const TooltipArrow = (props: TooltipPortalProps) => {
  return <button {...props} />;
};

export { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger };
