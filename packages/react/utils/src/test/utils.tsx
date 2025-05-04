import { RenderOptions, render as rtlRender } from "@testing-library/react";
import userEvent, { Options } from "@testing-library/user-event";

export function render(
  ui: React.ReactElement,
  setupOption?: Options,
  renderOptions?: RenderOptions,
): ReturnType<typeof rtlRender> & {
  userEvent: ReturnType<typeof userEvent.setup>;
} {
  const user = userEvent.setup(setupOption);

  const result = rtlRender(ui, renderOptions);

  return { userEvent: user, ...result };
}
