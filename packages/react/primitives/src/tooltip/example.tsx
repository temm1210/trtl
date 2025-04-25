import { TooltipPrimitive, TooltipRootProps } from "./";
import "./example.css";

const Example = (props: TooltipRootProps) => {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger>
        <button className="tooltip-trigger">Trigger</button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className="tooltip-content">
          <TooltipPrimitive.Arrow>arrow</TooltipPrimitive.Arrow>
          <div className="tooltip-text">Tooltip Content</div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export default Example;
