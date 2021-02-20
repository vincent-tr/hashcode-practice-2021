import { getDatasetInfo, readDataset } from "./dataset.ts";
import { solveWorker } from "./helpers/solver.ts";
import { getSubmissionInfo, writeSubmission } from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
console.table(datasets.map(getDatasetInfo));
const submissions = await Promise.all(datasets.map(async (dataset) => {
  const submission = await solveWorker(dataset, "minimal");
  writeSubmission(submission);
  console.log(dataset.name, "done");
  return submission;
}));
console.table(submissions.map(getSubmissionInfo));
