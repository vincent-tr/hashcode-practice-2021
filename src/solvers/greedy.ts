import {
  countTotalPeople,
  countTotalPizzas,
  Dataset,
  Pizza,
} from "../dataset.ts";
import { SolverProgress } from "../helpers/solver.ts";
import { Submission } from "../submission.ts";

self.onmessage = async ({ data: dataset }: MessageEvent<Dataset>) => {
  const { name, teams } = dataset;
  const maxPizzaCount = Math.min(
    countTotalPeople(dataset),
    countTotalPizzas(dataset),
  );
  const submission: Submission = { name, deliveries: [] };
  const progress: SolverProgress = { name, progress: 0, total: maxPizzaCount };
  self.postMessage(progress);
  teams.reverse();
  let pizzas = toLinkedList(dataset.pizzas);
  for (const { personCount, teamCount } of teams) {
    // TODO Monte-Carlo on teams order
    for (let teamIdx = 0; teamIdx < teamCount && pizzas; teamIdx++) {
      // Always ends with 3-person + 2-person deliveries
      if (
        dataset.pizzas.length - progress.progress === 5 && personCount === 4
      ) {
        break;
      }
      const pizzasToDeliver: Pizza[] = [];
      const ingredients = new Set<string>();
      for (let personIdx = 0; personIdx < personCount && pizzas; personIdx++) {
        const pizza = pizzas.pizza;
        pizzasToDeliver.push(pizza);
        pizzas = pizzas.next;
        for (const ingredient of pizza.ingredients) {
          ingredients.add(ingredient);
        }
      }
      if (pizzasToDeliver.length === personCount) {
        submission.deliveries.push({
          score: ingredients.size * ingredients.size,
          pizzas: pizzasToDeliver,
        });
        if (teamIdx % 10 === 0) {
          progress.progress += pizzasToDeliver.length;
          self.postMessage(progress);
        }
      } else {
        while (pizzasToDeliver.length) {
          pizzas = {
            pizza: pizzasToDeliver.pop()!,
            next: pizzas,
          };
        }
        break;
      }
    }
  }
  progress.progress = maxPizzaCount;
  self.postMessage(progress);
  self.postMessage(submission);
  self.close();
};

type PizzaNode = {
  pizza: Pizza;
  next: PizzaNode | null;
};

export function toLinkedList(pizzas: Pizza[]): PizzaNode | null {
  return pizzas
    // TODO Invert the sort and remove the reverse once greedy works
    .sort((a, b) => b.ingredients.length - a.ingredients.length)
    .reverse() // Just to get same result as first implem
    .reduce(
      (pizzaNode, pizza) => ({ pizza, next: pizzaNode }),
      null as PizzaNode | null,
    );
}
