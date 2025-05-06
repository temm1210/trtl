import React, { act } from "react";

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

describe("Tooltip primitive tests", () => {
  test("controlled", async () => {
    const handleOpenChange = vi.fn();

    const Tooltip = () => {
      const [open, setOpen] = React.useState(false);

      return (
        <TooltipRoot
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            handleOpenChange(open);
          }}
          delayDuration={0}
        >
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

    const { getByRole, userEvent, queryByRole, getByTestId } = render(
      <Tooltip />,
    );

    expect(queryByRole("tooltip")).not.toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenCalledTimes(0);

    const trigger = getByTestId("test-trigger");

    await userEvent.hover(trigger);

    expect(getByRole("tooltip")).toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    await userEvent.unhover(trigger);
    await waitForElementToBeRemoved(() => queryByRole("tooltip"));
    expect(handleOpenChange).toHaveBeenCalledTimes(2);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  test("uncontrolled", async () => {
    const { userEvent, getByTestId, queryByRole, getByRole } = render(
      <TooltipRoot delayDuration={0}>
        <TooltipTrigger asChild>
          <span data-testid="test-trigger">trigger</span>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <TooltipArrow data-testid="test-arrow" />
            <div>Content</div>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    );

    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    const trigger = getByTestId("test-trigger");

    await userEvent.hover(trigger);
    expect(getByRole("tooltip")).toBeInTheDocument();

    await userEvent.unhover(trigger);
    await waitForElementToBeRemoved(() => queryByRole("tooltip"));
  });

  test("delayDuration prop should work correctly", async () => {
    // https://github.com/testing-library/dom-testing-library/issues/987#issuecomment-1266266801
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const DELAY_TIME = 1500;
    const { userEvent, getByTestId, queryByRole, getByRole } = render(
      <TooltipRoot delayDuration={DELAY_TIME}>
        <TooltipTrigger asChild>
          <span data-testid="test-trigger">trigger</span>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <TooltipArrow data-testid="test-arrow" />
            <div>Content</div>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
      {
        advanceTimers: vi.advanceTimersByTime,
      },
    );

    const trigger = getByTestId("test-trigger");

    await userEvent.hover(trigger);
    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    /**
     * https://github.com/vitest-dev/vitest/issues/1983#issuecomment-1238794400
     */
    act(() => {
      vi.advanceTimersByTime(DELAY_TIME);
    });
    expect(getByRole("tooltip")).toBeInTheDocument();

    await userEvent.unhover(trigger);
    expect(getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(DELAY_TIME);
    });
    await waitForElementToBeRemoved(() => queryByRole("tooltip"));

    vi.useRealTimers();
  });
  test("disabled", async () => {
    const Tooltip = (props: TooltipRootProps) => {
      return (
        <TooltipRoot disabled delayDuration={0} {...props}>
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

    const { userEvent, getByTestId, queryByRole, rerender } = render(
      <Tooltip />,
    );

    const trigger = getByTestId("test-trigger");

    await userEvent.hover(trigger);
    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(<Tooltip open disabled />);
    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(<Tooltip defaultOpen disabled />);
    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
