import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { Dataset, getInfo, readDataset } from "./dataset.ts";

const exampleDataset: Dataset = {
  name: "a_example",
  teams: [
    { peopleCount: 2, teamCount: 1 },
    { peopleCount: 3, teamCount: 2 },
    { peopleCount: 4, teamCount: 1 },
  ],
  pizzas: [
    { id: 0, ingredients: ["onion", "pepper", "olive"] },
    { id: 1, ingredients: ["mushroom", "tomato", "basil"] },
    { id: 2, ingredients: ["chicken", "mushroom", "pepper"] },
    { id: 3, ingredients: ["tomato", "mushroom", "basil"] },
    { id: 4, ingredients: ["chicken", "basil"] },
  ],
};

Deno.test("readDataset", async () => {
  assertEquals(await readDataset("input/a_example"), exampleDataset);
});

Deno.test("getInfo", () => {
  assertEquals(getInfo(exampleDataset), {
    "Dataset": "a_example",
    "Teams": 12,
    "Pizzas": 5,
    "Ingredients": 7,
  });
});
