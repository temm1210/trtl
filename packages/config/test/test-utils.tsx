import { render as rtlRender, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function render(
  ui: React.ReactElement,
  options?: RenderOptions,
): ReturnType<typeof rtlRender> & {
  userEvent: ReturnType<typeof userEvent.setup>;
} {
  const user = userEvent.setup({ delay: null });

  const result = rtlRender(ui, options);

  return { userEvent: user, ...result };
}
