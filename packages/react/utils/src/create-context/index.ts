import {
  createContext as createReactContext,
  useContext as useReactContext,
} from "react";

export interface CreateContextOptions<T> {
  defaultValue?: T;
}

export type CreateContextReturn<T> = [
  React.Provider<T>,
  () => T,
  React.Context<T>,
];

export function createContext<T>({
  defaultValue,
}: CreateContextOptions<T> = {}) {
  const Context = createReactContext<T | undefined>(defaultValue);

  function useContext() {
    const context = useReactContext(Context);

    if (!context) {
      throw Error(
        `useContext must be used within a ${Context.displayName || Context.name}`,
      );
    }

    return context;
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<T>;
}
