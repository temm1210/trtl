import { render } from "@rtl/react-utils";

import Slot from "./slot";

const serialize = (html: string) =>
  html.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();

describe("Slot tests", () => {
  test("render child correctly", async () => {
    const Component = () => {
      return (
        <div className="container">
          <Slot className="slot" id="slot">
            <div className="child" id="child">
              <span>span</span>
              <p>p</p>
              <strong>strong</strong>
            </div>
          </Slot>
        </div>
      );
    };

    const dom = render(<Component />);

    const result = `
        <div class="container">
          <div class="slot child" id="child">
            <span>span</span>
            <p>p</p>
            <strong>strong</strong>
          </div>
        </div>
    `;

    expect(dom.container.innerHTML).toMatchInlineSnapshot(
      `"${serialize(result)}"`,
    );
  });

  test("pass slot props to its chid and merge it", async () => {
    const handleSlotClick = vi.fn(() => "slot");
    const handleSlotChildClick = vi.fn(() => "slot child");

    const Component = () => {
      return (
        <Slot
          data-testid="slot-test-id"
          className="slot"
          style={{ color: "red" }}
          onClick={handleSlotClick}
        >
          <p
            className="child"
            style={{ backgroundColor: "red" }}
            onClick={handleSlotChildClick}
          >
            <span>span</span>
          </p>
        </Slot>
      );
    };

    const result = `
        <p class="slot child" style="color: red; background-color: red;" data-testid="slot-test-id">
            <span>span</span>
        </p>
    `;

    const { container, userEvent, getByTestId } = render(<Component />);

    expect(handleSlotClick).toHaveBeenCalledTimes(0);
    expect(handleSlotChildClick).toHaveBeenCalledTimes(0);

    await userEvent.click(getByTestId("slot-test-id"));

    expect(container.innerHTML).toMatchInlineSnapshot(`"${serialize(result)}"`);
    expect(handleSlotClick).toHaveBeenCalledTimes(1);
    expect(handleSlotChildClick).toHaveBeenCalledTimes(1);

    expect(handleSlotClick).toReturnWith("slot");
    expect(handleSlotChildClick).toReturnWith("slot child");
  });

  test("merge slot ref and child ref", () => {
    const slotRef = vi.fn();
    const childRef = vi.fn();

    const Component = () => {
      return (
        <Slot ref={slotRef}>
          <div ref={childRef} />
        </Slot>
      );
    };

    render(<Component />);

    expect(childRef).toHaveBeenCalledTimes(1);
    expect(slotRef).toHaveBeenCalledTimes(1);
  });

  test("throw error if slot has more than one child", () => {
    const Component = () => {
      return (
        <Slot>
          <div />
          <div />
        </Slot>
      );
    };

    expect(() => render(<Component />)).toThrowError(
      "Slot must have exactly one child",
    );
  });
});
