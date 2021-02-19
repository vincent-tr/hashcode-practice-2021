export type Dataset = {
  teams: Team[];
  pizzas: Pizza[];
};

export type Team = {
  peopleCount: number;
  teamCount: number;
};

export type Pizza = {
  id: number;
  ingredients: string[];
};

export async function readDataset(inputFilePath: string): Promise<Dataset> {
  const input = await Deno.readTextFile(inputFilePath);
  const [teamsLine, ...pizzasLines] = sanitize(input.split("\n"));
  return {
    teams: parseTeams(teamsLine),
    pizzas: pizzasLines.map(parsePizza),
  };
}

export function countTotalTeams(dataset: Dataset) {
  return dataset.teams.reduce(
    (count, team) => count + team.peopleCount * team.teamCount,
    0,
  );
}

export function countTotalPizzas(dataset: Dataset) {
  return dataset.pizzas.length;
}

export function countTotalIngredients(dataset: Dataset) {
  return dataset.pizzas.reduce((ingredients, pizza) => {
    pizza.ingredients.forEach((ingredient) => ingredients.add(ingredient));
    return ingredients;
  }, new Set<string>()).size;
}

function sanitize(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter((line) => !!line);
}

function parseTeams(line: string): Team[] {
  return line.split(" ")
    .slice(1)
    .map(Number)
    .map((teamCount, i) => ({
      peopleCount: i + 2,
      teamCount,
    }));
}

function parsePizza(line: string, pizzaId: number): Pizza {
  return {
    id: pizzaId,
    ingredients: line.split(" ").slice(1),
  };
}
