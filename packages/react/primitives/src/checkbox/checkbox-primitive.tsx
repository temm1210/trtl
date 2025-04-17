import { createContext } from "@rtl/react-utils";

interface CheckboxContextValue {
  state: "checked" | "unchecked";
  disabled?: boolean;
}

const [CheckboxProvider, useCheckboxContext] = createContext<CheckboxContextValue>();

export interface CheckboxProps extends React.ComponentPropsWithRef<"input"> {
  onCheckedChange?: (checked: boolean) => void;
}

const CheckboxRoot = () => {
  return (
    <CheckboxProvider value={{ state: "unchecked", disabled: false }}>
      <button />
      <input />
    </CheckboxProvider>
  );
};

const CheckboxIndicator = () => {
  return <span>indicator</span>;
};

export default { Indicator: CheckboxIndicator, Root: CheckboxRoot };
export { useCheckboxContext };
