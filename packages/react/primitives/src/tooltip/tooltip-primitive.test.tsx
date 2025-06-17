import React from "react";

import { render } from "@rtl/react-utils";
import { act, fireEvent, waitFor } from "@testing-library/react";

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
        >
          <TooltipTrigger data-testid="test-trigger">trigger</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              <TooltipArrow />
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

    await waitFor(() => {
      expect(getByRole("tooltip")).toBeInTheDocument();
    });

    expect(handleOpenChange).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    await userEvent.unhover(trigger);

    await waitFor(() => {
      expect(queryByRole("tooltip")).not.toBeInTheDocument();
    });

    expect(handleOpenChange).toHaveBeenCalledTimes(2);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  test("uncontrolled", async () => {
    const { userEvent, getByTestId, queryByRole, getByRole } = render(
      <TooltipRoot>
        <TooltipTrigger data-testid="test-trigger">trigger</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>Content</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    );

    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    const trigger = getByTestId("test-trigger");

    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(getByRole("tooltip")).toBeInTheDocument();
    });

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  test("delayDuration prop should work correctly", async () => {
    // https://github.com/testing-library/react-testing-library/issues/1197
    // https://github.com/testing-library/user-event/issues/1115
    vi.stubGlobal("jest", {
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    });
    vi.useFakeTimers();

    const DELAY_TIME = 1000;
    const { getByTestId, queryByRole } = render(
      <TooltipRoot delayDuration={DELAY_TIME}>
        <TooltipTrigger data-testid="test-trigger">trigger</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>Content</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
      {
        advanceTimers: vi.advanceTimersByTime.bind(vi),
        delay: null,
      },
    );

    const trigger = getByTestId("test-trigger");

    /**
     * user event use jest.advanceTimersByTime(0)
     * https://github.com/testing-library/react-testing-library/blob/f78839bf4147a777a823e33a429bcf5de9562f9e/src/pure.js#L50
     */
    fireEvent.pointerEnter(trigger);

    /**
     * https://github.com/vitest-dev/vitest/issues/1983#issuecomment-1238794400
     */
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DELAY_TIME);
    });

    fireEvent.pointerLeave(trigger);
    fireEvent.pointerMove(trigger);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DELAY_TIME);
    });
    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  test("disabled", async () => {
    const Tooltip = (props: TooltipRootProps) => {
      return (
        <TooltipRoot disabled {...props}>
          <TooltipTrigger asChild>
            <span data-testid="test-trigger">trigger</span>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              <TooltipArrow />
              <div>Content</div>
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      );
    };

    const { userEvent, getByTestId, queryByRole, rerender } = render(
      <Tooltip />,
    );

    await userEvent.hover(getByTestId("test-trigger"));
    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(<Tooltip open disabled />);
    expect(queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(<Tooltip defaultOpen disabled />);
    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });

  test("defaultOpen", async () => {
    const { getByRole } = render(
      <TooltipRoot defaultOpen>
        <TooltipTrigger>trigger</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <TooltipArrow />
            <div>Content</div>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    );
    const tooltip = getByRole("tooltip");

    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute("data-open");
    expect(tooltip).not.toHaveAttribute("data-entering");
  });

  test("portal forceMount", async () => {
    const { getByRole } = render(
      <TooltipRoot>
        <TooltipTrigger>trigger</TooltipTrigger>
        <TooltipPortal forceMount>
          <TooltipContent>
            <TooltipArrow />
            <div>Content</div>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    );
    const tooltip = getByRole("tooltip");

    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute("data-close");
  });
});
