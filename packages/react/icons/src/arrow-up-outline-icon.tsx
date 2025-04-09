import { SVGProps } from "react";

const ArrowUpOutline = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 5.714a1 1 0 0 1 1 1v12.5a1 1 0 0 1-2 0v-12.5a1 1 0 0 1 1-1"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 4.214a1 1 0 0 1 .707.293l4.5 4.5a1 1 0 0 1-1.414 1.415L12 6.628l-3.793 3.793a1 1 0 0 1-1.414-1.415l4.5-4.5A1 1 0 0 1 12 4.214"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default ArrowUpOutline;
