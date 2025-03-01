interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = ({ children }: SlotProps) => {
  return <>{children}</>;
};

export default Slot;
