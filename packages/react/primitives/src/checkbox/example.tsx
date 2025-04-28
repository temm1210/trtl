import { CheckIcon } from "@rtl/icons";

import { CheckboxPrimitive, CheckboxRootProps } from "./";
import "./example.css";

const Example = (props: CheckboxRootProps) => {
  return (
    <CheckboxPrimitive.Root className="checkbox-root" {...props}>
      <CheckboxPrimitive.Indicator className="checkbox-indicator">
        <CheckIcon className="checkbox-icon" />
      </CheckboxPrimitive.Indicator>
      <span className="checkbox-text">checkbox</span>
    </CheckboxPrimitive.Root>
  );
};

export default Example;
