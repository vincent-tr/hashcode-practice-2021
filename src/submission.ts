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
  const submissionDir = getSubmissionDirectory(submission);
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
  const score = getSubmissionScore(submission);
  return {
    "Dataset": `${submission.name}`,
    "Deliveries": submission.deliveries.length,
    "Score": score,
    "Submission file": `${getSubmissionDirectory(submission)}/${score}.out`,
  };
}

function getSubmissionDirectory({ name }: Submission): string {
  return `submission/${name}`;
}

function getSubmissionScore({ deliveries }: Submission): number {
  return deliveries.reduce((score, delivery) => score + delivery.score, 0);
}

function formatDelivery({ pizzas }: Delivery): string {
  return `${pizzas.length} ${pizzas.map(({ id }) => id).join(" ")}`;
}
