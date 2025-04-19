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
    ...inputProps
  } = props;
  const [clickedState, setClickedState] = React.useState(defaultChecked ?? false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : clickedState;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    if (!isControlled) {
      setClickedState(checked);
    }
    onCheckedChange?.(checked);
  };

  // for screen reader only
  const visuallyHiddenStyle: React.CSSProperties = {
    position: "absolute",
    width: "1px",
    height: "1px",
    clip: "rect(0px, 0px, 0px, 0px)",
    border: "0px",
    margin: "-1px",
    overflow: "hidden",
    padding: "0px",
    whiteSpace: "nowrap",
    overflowWrap: "normal",
  };

  return (
    <CheckboxProvider value={{ checked, disabled }}>
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
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
      </span>
    </CheckboxProvider>
  );
};

export interface CheckboxIndicatorProps extends React.ComponentPropsWithRef<"span"> {}

const CheckboxIndicator = (props: CheckboxIndicatorProps) => {
  return <span {...props} />;
};

export { CheckboxIndicator, CheckboxRoot, useCheckboxContext };
