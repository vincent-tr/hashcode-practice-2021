import { assertEquals } from "../deps.ts";
import { trimLines } from "./string.ts";

Deno.test("trimLines", () => {
  assertEquals(trimLines(["", " a ", " "]), ["a"]);
});
