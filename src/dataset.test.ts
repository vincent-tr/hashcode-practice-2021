import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import {
  countTotalIngredients,
  countTotalPizzas,
  countTotalTeams,
  Dataset,
  readDataset,
} from "./dataset.ts";

const exampleDataset: Dataset = {
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
  const dataset = await readDataset("input/a_example");
  assertEquals(dataset, exampleDataset);
});

Deno.test("countTotalTeams", () => {
  assertEquals(countTotalTeams(exampleDataset), 12);
});

Deno.test("countTotalPizzas", () => {
  assertEquals(countTotalPizzas(exampleDataset), 5);
});

Deno.test("countTotalIngredients", () => {
  assertEquals(countTotalIngredients(exampleDataset), 7);
});
