import { css } from "@emotion/react";

import CheckIcon from "./checkIcon";

export interface CheckboxProps extends React.ComponentPropsWithRef<"input"> {}

const Checkbox = ({ children }: CheckboxProps) => {
  return (
    <label css={labelCss}>
      <input css={inputCss} />
      <span css={iconWrapperCss}>
        <CheckIcon />
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
`;

const textWrapperCss = css`
  display: inline-block;
  padding-left: 0.625rem;
`;

export default Checkbox;
