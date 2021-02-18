import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { parsePizza, Pizza } from "./pizza.ts";

Deno.test("parses pizza", () => {
  const pizza = parsePizza("3 onion pepper olive", 0);
  assertEquals<Pizza>(pizza, {
    id: 0,
    ingredients: ["onion", "pepper", "olive"],
  });
});
