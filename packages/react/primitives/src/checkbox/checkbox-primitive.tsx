import React from "react";

import { createContext } from "@rtl/react-utils";

interface CheckboxContextValue {
  checked?: boolean;
  disabled?: boolean;
}

const [CheckboxPrimitiveProvider, useCheckboxPrimitiveContext] =
  createContext<CheckboxContextValue>();

export interface CheckboxRootProps
  extends React.ComponentPropsWithRef<"input"> {
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
    className,
    onChange,
    ...inputProps
  } = props;
  const [clickedState, setClickedState] = React.useState(
    defaultChecked ?? false,
  );

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

  const dataAttribute = getDataAttribute(checked, disabled);

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
    <CheckboxPrimitiveProvider value={{ checked, disabled }}>
      <label {...dataAttribute} style={style} className={className}>
        <input
          type="checkbox"
          style={visuallyHiddenStyle}
          onChange={handleOnChange}
          defaultChecked={defaultChecked}
          checked={checked}
          disabled={disabled}
          {...inputProps}
        />
        {children}
      </label>
    </CheckboxPrimitiveProvider>
  );
};

export interface CheckboxIndicatorProps
  extends React.ComponentPropsWithRef<"div"> {}

const CheckboxIndicator = ({
  children,
  ...restProps
}: CheckboxIndicatorProps) => {
  const { checked, disabled } = useCheckboxPrimitiveContext();

  const dataAttribute = getDataAttribute(checked, disabled);

  return (
    <span {...dataAttribute} {...restProps}>
      {checked ? children : null}
    </span>
  );
};

function getDataAttribute(
  checked: boolean | undefined,
  disabled: boolean | undefined,
) {
  return {
    "data-state": checked ? "checked" : "unchecked",
    "data-disabled": disabled ? "" : undefined,
  };
}

export { CheckboxIndicator, CheckboxRoot, useCheckboxPrimitiveContext };
