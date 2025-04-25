import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from "./tooltip-primitive";

export type {
  TooltipContentProps,
  TooltipPortalProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "./tooltip-primitive";

const TooltipPrimitive = {
  Root: TooltipRoot,
  Content: TooltipContent,
  Portal: TooltipPortal,
  Arrow: TooltipArrow,
  Trigger: TooltipTrigger,
};

export { TooltipPrimitive };
