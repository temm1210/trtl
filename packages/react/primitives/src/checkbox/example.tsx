import { CheckIcon } from "@rtl/icons";

import { CheckboxPrimitive, CheckboxRootProps } from "./";
import "./example.css";

const Example = (props: CheckboxRootProps) => {
  return (
    <CheckboxPrimitive.Root className="CheckboxRoot" {...props}>
      <CheckboxPrimitive.Indicator className="CheckboxIndicator">
        <CheckIcon className="CheckboxIcon" />
      </CheckboxPrimitive.Indicator>
      <span className="CheckboxText">checkbox</span>
    </CheckboxPrimitive.Root>
  );
};

export default Example;
