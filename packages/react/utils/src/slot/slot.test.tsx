import { Slot, Slottable } from "@/slot";

import { render } from "../test/utils";

describe("Slot tests", () => {
  test("render child correctly", async () => {
    const Component = () => {
      return (
        <Slot>
          <p>child</p>
        </Slot>
      );
    };

    const { container } = render(<Component />);

    expect(container.firstChild).toMatchInlineSnapshot(`
    <p>
      child
    </p>
  `);
  });

  test("pass Slot props to its chid and merge it", async () => {
    const handleSlotClick = vi.fn(() => "slot");
    const handleSlotChildClick = vi.fn(() => "slot child");

    const { container, userEvent, getByTestId } = render(
      <Slot
        data-testid="slot-test-id"
        style={{ color: "red" }}
        onClick={handleSlotClick}
      >
        <p style={{ backgroundColor: "red" }} onClick={handleSlotChildClick}>
          <span>span</span>
        </p>
      </Slot>,
    );

    expect(handleSlotClick).toHaveBeenCalledTimes(0);
    expect(handleSlotChildClick).toHaveBeenCalledTimes(0);

    await userEvent.click(getByTestId("slot-test-id"));

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<p style="color: red; background-color: red;" data-testid="slot-test-id"><span>span</span></p>"`,
    );
    expect(handleSlotClick).toHaveBeenCalledTimes(1);
    expect(handleSlotChildClick).toHaveBeenCalledTimes(1);

    expect(handleSlotClick).toReturnWith("slot");
    expect(handleSlotChildClick).toReturnWith("slot child");
  });

  test("should merge classNames when both slot and child have className", () => {
    const Component = () => {
      return (
        <Slot className="slot-class">
          <p data-testid="child-test" className="child-class">
            child
          </p>
        </Slot>
      );
    };

    const { getByTestId } = render(<Component />);

    expect(getByTestId("child-test")).toHaveAttribute(
      "class",
      "slot-class child-class",
    );
  });

  test("merge Slot ref and child ref", () => {
    const slotRef = { current: null as HTMLElement | null };
    const childRef = { current: null as HTMLAnchorElement | null };

    const { getByTestId } = render(
      <Slot ref={slotRef}>
        <a data-testid="slot-child" ref={childRef}>
          link
        </a>
      </Slot>,
    );

    expect(slotRef.current?.tagName).toBe("A");
    expect(getByTestId("slot-child")).toBe(slotRef.current);

    expect(childRef.current?.tagName).toBe("A");
    expect(getByTestId("slot-child")).toBe(childRef.current);
  });

  test("Slottable renders children correctly", () => {
    const { getByTestId } = render(
      <Slottable>
        <span data-testid="slottable-child">slottable</span>
      </Slottable>,
    );

    expect(getByTestId("slottable-child")).toBeTruthy();
  });

  test("throw error if Slot has more than one child when without Slottable", () => {
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
      <Slot className="slot" style={{ color: "black" }}>
        <div>div1</div>
        <Slottable>
          <a className="slottable" style={{ backgroundColor: "red" }}>
            link
          </a>
        </Slottable>
        <div>div2</div>
      </Slot>,
    );

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<a class="slot slottable" style="color: black; background-color: red;"><div>div1</div>link<div>div2</div></a>"`,
    );
  });

  test("throw error if slot has more than one Slottable", () => {
    expect(() =>
      render(
        <Slot>
          <div>div1</div>
          <Slottable>
            <a>
              <div>link</div>
            </a>
          </Slottable>
          <Slottable>
            <span>slottable</span>
          </Slottable>
          <div>div2</div>
        </Slot>,
      ),
    ).toThrowError("Slot must have exactly one child");
  });

  test("merge Slottable child ref and slot ref", () => {
    const slotRefMock = { current: null as HTMLElement | null };
    const slottableChildRefMock = { current: null as HTMLAnchorElement | null };

    const Component = () => {
      return (
        <Slot ref={slotRefMock}>
          <div>div1</div>
          <Slottable>
            <a data-testid="slottable-child" ref={slottableChildRefMock}>
              link
            </a>
          </Slottable>
          <div>div2</div>
        </Slot>
      );
    };

    const { getByTestId } = render(<Component />);

    expect(slotRefMock.current?.tagName).toBe("A");
    expect(getByTestId("slottable-child")).toBe(slotRefMock.current);

    expect(slottableChildRefMock.current?.tagName).toBe("A");
    expect(getByTestId("slottable-child")).toBe(slottableChildRefMock.current);
  });
});
