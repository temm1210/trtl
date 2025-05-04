import { render } from "@rtl/react-utils";
import { waitForElementToBeRemoved } from "@testing-library/react";

import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipRootProps,
  TooltipTrigger,
} from "./tooltip-primitive";

const Tooltip = (props: TooltipRootProps) => {
  return (
    <TooltipRoot {...props}>
      <TooltipTrigger asChild>
        <span data-testid="test-trigger">trigger</span>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent data-testid="test-content">
          <TooltipArrow data-testid="test-arrow" />
          <div>Content</div>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
};

describe("Tooltip primitive tests", () => {
  test("delayDuration should work correctly", async () => {
    // https://github.com/testing-library/dom-testing-library/issues/987
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const DELAY_TIME = 2000;
    const {
      userEvent: user,
      getByTestId,
      queryByTestId,
      findByTestId,
    } = render(<Tooltip delayDuration={DELAY_TIME} />, {
      advanceTimers: vi.advanceTimersByTime,
    });

    const trigger = getByTestId("test-trigger");
    expect(queryByTestId("test-content")).toBeNull();

    await user.hover(trigger);
    vi.advanceTimersByTime(DELAY_TIME);
    expect(await findByTestId("test-content")).toBeVisible();

    await user.unhover(trigger);
    await waitForElementToBeRemoved(() => queryByTestId("test-content"));
    expect(queryByTestId("test-content")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
  test.todo("controlled", async () => {});
  test.todo("uncontrolled", async () => {});
});
