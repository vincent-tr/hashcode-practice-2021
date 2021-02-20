import { Pizza } from "../dataset.ts";
import { Delivery } from "../submission.ts";

self.onmessage = async ({ data: { name, teams, pizzas } }) => {
  let pizzaIdx = 0;
  const deliveries: Delivery[] = [];
  for (const { personCount, teamCount } of teams) {
    for (
      let teamIdx = 0;
      teamIdx < teamCount && pizzaIdx < pizzas.length;
      teamIdx++
    ) {
      const pizzasToDeliver: Pizza[] = [];
      const ingredients = new Set<string>();
      for (
        let personIdx = 0;
        personIdx < personCount && pizzaIdx < pizzas.length;
        personIdx++
      ) {
        // Uncomment next line to Simulate long processing
        // await new Promise((resolve) => setTimeout(resolve, 10));

        const pizza = pizzas[pizzaIdx++];
        pizzasToDeliver.push(pizza);
        for (const ingredient of pizza.ingredients) {
          ingredients.add(ingredient);
        }
      }
      if (pizzasToDeliver.length === personCount) {
        deliveries.push({
          score: ingredients.size * ingredients.size,
          pizzas: pizzasToDeliver,
        });
      } else {
        pizzaIdx -= pizzasToDeliver.length;
      }
    }
  }
  self.postMessage({ name, deliveries });
  self.close();
};
