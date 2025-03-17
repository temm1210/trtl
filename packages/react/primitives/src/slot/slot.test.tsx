import { render } from "@rtl/react-utils";

import Slot from "./slot";

const serialize = (html: string) =>
  html.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();

describe("Slot tests", () => {
  test("render child", async () => {
    const Component = () => {
      return (
        <div id="container">
          <Slot>
            <div id="child">
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
        <div id="container">
          <div id="child">
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
});
