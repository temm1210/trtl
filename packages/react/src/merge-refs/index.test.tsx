import { render } from "@/test/utils";

import mergeRefs from ".";

it("mergeRefs call with ref, null, undefined", async () => {
  const ref1 = { current: undefined };
  const ref2 = jest.fn();

  const Component = () => {
    return (
      <div
        data-testid="merge-ref-test"
        ref={mergeRefs([ref1, ref2, null, undefined])}
      >
        test
      </div>
    );
  };

  expect(ref1.current).toBe(undefined);
  expect(ref2).toHaveBeenCalledTimes(0);

  const { findByTestId } = render(<Component />);

  const element = await findByTestId("merge-ref-test");

  expect(ref1.current).toBe(element);
  expect(ref2).toHaveBeenCalledTimes(1);
  expect(ref2).toHaveBeenCalledWith(element);
});
