import { css } from "@emotion/react";
import { ArrowDownFillIcon } from "@rtl/icons";
import { TooltipPlaceMent, TooltipPrimitive } from "@rtl/react-primitives";

export interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  delayDuration?: number;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlaceMent;
  offset?: number;
}

const Tooltip = ({
  open,
  defaultOpen,
  disabled = false,
  delayDuration,
  onOpenChange,
  content,
  children,
  placement,
  offset,
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      delayDuration={delayDuration}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>
        <span css={triggerCss}>{children}</span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          css={contentCss}
          placement={placement}
          offset={offset}
        >
          <div>{content}</div>
          <TooltipPrimitive.Arrow asChild>
            <ArrowDownFillIcon css={iconCss} />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

const contentCss = css`
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);

  background-color: rgba(0, 0, 0, 0.85);

  color: #ffffff;
  padding: 0.875rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;

  transition:
    opacity 200ms ease-in-out,
    transform 200ms ease-in-out;

  opacity: 1;
  transform: scale(1);

  &[data-status="entering"],
  &[data-status="exiting"] {
    opacity: 0;
    transform: scale(0.7);
  }
`;

const triggerCss = css`
  cursor: pointer;
`;

const iconCss = css`
  width: 10px;
  height: 10px;
`;

export default Tooltip;
