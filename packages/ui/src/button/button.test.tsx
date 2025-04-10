import { render } from "@rtl/react-utils";

import Button from "@/button";

describe("Button tests", () => {
  test("onClick must be executed", async () => {
    const handleClick = vi.fn();

    const { userEvent, getByRole } = render(<Button onClick={handleClick}>button</Button>);

    await userEvent.click(getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("loading bar should be displayed when loading prop is true", () => {
    const { getByRole, rerender } = render(
      <Button loading loadingPlacement="left">
        button1
      </Button>,
    );

    const button1 = getByRole("button");

    expect(button1.children.length).toBe(2);
    expect(button1.children[1]?.textContent).toBe("button1");

    rerender(
      <Button loading loadingPlacement="right">
        button2
      </Button>,
    );

    const button2 = getByRole("button");

    expect(button2.children.length).toBe(2);
    expect(button2.children[0]?.textContent).toBe("button2");
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
});
