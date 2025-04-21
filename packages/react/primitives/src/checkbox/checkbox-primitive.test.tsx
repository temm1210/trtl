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
});
