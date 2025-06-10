export const getStoryUrl = (id: string) => {
  const params = new URLSearchParams({
    id: `primitives-${id}`,
    nav: "0",
  });

  return `?${params.toString()}`;
};
