import { createContext } from "@rtl/react-utils";

interface CheckboxContextValue {
  state: "checked" | "unchecked";
  disabled?: boolean;
}

const [CheckboxProvider, useCheckboxContext] = createContext<CheckboxContextValue>();

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

export { CheckboxIndicator, CheckboxRoot, useCheckboxContext };
