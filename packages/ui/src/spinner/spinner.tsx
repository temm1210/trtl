import { css, keyframes } from "@emotion/react";

export interface SpinnerProps extends Omit<React.ComponentPropsWithRef<"span">, "children"> {
  size?: "small" | "medium" | "large";
}

const Spinner = ({ size = "small", ...spanProps }: SpinnerProps) => {
  const sizeCss = getSizeCss(size);
  return (
    <span css={[wrapperCss, sizeCss]} {...spanProps}>
      <svg css={spinnerCss} viewBox="22 22 44 44">
        <circle cx="44" cy="44" r="20" fill="none" stroke-width="3.6"></circle>
      </svg>
    </span>
  );
};

function getSizeCss(size: Exclude<SpinnerProps["size"], undefined>): ReturnType<typeof css> {
  return {
    small: smallCss,
    medium: mediumCss,
    large: largeCss,
  }[size];
}

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

const largeCss = css`
  width: 20px;
  height: 20px;
`;

const mediumCss = css`
  width: 16px;
  height: 16px;
`;

const smallCss = css`
  width: 12px;
  height: 12px;
`;

const wrapperCss = css`
  display: inline-block;
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
