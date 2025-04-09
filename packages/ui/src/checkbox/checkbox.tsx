import { useState } from "react";

import { css } from "@emotion/react";
import { CheckIcon } from "@rtl/icons";

export interface CheckboxProps extends React.ComponentPropsWithRef<"input"> {}

const Checkbox = ({ children }: CheckboxProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <label css={labelCss}>
      <input
        type="checkbox"
        css={inputCss}
        onChange={(e) => setIsClicked(e.currentTarget.checked)}
      />
      <span css={iconWrapperCss}>
        <CheckIcon style={{ visibility: isClicked ? "visible" : "hidden" }} />
      </span>
      <span css={textWrapperCss}>{children}</span>
    </label>
  );
};

const labelCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const inputCss = css`
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0px;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  overflow-wrap: normal;
`;

const iconWrapperCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.25rem;
  box-sizing: border-box;

  input:focus-visible:not(:checked) + & {
    outline: 2px solid #000;
    outline-offset: 1px;
  }
`;

const textWrapperCss = css`
  display: inline-block;
  padding-left: 0.625rem;
  user-select: none;
`;

export default Checkbox;
