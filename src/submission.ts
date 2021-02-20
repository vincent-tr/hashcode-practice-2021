import { Pizza } from "./dataset.ts";

export type Submission = {
  name: string;
  deliveries: Delivery[];
};

export type Delivery = {
  score: number;
  pizzas: Pizza[];
};

export async function writeSubmission(submission: Submission) {
  const submissionDir = `submission/${submission.name}`;
  try {
    await Deno.mkdir(submissionDir, { recursive: true });
  } catch {
    // Submission directory already exists
  }
  const fileName = `${getSubmissionScore(submission)}.out`;
  const lines = [
    `${submission.deliveries.length}`,
    ...submission.deliveries.map(formatDelivery),
  ];
  await Deno.writeTextFile(`${submissionDir}/${fileName}`, lines.join("\n"));
}

export function getSubmissionInfo(submission: Submission) {
  return {
    "Submission": submission.name,
    "Deliveries": submission.deliveries.length,
    "Score": getSubmissionScore(submission),
  };
}

function getSubmissionScore({ deliveries }: Submission): number {
  return deliveries.reduce((score, delivery) => score + delivery.score, 0);
}

function formatDelivery({ pizzas }: Delivery): string {
  return `${pizzas.length} ${pizzas.map(({ id }) => id).join(" ")}`;
}
