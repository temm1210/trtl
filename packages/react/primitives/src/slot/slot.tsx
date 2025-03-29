import React from "react";

import { mergeRefs } from "@rtl/react-utils";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/** A component that passes its props to its child and renders its child */
const Slot = ({ children, ...slotProps }: SlotProps) => {
  if (!isChild(children)) {
    throw new Error("Slot must have exactly one child");
  }

  const props = mergeProps(slotProps, children.props);

  const childRef = (children.props as React.RefAttributes<any>).ref;
  const slotRef = slotProps.ref;

  if (childRef || slotRef) {
    props.ref = mergeRefs([childRef, slotRef]);
  }

  return React.cloneElement(children, props);
};

function isChild(
  children: React.ReactNode,
): children is React.ReactElement<HTMLElement> {
  return React.Children.count(children) === 1;
}

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
    mergedProps.className = [slotProps.className, childProps.className].join(
      " ",
    );
  }

  return mergedProps;
}

export default Slot;
