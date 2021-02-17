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

console.log(
  "Deliveries:",
  deliveries.map((delivery) =>
    `Team of ${delivery[0]}: ${delivery.slice(1).join(" ")}`
  ),
);

function shuffle(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
