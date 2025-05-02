import { SVGProps } from "react";

const ArrowDownFillIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 30 30" {...props}>
      <path stroke="none" d="M0,0 H30 L15,15 Q15,15 15,15 Z"></path>
      <clipPath>
        <rect x="0" y="0"></rect>
      </clipPath>
    </svg>
  );
};

export default ArrowDownFillIcon;
