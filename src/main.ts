import { readDataset } from "./dataset.ts";
import { shuffle } from "./helpers/array_helpers.ts";

const dataset = await readDataset(Deno.args[0]);
console.log("Dataset:", dataset);

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
