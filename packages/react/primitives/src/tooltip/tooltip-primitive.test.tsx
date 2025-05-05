import { act } from "react";

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
        <TooltipContent>
          <TooltipArrow data-testid="test-arrow" />
          <div>Content</div>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
};

describe("Tooltip primitive tests", () => {
  test("open delayDuration prop should work correctly", async () => {
    // https://github.com/testing-library/dom-testing-library/issues/987#issuecomment-1266266801
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const DELAY_TIME = 1500;
    const {
      userEvent: user,
      getByTestId,
      queryByRole,
      getByRole,
      queryByTestId,
    } = render(<Tooltip delayDuration={DELAY_TIME} />, {
      advanceTimers: vi.advanceTimersByTime,
    });

    const trigger = getByTestId("test-trigger");

    await user.hover(trigger);
    expect(queryByTestId("test-content")).not.toBeInTheDocument();

    /**
     * https://github.com/vitest-dev/vitest/issues/1983#issuecomment-1238794400
     */
    act(() => {
      vi.advanceTimersByTime(DELAY_TIME);
    });
    expect(getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(trigger);
    expect(getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(DELAY_TIME);
    });
    await waitForElementToBeRemoved(() => queryByRole("tooltip"));

    vi.useRealTimers();
  });
  test.todo("controlled", async () => {});
  test.todo("uncontrolled", async () => {});
});
