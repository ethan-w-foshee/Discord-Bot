import { assert } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { renderD2 } from "./d2.js";

Deno.test("Command test (d2.js)", async (t) => {
  await t.step("D2 Rendering", async () => {
      const png = await renderD2("x -> y -> z");
      assert(png.length>0, "Failed to render image");
  });
});
