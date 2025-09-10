import React from "react";

import { mergeRefs } from "../merge-refs";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/** A component that passes its props to its child and renders its child */
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
      <SlotCloneElement {...slotProps}>
        {React.isValidElement(slottableChildren)
          ? React.cloneElement(
              slottableChildren,
              undefined,
              nextSlottableChildren,
            )
          : null}
      </SlotCloneElement>
    );
  }

  if (childrenAsArray.length !== 1) {
    throw Error("Slot must have exactly one child");
  }

  return (
    <SlotCloneElement {...slotProps}>
      {childrenAsArray[0] as React.ReactElement<HTMLElement>}
    </SlotCloneElement>
  );
};

// ****************** SlotCloneElement ***************************
interface SlotCloneElementProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

const SlotCloneElement = ({
  children,
  ...slotProps
}: SlotCloneElementProps) => {
  if (!React.isValidElement(children)) {
    return null;
  }

  const child = React.Children.only(
    children,
  ) as React.ReactElement<HTMLElement>;

  const props = mergeProps(slotProps, child.props);

  const childRef = (child.props as React.RefAttributes<any>).ref;
  const slotRef = slotProps.ref;

  if (childRef || slotRef) {
    props.ref = mergeRefs([childRef, slotRef]);
  }

  return React.isValidElement(children)
    ? React.cloneElement(children, props)
    : null;
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
      .join(" ")
      .trim();
  }

  return mergedProps;
}

export { Slot, Slottable };
