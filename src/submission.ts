import { Pizza } from "./dataset.ts";

export type Submission = {
  name: string;
  deliveries: Delivery[];
};

export type Delivery = {
  score: number;
  pizzas: Pizza[];
};

export function getSubmissionInfo({ name, deliveries }: Submission) {
  return {
    "Submission": name,
    "Deliveries": deliveries.length,
    "Score": deliveries.reduce((score, delivery) => score + delivery.score, 0),
  };
}
