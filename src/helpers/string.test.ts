import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { trimLines } from "./string.ts";

Deno.test("trimLines", () => {
  assertEquals(trimLines(["", " a ", " "]), ["a"]);
});
