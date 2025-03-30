import { css, keyframes } from "@emotion/react";

export interface SpinnerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLSpanElement>, "children"> {}

const Spinner = (props: SpinnerProps) => {
  return (
    <span css={wrapperCss} {...props}>
      <svg css={spinnerCss} viewBox="22 22 44 44">
        <circle
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke-width="3.6"
        ></circle>
      </svg>
    </span>
  );
};

const spinAnimation = keyframes`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`;

const rotateAnimation = keyframes`
  0% {      
      transform: rotate(0deg);
  }
  100% {    
      transform: rotate(360deg);
  }
`;

const wrapperCss = css`
  display: inline-block;
  width: 40px;
  height: 40px;
  animation: ${rotateAnimation} 1.4s linear infinite;
`;

const spinnerCss = css`
  color: currentColor;

  circle {
    stroke: currentColor;
    stroke-width: 4;
    stroke-dasharray: 125;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: ${spinAnimation} 1.4s linear infinite;
  }
`;

export default Spinner;
