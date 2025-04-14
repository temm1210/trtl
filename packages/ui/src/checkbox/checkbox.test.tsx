import { useState } from "react";

import { render } from "@rtl/react-utils";

import Checkbox, { CheckboxProps } from "@/checkbox";

describe("Checkbox tests", () => {
  test("uncontrolled", async () => {
    const { getByRole, userEvent } = render(<Checkbox>checkbox</Checkbox>);
    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test("controlled", async () => {
    const handleOnChangeChecked = vi.fn();

    const Comp = ({ onCheckedChange }: CheckboxProps) => {
      const [checkedState, setCheckedState] = useState(false);

      return (
        <Checkbox
          checked={checkedState}
          onCheckedChange={(checked) => {
            setCheckedState(checked);
            onCheckedChange?.(checked);
          }}
        >
          checkbox
        </Checkbox>
      );
    };

    const { getByRole, userEvent } = render(
      <Comp checked onCheckedChange={handleOnChangeChecked} />,
    );

    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    expect(handleOnChangeChecked).not.toBeCalled();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(handleOnChangeChecked).toHaveBeenCalledWith(true);
    expect(handleOnChangeChecked).toHaveBeenCalledTimes(1);

    await userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(handleOnChangeChecked).toHaveBeenCalledWith(false);
    expect(handleOnChangeChecked).toHaveBeenCalledTimes(2);
  });
});
