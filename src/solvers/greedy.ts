import {
  countTotalPeople,
  countTotalPizzas,
  Dataset,
  Pizza,
} from "../dataset.ts";
import { SolverProgress } from "../helpers/solver.ts";
import { Submission } from "../submission.ts";

self.onmessage = async ({ data: dataset }: MessageEvent<Dataset>) => {
  const { name, teams, pizzas } = dataset;
  const maxPizzaCount = Math.min(
    countTotalPeople(dataset),
    countTotalPizzas(dataset),
  );
  const submission: Submission = { name, deliveries: [] };
  const progress: SolverProgress = { name, progress: 0, total: maxPizzaCount };
  self.postMessage(progress);
  teams.sort((a, b) => b.personCount - a.personCount);
  pizzas.sort((a, b) => b.ingredients.length - a.ingredients.length);
  let pizzaIdx = 0;
  for (const { personCount, teamCount } of teams) {
    for (
      let teamIdx = 0;
      teamIdx < teamCount && pizzaIdx < pizzas.length &&
      personCount <= pizzas.length - pizzaIdx;
      teamIdx++
    ) {
      // TODO Monte-Carlo on teams order
      // Always ends with 3-person + 2-person deliveries
      if (
        pizzas.length - pizzaIdx === 5 &&
        personCount === 4
      ) {
        break;
      }
      const pizzasToDeliver: Pizza[] = [];
      const ingredients = new Set<string>();
      for (
        let personIdx = 0;
        personIdx < personCount && pizzaIdx < pizzas.length;
        personIdx++
      ) {
        // Uncomment next line to simulate long processing
        // await new Promise((resolve) => setTimeout(resolve));

        const pizza = pizzas[pizzaIdx++];
        pizzasToDeliver.push(pizza);
        for (const ingredient of pizza.ingredients) {
          ingredients.add(ingredient);
        }
      }
      if (pizzasToDeliver.length === personCount) {
        submission.deliveries.push({
          score: ingredients.size * ingredients.size,
          pizzas: pizzasToDeliver,
        });
      } else {
        pizzaIdx -= pizzasToDeliver.length;
      }
      if (teamIdx % 10 === 0) {
        progress.progress = pizzaIdx;
        self.postMessage(progress);
      }
    }
  }
  progress.progress = maxPizzaCount;
  self.postMessage(progress);
  self.postMessage(submission);
  self.close();
};
