import { useState } from "react";

import { createContext } from "@rtl/react-utils";

interface CheckboxContextValue {
  state: "checked" | "unchecked";
  disabled?: boolean;
}

const [CheckboxProvider, useCheckboxContext] = createContext<CheckboxContextValue>();

export interface CheckboxRootProps extends React.ComponentPropsWithRef<"input"> {
  onCheckedChange?: (checked: boolean) => void;
}

const CheckboxRoot = ({
  checked: checkedProp,
  defaultChecked,
  disabled,
  onCheckedChange,
  onChange,
  ...inputProps
}: CheckboxRootProps) => {
  const [clickedState, setClickedState] = useState(defaultChecked ?? false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : clickedState;

  const dataState = checked ? "checked" : "unchecked";

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    if (!isControlled) {
      setClickedState(checked);
    }
    onCheckedChange?.(checked);
    onChange?.(e);
  };

  return (
    <CheckboxProvider value={{ state: dataState, disabled }}>
      <label>
        <input
          type="checkbox"
          onChange={handleOnChange}
          defaultChecked={defaultChecked}
          checked={checked}
          disabled={disabled}
          {...inputProps}
        />
      </label>
    </CheckboxProvider>
  );
};

const CheckboxHiddenInput = () => {
  return <span>indicator</span>;
};

const CheckboxIndicator = () => {
  return <span>indicator</span>;
};

const CheckboxLabel = () => {
  return <span>indicator</span>;
};

export default {
  Indicator: CheckboxIndicator,
  Root: CheckboxRoot,
  HiddenInput: CheckboxHiddenInput,
  Label: CheckboxLabel,
};
export { useCheckboxContext };
