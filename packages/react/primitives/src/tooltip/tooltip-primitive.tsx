import { useState } from "react";

import { autoUpdate, useFloating, useFocus, useHover, useInteractions } from "@floating-ui/react";

export interface TooltipProps {}

const Tooltip = (props: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

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

export default Tooltip;
