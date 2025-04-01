import { render } from "@rtl/react-utils";

import { Slot, Slottable } from "./slot";

const serialize = (html: string) =>
  html
    .replace(/>\s+</g, "><")
    .replace(/(?<=[>])\s+(?=[^<])/g, "")
    .replace(/(?<=[^>])\s+(?=[<])/g, "")
    .trim();

describe("Slot tests", () => {
  test("render child correctly", async () => {
    const dom = render(
      <div className="container">
        <Slot className="slot" id="slot">
          <div className="child" id="child">
            <span>span</span>
            <p>p</p>
            <strong>strong</strong>
          </div>
        </Slot>
      </div>,
    );

    const result = `
        <div class="container">
          <div class="slot child" id="child">
            <span>span</span>
            <p>p</p>
            <strong>strong</strong>
          </div>
        </div>
    `;

    expect(dom.container.innerHTML).toMatchInlineSnapshot(`"${serialize(result)}"`);
  });

  test("pass slot props to its chid and merge it", async () => {
    const handleSlotClick = vi.fn(() => "slot");
    const handleSlotChildClick = vi.fn(() => "slot child");

    const { container, userEvent, getByTestId } = render(
      <Slot
        data-testid="slot-test-id"
        className="slot"
        style={{ color: "red" }}
        onClick={handleSlotClick}
      >
        <p className="child" style={{ backgroundColor: "red" }} onClick={handleSlotChildClick}>
          <span>span</span>
        </p>
      </Slot>,
    );

    const result = `
        <p class="slot child" style="color: red; background-color: red;" data-testid="slot-test-id">
            <span>span</span>
        </p>
    `;

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

    render(
      <Slot ref={slotRef}>
        <div ref={childRef} />
      </Slot>,
    );

    expect(childRef).toHaveBeenCalledTimes(1);
    expect(slotRef).toHaveBeenCalledTimes(1);
  });

  test("throw error if slot has more than one child when without Slottable", () => {
    expect(() =>
      render(
        <Slot>
          <div />
          <div />
        </Slot>,
      ),
    ).toThrowError("Slot must have exactly one child");
  });

  test("render correctly when with Slottable", () => {
    const { container } = render(
      <Slot>
        <div>div1</div>
        <Slottable>
          <a>link</a>
        </Slottable>
        <div>div2</div>
      </Slot>,
    );

    const result = `
        <a>
          <div>div1</div>
          link
          <div>div2</div>
        </a>
    `;

    expect(container.innerHTML).toMatchInlineSnapshot(`"${serialize(result)}"`);
  });
});
