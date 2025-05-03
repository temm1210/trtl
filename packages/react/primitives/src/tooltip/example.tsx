import { ArrowDownFillIcon } from "@rtl/icons";

import { TooltipPrimitive, TooltipRootProps } from "./";

import "./example.css";

const Example = (props: TooltipRootProps) => {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger>
        <span className="tooltip-trigger">hover me</span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className="tooltip-content">
          <div className="tooltip-text">it is tooltip</div>
          <TooltipPrimitive.Arrow asChild>
            <ArrowDownFillIcon />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export default Example;
