import { render } from "@rtl/react-utils";

import Button from "@/button";

describe("Button tests", () => {
  test("onClick must be executed", async () => {
    const handleClick = vi.fn();

    const { userEvent, getByRole } = render(<Button onClick={handleClick}>button</Button>);

    await userEvent.click(getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("icon prop should work correctly", () => {
    const { getByRole, rerender } = render(<Button leftIcon={<span>left</span>}>button</Button>);

    const button = getByRole("button");

    expect(button.children.length).toBe(2);
    expect(button.children[0]?.textContent).toBe("left");

    rerender(<Button rightIcon={<span>right</span>}>button</Button>);

    expect(button.children.length).toBe(2);
    expect(button.children[1]?.textContent).toBe("right");

    rerender(
      <Button leftIcon={<span>left</span>} rightIcon={<span>right</span>}>
        button
      </Button>,
    );

    expect(button.children.length).toBe(3);
    expect(button.children[0]?.textContent).toBe("left");
    expect(button.children[2]?.textContent).toBe("right");
  });

  test("should be disabled when disabled prop is true", async () => {
    const handleClick = vi.fn();

    const { getByRole, userEvent } = render(
      <Button disabled onClick={handleClick}>
        button
      </Button>,
    );

    const button = getByRole("button");

    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("should be disabled when loading prop is true", async () => {
    const handleClick = vi.fn();

    const { getByRole, userEvent } = render(
      <Button loading onClick={handleClick}>
        button
      </Button>,
    );

    const button = getByRole("button");

    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("render child instead of button when asChild is true", async () => {
    const handleClickSlot = vi.fn();
    const handleClickChild = vi.fn();

    const { getByTestId, userEvent, container } = render(
      <Button data-testid="slot" asChild onClick={handleClickSlot}>
        <a href="/test" onClick={handleClickChild}>
          link
        </a>
      </Button>,
    );

    expect(handleClickSlot).toHaveBeenCalledTimes(0);
    expect(handleClickChild).toHaveBeenCalledTimes(0);

    const button = getByTestId("slot");

    await userEvent.click(button);

    expect(handleClickSlot).toHaveBeenCalledTimes(1);
    expect(handleClickChild).toHaveBeenCalledTimes(1);

    expect(button).toHaveAttribute("href", "/test");
    expect(container.firstElementChild?.tagName).toBe("A");
  });

  test("ref must be executed correctly", async () => {
    const buttonRef = { current: null };

    const { getByTestId } = render(<Button ref={buttonRef} data-testid="button"></Button>);

    const button = getByTestId("button");

    expect(buttonRef.current).toBe(button);
  });
});
