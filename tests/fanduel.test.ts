import { test, expect } from "@playwright/test";
import { logic } from "../api/fanduel/post";

test("get todays events", async () => {
  const { events } = await logic({ method: "SETUP" });
  expect(events.length).toBeGreaterThan(0);
});
