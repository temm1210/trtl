import { useState } from "react";

import { css } from "@emotion/react";
import { CheckIcon } from "@rtl/icons";

export interface CheckboxProps extends React.ComponentPropsWithRef<"input"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = ({
  children,
  checked: checkedProp,
  defaultChecked,
  disabled,
  onCheckedChange,
  onChange,
  ...inputProps
}: CheckboxProps) => {
  const [isClickedState, setIsClickedState] = useState(defaultChecked ?? false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : isClickedState;

  const dataState = checked ? "checked" : "unchecked";
  const dataDisabled = disabled ? "" : undefined;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    if (!isControlled) {
      setIsClickedState(checked);
    }
    onCheckedChange?.(checked);
    onChange?.(e);
  };

  return (
    <label css={labelCss} data-state={dataState} data-disabled={dataDisabled}>
      <input
        type="checkbox"
        css={inputCss}
        onChange={handleOnChange}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        {...inputProps}
      />
      <span css={iconWrapperCss}>
        <CheckIcon style={{ visibility: checked ? "visible" : "hidden" }} css={iconCss} />
      </span>
      <span css={textWrapperCss}>{children}</span>
    </label>
  );
};

const labelCss = css`
  display: inline-flex;
  align-items: center;
  position: relative;

  &[data-disabled] {
    opacity: 0.5;
  }
`;

const inputCss = css`
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0px;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  overflow-wrap: normal;
`;

const iconWrapperCss = css`
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

  label[data-state="checked"] > & {
    background-color: #18181b;
  }

  input:focus-visible:not(:checked) + & {
    outline: 2px solid #000;
    outline-offset: 1px;
  }
`;

const iconCss = css`
  width: 0.875rem;
  height: 0.875rem;
  color: #ffffff;
`;

const textWrapperCss = css`
  display: inline-block;
  padding-left: 0.5rem;
  user-select: none;
`;

export default Checkbox;
