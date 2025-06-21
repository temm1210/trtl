import { expect, test } from "@playwright/test";

import { getStoryUrl } from "../getStoryUrl";

test.describe("safe polygon", () => {
  for (const placement of ["top", "bottom", "left", "right"]) {
    test(`open is maintained when the pointer when placement is ${placement}`, async ({
      page,
    }) => {
      await page.addInitScript(() => {
        (window as any).__TEST__ = true;
      });
      await page.goto(getStoryUrl("tooltip--headless", { placement }));

      await page.evaluate;

      const trigger = page.locator(".tooltip-trigger");
      const tooltipContent = page.locator(".tooltip-content");

      await expect(tooltipContent).toBeHidden();

      await trigger.hover();
      await expect(tooltipContent).toBeVisible();

      const triggerRect = await trigger.boundingBox();
      const contentRect = await tooltipContent.boundingBox();

      if (!triggerRect || !contentRect) {
        test.fail(true, "bounding box is null");
        return;
      }

      const triggerCenterX = triggerRect.x + triggerRect.width / 2;
      const triggerCenterY = triggerRect.y + triggerRect.height / 2;

      await page.mouse.move(triggerCenterX, triggerCenterY);
      await expect(tooltipContent).toBeVisible();

      const contentCenterX = contentRect.x + contentRect.width / 2;
      const contentCenterY = contentRect.y + contentRect.height / 2;

      await page.mouse.move(contentCenterX, contentCenterY, { steps: 50 });
      await expect(tooltipContent).toBeVisible();
    });
  }
});
