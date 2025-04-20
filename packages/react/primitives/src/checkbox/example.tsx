import { CheckIcon } from "@rtl/icons";

import { CheckboxPrimitive, CheckboxRootProps } from "./";
import "./example.css";

const Example = (props: CheckboxRootProps) => {
  return (
    <label style={{ display: "flex", alignItems: "center" }}>
      <CheckboxPrimitive.Root className="CheckboxRoot" {...props}>
        <CheckboxPrimitive.Indicator>
          <CheckIcon className="CheckboxIcon" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span className="CheckboxText">checkbox</span>
    </label>
  );
};

export default Example;
