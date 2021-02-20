import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { exampleDataset } from "./dataset.test.ts";
import { getSubmissionInfo, Submission } from "./submission.ts";

export const exampleSubmission: Submission = {
  name: exampleDataset.name,
  deliveries: [
    {
      score: 16,
      pizzas: [
        exampleDataset.pizzas[1],
        exampleDataset.pizzas[4],
      ],
    },
    {
      score: 49,
      pizzas: [
        exampleDataset.pizzas[0],
        exampleDataset.pizzas[2],
        exampleDataset.pizzas[3],
      ],
    },
  ],
};

Deno.test("getSubmissionInfo", () => {
  assertEquals(getSubmissionInfo(exampleSubmission), {
    "Submission": "a_example",
    "Deliveries": 2,
    "Score": 65,
  });
});
