export function mergeRefs<T = any>(
  refs: Array<React.RefAttributes<T>["ref"] | undefined | null>,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.RefObject<T | null>).current = value;
      }
    });
  };
}

export default mergeRefs;
