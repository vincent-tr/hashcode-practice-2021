import {
  countTotalPeople,
  countTotalPizzas,
  Dataset,
  Pizza,
} from "../dataset.ts";
import { NumberSet } from "../helpers/number_set.ts";
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
  const ingredients = new NumberSet(10000);
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
      ingredients.clear();
      let ingredientCount = 0;
      for (let personIdx = 0; personIdx < personCount && pizzas; personIdx++) {
        pizzas = deliverPizza(pizzas, ingredients, pizzasToDeliver);
        const pizza = pizzasToDeliver[pizzasToDeliver.length - 1];
        for (const ingredient of pizza.ingredients) {
          if (!ingredients.has(ingredient)) {
            ingredients.add(ingredient);
            ingredientCount++;
          }
        }
      }
      if (pizzasToDeliver.length === personCount) {
        submission.deliveries.push({
          score: ingredientCount * ingredientCount,
          pizzas: pizzasToDeliver,
        });
        progress.progress += pizzasToDeliver.length;
        self.postMessage(progress);
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

function toLinkedList(pizzas: Pizza[]): PizzaNode | null {
  return pizzas
    // TODO Invert the sort and remove the reverse once greedy works
    .sort((a, b) => b.ingredients.length - a.ingredients.length)
    .reverse() // Just to get same result as first implem
    .reduce(
      (pizzaNode, pizza) => ({ pizza, next: pizzaNode }),
      null as PizzaNode | null,
    );
}

function deliverPizza(
  pizzas: PizzaNode,
  ingredients: NumberSet,
  pizzasToDeliver: Pizza[],
): PizzaNode | null {
  let bestPizzaPrevious: PizzaNode | null = null;
  let bestPizza: PizzaNode = null!;
  let highestNewIngredientCount = -1;

  let previous: PizzaNode | null = null;
  let current: PizzaNode | null = pizzas;
  while (current) {
    let newIngredientCount = 0;
    for (const ingredient of current.pizza.ingredients) {
      if (!ingredients.has(ingredient)) {
        newIngredientCount++;
      }
    }
    if (newIngredientCount > highestNewIngredientCount) {
      bestPizzaPrevious = previous;
      bestPizza = current;
      highestNewIngredientCount = newIngredientCount;
    }
    previous = current;
    current = current.next;
  }
  pizzasToDeliver.push(bestPizza.pizza);
  if (bestPizzaPrevious) {
    bestPizzaPrevious.next = bestPizza.next;
    return pizzas;
  } else {
    return bestPizza.next;
  }
}
