import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { Dataset, getDatasetInfo, readDataset } from "./dataset.ts";

export const exampleDataset: Dataset = {
  name: "a_example",
  teams: [
    { personCount: 2, teamCount: 1 },
    { personCount: 3, teamCount: 2 },
    { personCount: 4, teamCount: 1 },
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

Deno.test("getDatasetInfo", () => {
  assertEquals(getDatasetInfo(exampleDataset), {
    "Dataset": "a_example",
    "Teams": 4,
    "People": 12,
    "Pizzas": 5,
    "Ingredients": 7,
  });
});
