import { SEP } from "https://deno.land/std@0.87.0/path/separator.ts";
import { trimLines } from "./helpers/string.ts";

export type Dataset = {
  name: string;
  teams: Team[];
  pizzas: Pizza[];
};

export type Team = {
  personCount: number;
  teamCount: number;
};

export type Pizza = {
  id: number;
  ingredients: string[];
};

export async function readDataset(inputFilePath: string): Promise<Dataset> {
  const input = await Deno.readTextFile(inputFilePath);
  const [teamsLine, ...pizzasLines] = trimLines(input.split("\n"));
  return {
    name: inputFilePath.split(SEP).pop()!,
    teams: parseTeams(teamsLine),
    pizzas: pizzasLines.map(parsePizza),
  };
}

export function getDatasetInfo(dataset: Dataset) {
  return {
    "Dataset": dataset.name,
    "Teams": countTotalTeams(dataset),
    "People": countTotalPeople(dataset),
    "Pizzas": countTotalPizzas(dataset),
    "Ingredients": countTotalIngredients(dataset),
  };
}

export function countTotalTeams({ teams }: Dataset) {
  return teams.reduce(
    (count, { teamCount }) => count + teamCount,
    0,
  );
}

export function countTotalPeople({ teams }: Dataset) {
  return teams.reduce(
    (count, { personCount, teamCount }) => count + personCount * teamCount,
    0,
  );
}

export function countTotalPizzas({ pizzas }: Dataset) {
  return pizzas.length;
}

export function countTotalIngredients({ pizzas }: Dataset) {
  return pizzas.reduce((ingredients, pizza) => {
    pizza.ingredients.forEach((ingredient) => ingredients.add(ingredient));
    return ingredients;
  }, new Set<string>()).size;
}

function parseTeams(line: string): Team[] {
  return line.split(" ")
    .slice(1)
    .map(Number)
    .map((teamCount, i) => ({
      personCount: i + 2,
      teamCount,
    }));
}

function parsePizza(line: string, pizzaId: number): Pizza {
  return {
    id: pizzaId,
    ingredients: line.split(" ").slice(1),
  };
}
