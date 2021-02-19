import { getDatasetInfo, Pizza, readDataset } from "./dataset.ts";
import { Delivery, getSubmissionInfo, Submission } from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
console.table(datasets.map(getDatasetInfo));

const submissions: Submission[] = [];
for (const { name, teams, pizzas } of datasets) {
  let pizza = 0;
  const deliveries: Delivery[] = [];
  for (const { personCount, teamCount } of teams) {
    for (
      let team = 0;
      team < teamCount && pizza < pizzas.length;
      team++
    ) {
      const pizzasToDeliver: Pizza[] = [];
      for (
        let person = 0;
        person < personCount && pizza < pizzas.length;
        person++
      ) {
        pizzasToDeliver.push(pizzas[pizza++]);
      }
      if (pizzasToDeliver.length === personCount) {
        deliveries.push({
          score: 0, // TODO Compute score
          pizzas: pizzasToDeliver,
        });
      }
    }
  }
  submissions.push({ name, deliveries });
}

console.table(submissions.map(getSubmissionInfo));
