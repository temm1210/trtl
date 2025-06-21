export const getStoryUrl = <A extends Record<string, any>>(
  id: string,
  args: A,
) => {
  const parameter = args ?? {};

  const parameterString = Object.entries(parameter)
    .map(([key, value]) => `${key}:${value}`)
    .join(",");

  const params = new URLSearchParams({
    id: `primitives-${id}`,
    args: parameterString,
  });

  return `?${params.toString()}`;
};
