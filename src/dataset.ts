import { parsePizza, Pizza } from "./pizza.ts";
import { parseTeams, Team } from "./team.ts";

export type Dataset = {
  teams: Team[];
  pizzas: Pizza[];
};

export async function readDataset(inputFilePath: string): Promise<Dataset> {
  const input = await Deno.readTextFile(inputFilePath);

  const [teamsLine, ...pizzasLines] = input.split("\n")
    .map((line) => line.trim())
    .filter((line) => !!line);

  return {
    teams: parseTeams(teamsLine),
    pizzas: pizzasLines.map(parsePizza),
  };
}
