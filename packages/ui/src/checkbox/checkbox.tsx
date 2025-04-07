import { Slot } from "@rtl/react-primitives";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** if set true, renders a child element and passes props to the child. */
  asChild?: boolean;
}

const Checkbox = ({ asChild, children }: CheckboxProps) => {
  const Comp = asChild ? Slot : "input";
  return <Comp>{children}</Comp>;
};

export default Checkbox;
