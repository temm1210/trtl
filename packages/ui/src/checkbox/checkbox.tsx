import { css } from "@emotion/react";
import { CheckIcon } from "@rtl/icons";
import { CheckboxPrimitive, CheckboxRootProps } from "@rtl/react-primitives";

export interface CheckboxProps extends CheckboxRootProps {}

const Checkbox = ({ disabled, children, ...restProps }: CheckboxProps) => {
  return (
    <CheckboxPrimitive.Root disabled={disabled} css={rootCss} {...restProps}>
      <CheckboxPrimitive.Indicator css={indicatorCss}>
        <CheckIcon css={iconCss} />
      </CheckboxPrimitive.Indicator>
      <span css={textCss}>{children}</span>
    </CheckboxPrimitive.Root>
  );
};

const rootCss = css`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &:focus-visible:not(:checked) + & {
    outline: 2px solid #000;
    outline-offset: 1px;
  }
`;

const indicatorCss = css`
  display: flex;
  align-items: center;
  padding: 0.125rem;
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #ffffff;

  transition: background-color 0.15s ease;

  &[data-state="checked"] {
    background-color: #18181b;
  }

  input:focus-visible:not(:checked) + & {
    outline: 2px solid #000;
    outline-offset: 1px;
  }
`;

const iconCss = css`
  color: #ffffff;
`;

const textCss = css`
  display: inline-block;
  padding-left: 0.25rem;
  user-select: none;
`;

export default Checkbox;
