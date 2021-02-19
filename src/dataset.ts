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

export function parseTeams(line: string): Team[] {
  return line.split(" ")
    .slice(1)
    .map(Number)
    .map((teamCount, i) => ({
      peopleCount: i + 2,
      teamCount,
    }));
}

export function parsePizza(line: string, pizzaId: number): Pizza {
  return {
    id: pizzaId,
    ingredients: line.split(" ").slice(1),
  };
}

export function sanitize(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter((line) => !!line);
}
