import { css } from "@emotion/react";
import { CheckIcon } from "@rtl/icons";
import { CheckboxPrimitive, CheckboxRootProps } from "@rtl/react-primitives";

export interface CheckboxProps extends CheckboxRootProps {}

const Checkbox = ({ disabled, children, ...restProps }: CheckboxProps) => {
  return (
    <label css={labelCss} style={{ opacity: disabled ? 0.5 : 1 }}>
      <CheckboxPrimitive.Root disabled={disabled} css={rootCss} {...restProps}>
        <CheckboxPrimitive.Indicator css={indicatorCss}>
          <CheckIcon css={iconCss} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span css={textCss}>{children}</span>
    </label>
  );
};

const labelCss = css`
  display: flex;
  align-items: center;
  position: relative;
`;

const rootCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
const indicatorCss = css`
  display: inline-flex;
  align-items: center;
`;

const iconCss = css`
  width: 0.875rem;
  height: 0.875rem;
  color: #ffffff;
`;

const textCss = css`
  display: inline-block;
  padding-left: 0.4rem;
  user-select: none;
`;

export default Checkbox;
