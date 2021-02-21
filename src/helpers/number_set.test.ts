import { assertEquals } from "../deps.ts";
import { NumberSet } from "./number_set.ts";

Deno.test("NumberSet", () => {
  const numberSet = new NumberSet(10);
  assertEquals(numberSet.has(5), false);
  numberSet.add(5);
  assertEquals(numberSet.has(5), true);
  numberSet.delete(5);
  assertEquals(numberSet.has(5), false);
});
