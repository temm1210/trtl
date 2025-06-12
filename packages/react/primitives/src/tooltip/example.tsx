import { ArrowDownFillIcon } from "@rtl/icons";

import style from "./example.module.css";

import { TooltipContentProps, TooltipPrimitive, TooltipRootProps } from "./";

export interface TooltipProps extends TooltipRootProps, TooltipContentProps {}

export const StyledTooltip = ({
  placement,
  offset,
  ...rootProps
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Root {...rootProps}>
      <TooltipPrimitive.Trigger asChild>
        <span className={style.tooltipTrigger}>hover me</span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          offset={offset}
          placement={placement}
          className={style.tooltipContent}
        >
          <div className={style.tooltipText}>it is tooltip</div>
          <TooltipPrimitive.Arrow asChild>
            <ArrowDownFillIcon style={{ width: "10px", height: "10px" }} />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export const HeadlessTooltip = ({
  placement,
  offset,
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
          className="tooltip-content"
        >
          <div className="tooltip-text">it is tooltip</div>
          <TooltipPrimitive.Arrow asChild>
            <ArrowDownFillIcon style={{ width: "10px", height: "10px" }} />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};
