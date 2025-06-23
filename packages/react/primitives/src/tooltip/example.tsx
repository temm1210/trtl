import { ArrowDownFillIcon } from "@rtl/icons";

import { TooltipContentProps, TooltipPrimitive, TooltipRootProps } from "./";
import "./example.css";

export interface TooltipProps extends TooltipRootProps, TooltipContentProps {}

const Tooltip = ({
  placement,
  offset,
  showSafeArea,
  ...rootProps
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Root {...rootProps}>
      <TooltipPrimitive.Trigger asChild>
        <span className="tooltip-trigger">hover me</span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          offset={offset}
          placement={placement}
          showSafeArea={showSafeArea}
          className="tooltip-content"
        >
          <div>it is tooltip</div>
          <TooltipPrimitive.Arrow asChild>
            <ArrowDownFillIcon style={{ width: "10px", height: "10px" }} />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export default Tooltip;
