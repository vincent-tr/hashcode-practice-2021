import { MultiProgressBar } from "https://deno.land/x/progress@v1.2.3/mod.ts";
import {
  countTotalIngredients,
  countTotalPizzas,
  countTotalTeams,
  readDataset,
} from "./dataset.ts";
import { shuffle } from "./helpers/array.ts";

if (Deno.args.length === 0) {
  const stats = [];
  for await (const inputFile of Deno.readDir("input")) {
    const dataset = await readDataset(`input/${inputFile.name}`);
    stats.push({
      "Input": inputFile.name,
      "Teams": countTotalTeams(dataset),
      "Pizzas": countTotalPizzas(dataset),
      "Ingredients": countTotalIngredients(dataset),
    });
  }
  stats.sort(({ "Input": a }, { "Input": b }) => a.localeCompare(b));
  console.table(stats);

  const maxInputFileNameLength = Math.max(
    ...stats.map((stat) => stat.Input.length),
  );
  for (const stat of stats) {
    stat.Input = stat.Input.padEnd(maxInputFileNameLength);
  }
  const progressBars = new MultiProgressBar({
    complete: "#",
    incomplete: "-",
    width: 50 - maxInputFileNameLength,
    display: ":text [:bar] :percent :time :completed/:total",
  });
  for (let i = 0; i < 100000; i += 500) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const progress = [];
    for (const stat of stats) {
      progress.push({
        completed: Math.min(i, stat.Pizzas),
        total: stat.Pizzas,
        text: stat.Input,
      });
    }
    progressBars.render(progress);
  }
  console.log();
  Deno.exit(0);
}

const dataset = await readDataset(Deno.args[0]);

console.log(countTotalTeams(dataset), "total teams");
console.log(countTotalPizzas(dataset), "total pizzas");
console.log(countTotalIngredients(dataset), "total ingredients");

const teamSizes = [2, 3, 4];

const [inputFilePath] = Deno.args;
const input = await Deno.readTextFile(inputFilePath);
const lines = input.split("\n")
  .map((line) => line.trim())
  .filter((line) => !!line);

const [_, ...teamCounts] = lines[0].split(" ").map(Number);
const ingredientsByPizza = lines.slice(1).map((line) =>
  line.split(" ").slice(1)
);

console.log(
  "Teams:",
  teamCounts
    .map((teamCount, i) => `${teamCount} team(s) of ${teamSizes[i]}`)
    .join(", "),
);
console.log("Pizzas:", ingredientsByPizza);

const peopleCount = teamCounts.reduce(
  (count, teamCount, i) => count + teamCount * teamSizes[i],
  0,
);

console.log("Pizza count:", ingredientsByPizza.length);
console.log("People count:", peopleCount);

const pizzas = shuffle(
  Array.from({ length: ingredientsByPizza.length }, (_, pizza) => pizza),
);

const deliveries: number[][] = [];
let pizzaIndex = 0;
let remainingPizzaCount = pizzas.length - pizzaIndex;
let minTeamSize = Math.min(teamSizes[0]);
while (remainingPizzaCount >= minTeamSize) {
  let team = -1;
  do {
    team = Math.floor(Math.random() * 3);
  } while (teamCounts[team] === 0 || teamSizes[team] > remainingPizzaCount);
  const teamSize = teamSizes[team];
  const delivery = [teamSize];
  for (let i = 0; i < teamSize; i++) {
    delivery.push(pizzas[pizzaIndex++]);
  }
  deliveries.push(delivery);
  remainingPizzaCount = pizzas.length - pizzaIndex;
  if (--teamCounts[team] === 0) {
    minTeamSize = teamSizes[teamCounts.findIndex((teamCount) => teamCount)];
  }
}

const scores: number[] = [];

for (const delivery of deliveries) {
  const ingredients = new Set();
  for (const pizza of delivery.slice(1)) {
    for (const ingredient of ingredientsByPizza[pizza]) {
      ingredients.add(ingredient);
    }
  }
  const score = ingredients.size * ingredients.size;
  scores.push(score);
}

console.log(
  "Deliveries:",
  deliveries.map((delivery, i) =>
    `Team of ${delivery[0]}: ${delivery.slice(1).join(" ")} (score ${
      scores[i]
    })`
  ),
);

console.log("Total score:", scores.reduce((sum, score) => sum + score, 0));
