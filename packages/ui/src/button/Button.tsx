export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size: "small" | "medium" | "large";
  loading?: boolean;
  loadingText?: string;
  variant?: "solid" | "outlined" | "filled";
  useChild?: boolean;
  spinnerPlacement?: "left" | "right";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// #16A349
export const Button = ({
  size = "medium",
  children,
  ...buttonProps
}: ButtonProps) => {
  console.log(size);
  return (
    <button type="button" {...buttonProps}>
      {children}
    </button>
  );
};
