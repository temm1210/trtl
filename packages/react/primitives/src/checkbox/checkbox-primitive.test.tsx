import { render } from "@rtl/react-utils";

import { CheckboxIndicator, CheckboxRoot, CheckboxRootProps } from "./checkbox-primitive";

const Checkbox = (props: CheckboxRootProps) => {
  return (
    <CheckboxRoot {...props}>
      <CheckboxIndicator>
        <span data-testid="test-indicator">test indicator</span>
      </CheckboxIndicator>
    </CheckboxRoot>
  );
};

describe("Checkbox primitive tests", () => {
  test("onChangeChecked, onChange should work correctly", async () => {
    const handleOnChangeChecked = vi.fn();
    const handleOnChange = vi.fn();

    const { getByRole, userEvent } = render(
      <Checkbox onCheckedChange={handleOnChangeChecked} onChange={handleOnChange}>
        checkbox
      </Checkbox>,
    );
    const checkbox = getByRole("checkbox");

    expect(handleOnChangeChecked).not.toBeCalled();

    await userEvent.click(checkbox);

    expect(handleOnChangeChecked).toHaveBeenCalledWith(true);
    expect(handleOnChangeChecked).toHaveBeenCalledTimes(1);
    expect(handleOnChange).toHaveBeenCalledTimes(1);

    await userEvent.click(checkbox);

    expect(handleOnChangeChecked).toHaveBeenCalledWith(false);
    expect(handleOnChangeChecked).toHaveBeenCalledTimes(2);
    expect(handleOnChange).toHaveBeenCalledTimes(2);
  });

  test("uncontrolled", async () => {
    const { getByRole, userEvent } = render(<Checkbox>checkbox</Checkbox>);
    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test("controlled", async () => {
    const { getByRole, rerender } = render(<Checkbox checked>checkbox</Checkbox>);

    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeChecked();

    rerender(<Checkbox checked={false}>checkbox</Checkbox>);

    expect(checkbox).not.toBeChecked();
  });

  test("disabled", async () => {
    const handleOnChangeChecked = vi.fn();

    const { getByRole, userEvent } = render(
      <Checkbox disabled onCheckedChange={handleOnChangeChecked}>
        checkbox
      </Checkbox>,
    );
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    expect(handleOnChangeChecked).not.toBeCalled();

    await userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeDisabled();
    expect(handleOnChangeChecked).not.toBeCalled();
  });

  test("defaultChecked", async () => {
    const { getByRole, userEvent } = render(<Checkbox defaultChecked>checkbox</Checkbox>);
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });
});
