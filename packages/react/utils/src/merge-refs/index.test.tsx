import { render } from "@/test/utils";

import mergeRefs from "./";

test("mergeRefs call with ref, null, undefined", async () => {
  const ref1 = { current: undefined };
  const ref2 = vi.fn();

  const Component = () => {
    return (
      <div data-testid="merge-ref-test" ref={mergeRefs([ref1, ref2, null, undefined])}>
        test
      </div>
    );
  };

  expect(ref1.current).toBe(undefined);
  expect(ref2).toHaveBeenCalledTimes(0);

  const { getByTestId, unmount } = render(<Component />);

  const element = await getByTestId("merge-ref-test");

  expect(ref1.current).toBe(element);
  expect(ref2).toHaveBeenCalledTimes(1);
  expect(ref2).toHaveBeenCalledWith(element);

  unmount();

  expect(ref1.current).toBeNull();
  expect(ref2).toHaveBeenCalledTimes(2);
  expect(ref2).toHaveBeenCalledWith(null);
});
