export interface CheckboxProps extends React.ComponentPropsWithRef<"label"> {}

const Checkbox = ({ children }: CheckboxProps) => {
  return (
    <label>
      <input />
      <span>{children}</span>
    </label>
  );
};

export default Checkbox;
