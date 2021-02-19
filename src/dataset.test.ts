import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import {
  Dataset,
  parsePizza,
  parseTeams,
  Pizza,
  readDataset,
  Team,
} from "./dataset.ts";

Deno.test("parses teams", () => {
  const teams = parseTeams("5 1 2 3");
  assertEquals(teams, [
    { peopleCount: 2, teamCount: 1 },
    { peopleCount: 3, teamCount: 2 },
    { peopleCount: 4, teamCount: 3 },
  ] as Team[]);
});

Deno.test("parses pizza", () => {
  const pizza = parsePizza("3 onion pepper olive", 0);
  assertEquals(pizza, {
    id: 0,
    ingredients: ["onion", "pepper", "olive"],
  } as Pizza);
});

Deno.test("reads dataset", async () => {
  const dataset = await readDataset("input/a_example");
  assertEquals(dataset, {
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
  } as Dataset);
});
