import React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement<HTMLElement>;
  ref?: React.Ref<HTMLElement>;
}

/** A component that passes its props to its child and renders its child */
const Slot = ({ children, ...slotProps }: SlotProps) => {
  const props = mergeProps(slotProps, children.props);

  return <div {...props}>{children}</div>;
};

function mergeProps(
  slotProps: Record<string, any>,
  childProps: Record<string, any>
) {
  const mergedProps: Record<string, any> = { ...slotProps, ...childProps };

  const eventHandlerNames = Object.keys(mergedProps).filter((propName) =>
    /^on[A-Z]/.test(propName)
  );

  for (const eventHandlerName of eventHandlerNames) {
    mergedProps[eventHandlerName] = (...args: any) => {
      childProps[eventHandlerName]?.(...args);
      slotProps[eventHandlerName]?.(...args);
    };
  }

  if (slotProps.style) {
    mergedProps.style = { ...slotProps.style, ...childProps.style };
  }

  if (slotProps.className) {
    mergedProps.className = [slotProps.className, childProps.className].join(
      " "
    );
  }

  return mergedProps;
}

export default Slot;
