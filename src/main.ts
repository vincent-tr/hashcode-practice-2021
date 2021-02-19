import { getInfo, readDataset } from "./dataset.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
console.table(datasets.map(getInfo));

const submissions = [];
for (const { name, teams, pizzas } of datasets) {
  let pizza = 0;
  const deliveries = [];
  for (const { personCount, teamCount } of teams) {
    for (
      let team = 0;
      team < teamCount && pizza < pizzas.length;
      team++
    ) {
      const delivery = [];
      for (
        let person = 0;
        person < personCount && pizza < pizzas.length;
        person++
      ) {
        delivery.push(pizza++);
      }
      if (delivery.length === personCount) {
        deliveries.push(delivery);
      }
    }
  }
  submissions.push({ name, deliveries });
}

console.table(
  submissions.map(({ name, deliveries }) => ({
    "Submission": name,
    "Deliveries": deliveries.length,
  })),
);
