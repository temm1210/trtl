import React from "react";

import { createContext } from "@rtl/react-utils";

interface CheckboxContextValue {
  checked?: boolean;
  disabled?: boolean;
}

const [CheckboxProvider, useCheckboxContext] = createContext<CheckboxContextValue>();

export interface CheckboxRootProps extends React.ComponentPropsWithRef<"input"> {
  onCheckedChange?: (checked: boolean) => void;
}

const CheckboxRoot = (props: CheckboxRootProps) => {
  const {
    children,
    checked: checkedProp,
    defaultChecked,
    disabled,
    onCheckedChange,
    style,
    onChange,
    ...inputProps
  } = props;
  const [clickedState, setClickedState] = React.useState(defaultChecked ?? false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : clickedState;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = e.currentTarget.checked;

    if (!isControlled) {
      setClickedState(nextChecked);
    }
    onCheckedChange?.(nextChecked);
    onChange?.(e);
  };

  // for screen reader only
  const visuallyHiddenStyle: React.CSSProperties = {
    position: "absolute",
    width: "1px",
    height: "1px",
    clip: "rect(0, 0, 0, 0)",
    border: "0px",
    margin: "-1px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    overflowWrap: "normal",
  };

  return (
    <CheckboxProvider value={{ checked, disabled }}>
      <input
        type="checkbox"
        style={{
          ...visuallyHiddenStyle,
          ...style,
        }}
        onChange={handleOnChange}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        {...inputProps}
      />
      {children}
    </CheckboxProvider>
  );
};

export interface CheckboxIndicatorProps extends React.ComponentPropsWithRef<"div"> {}

const CheckboxIndicator = ({ children, ...restProps }: CheckboxIndicatorProps) => {
  const { checked, disabled } = useCheckboxContext();

  const dataState = checked ? "checked" : "unchecked";
  const dataDisabled = disabled ? "" : undefined;

  return (
    <div data-state={dataState} data-disabled={dataDisabled} {...restProps}>
      <span
        style={{
          display: "inline-block",
          width: "100%",
          height: "100%",
          visibility: checked ? "visible" : "hidden",
        }}
      >
        {children}
      </span>
    </div>
  );
};

export { CheckboxIndicator, CheckboxRoot, useCheckboxContext };
