import { SVGProps } from "react";

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1px"
      stroke="currentcolor"
      width="1rem"
      height="1rem"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20.664 5.253a1 1 0 0 1 .083 1.411l-10.666 12a1 1 0 0 1-1.495 0l-5.333-6a1 1 0 0 1 1.494-1.328l4.586 5.159l9.92-11.16a1 1 0 0 1 1.411-.082"
      ></path>
    </svg>
  );
};

export default CheckIcon;
