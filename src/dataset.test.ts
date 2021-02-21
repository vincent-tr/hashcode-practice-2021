import { Dataset, getDatasetInfo, readDataset } from "./dataset.ts";
import { assertEquals } from "./deps.ts";

export const exampleDataset: Dataset = {
  name: "a_example",
  teams: [
    { personCount: 2, teamCount: 1 },
    { personCount: 3, teamCount: 2 },
    { personCount: 4, teamCount: 1 },
  ],
  pizzas: [
    { id: 0, ingredients: [0, 1, 2] },
    { id: 1, ingredients: [3, 4, 5] },
    { id: 2, ingredients: [6, 3, 1] },
    { id: 3, ingredients: [4, 3, 5] },
    { id: 4, ingredients: [6, 5] },
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
