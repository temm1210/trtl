import React from "react";

import { mergeRefs } from "@rtl/react-utils";

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
    throw Error("Slottable must be one");
  }

  if (slottableElements.length === 1) {
    const slottableElement = slottableElements[0] as React.ReactElement<
      React.ComponentProps<typeof Slottable>,
      typeof Slottable
    >;

    const slottableChildren = slottableElement.props.children as React.ReactElement;

    const nextSlottableChildren = childrenAsArray.map((child) => {
      if (child === slottableElement) {
        return (slottableChildren.props as { children: React.ReactNode }).children;
      } else {
        return child;
      }
    });

    return (
      <SlotCloneElement {...slotProps}>
        {React.cloneElement(slottableChildren, undefined, nextSlottableChildren)}
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
  children: React.ReactElement;
  ref?: React.Ref<HTMLElement>;
}

const SlotCloneElement = ({ children, ...slotProps }: SlotCloneElementProps) => {
  const child = React.Children.only(children) as React.ReactElement<HTMLElement>;

  const props = mergeProps(slotProps, child.props);

  const childRef = (child.props as React.RefAttributes<any>).ref;
  const slotRef = slotProps.ref;

  if (childRef || slotRef) {
    props.ref = mergeRefs([childRef, slotRef]);
  }

  return React.cloneElement(children, props);
};

// ****************** Slottable ***************************
const Slottable = ({ children }: { children: React.ReactNode }) => {
  return children;
};

function mergeProps(slotProps: Record<string, any>, childProps: Record<string, any>) {
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
    mergedProps.className = [slotProps.className, childProps.className].join(" ");
  }

  return mergedProps;
}

export { Slot, Slottable };
