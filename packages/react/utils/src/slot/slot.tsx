import React from "react";

import mergeRefs from "@/merge-refs";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

const Slot = ({ children, ...slotProps }: SlotProps) => {
  const childrenAsArray = React.Children.toArray(children);

  const slottableElements = childrenAsArray.filter((child) => {
    return React.isValidElement(child) && child.type === Slottable;
  });

  if (slottableElements.length > 1) {
    throw Error("Slot must have exactly one child");
  }

  if (slottableElements.length === 1) {
    const slottableElement = slottableElements[0] as React.ReactElement<
      React.ComponentProps<typeof Slottable>,
      typeof Slottable
    >;

    const slottableChildren = slottableElement.props.children;

    const nextSlottableChildren = childrenAsArray.map((child) => {
      if (child === slottableElement) {
        return React.isValidElement(slottableChildren)
          ? (slottableChildren.props as { children: React.ReactNode }).children
          : null;
      } else {
        return child;
      }
    });

    return (
      <CloneElement nextChildren={nextSlottableChildren} {...slotProps}>
        {slottableChildren}
      </CloneElement>
    );
  }

  if (childrenAsArray.length !== 1) {
    throw Error("Slot must have exactly one child");
  }

  return <CloneElement {...slotProps}>{children}</CloneElement>;
};

// ****************** CloneElement ***************************
interface CloneElementProp extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  nextChildren?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

const CloneElement = ({
  children,
  nextChildren,
  ...slotProps
}: CloneElementProp) => {
  if (!React.isValidElement(children)) {
    throw Error("slot can only accept React elements");
  }

  const props = mergeProps(slotProps, children.props as Record<string, any>);

  const childRef = (children.props as React.RefAttributes<any>).ref;
  const slotRef = slotProps.ref;

  if (childRef || slotRef) {
    props.ref = mergeRefs([childRef, slotRef]);
  }

  return nextChildren
    ? React.cloneElement(children, props, nextChildren)
    : React.cloneElement(children, props);
};

// ****************** Slottable ***************************
const Slottable = ({ children }: { children: React.ReactNode }) => {
  return children;
};

function mergeProps(
  slotProps: Record<string, any>,
  childProps: Record<string, any>,
) {
  const mergedProps: Record<string, any> = { ...slotProps, ...childProps };

  Object.keys(mergedProps)
    .filter((propName) => /^on[A-Z]/.test(propName))
    .forEach((eventHandlerName) => {
      mergedProps[eventHandlerName] = (...args: any) => {
        childProps[eventHandlerName]?.(...args);
        slotProps[eventHandlerName]?.(...args);
      };
    });

  if (slotProps.style) {
    mergedProps.style = { ...slotProps.style, ...childProps.style };
  }

  if (slotProps.className) {
    mergedProps.className = [slotProps.className, childProps.className]
      .filter(Boolean)
      .join(" ");
  }

  return mergedProps;
}

export { Slot, Slottable };
