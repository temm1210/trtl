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
    className,
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
    <CheckboxProvider value={{ checked, disabled }}>
      <input
        type="checkbox"
        style={visuallyHiddenStyle}
        onChange={handleOnChange}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        {...inputProps}
      />
      <div {...dataAttribute} style={style} className={className}>
        {children}
      </div>
    </CheckboxProvider>
  );
};

export interface CheckboxIndicatorProps extends React.ComponentPropsWithRef<"span"> {}

const CheckboxIndicator = ({ children, ...restProps }: CheckboxIndicatorProps) => {
  const { checked, disabled } = useCheckboxContext();

  const dataAttribute = getDataAttribute(checked, disabled);

  return (
    <span
      style={{
        visibility: checked ? "visible" : "hidden",
      }}
      {...dataAttribute}
      {...restProps}
    >
      {children}
    </span>
  );
};

function getDataAttribute(checked: boolean | undefined, disabled: boolean | undefined) {
  return {
    "data-state": checked ? "checked" : "unchecked",
    "data-disabled": disabled ? "" : undefined,
  };
}

export { CheckboxIndicator, CheckboxRoot, useCheckboxContext };
