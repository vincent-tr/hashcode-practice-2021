import { getDatasetInfo, readDataset } from "./dataset.ts";
import {
  printProgressBars,
  SolverProgress,
  solveWorker,
} from "./helpers/solver.ts";
import { getSubmissionInfo, writeSubmission } from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
const datasetInfos = datasets.map(getDatasetInfo);
const allProgress: SolverProgress[] = [];
const intervalId = setInterval(printProgress, 1000);
const startTime = Date.now();
const submissions = await Promise.all(datasets.map(async (dataset) => {
  const [submissionPromise, progress] = solveWorker(dataset, "greedy");
  allProgress.push(progress);
  const submission = await submissionPromise;
  writeSubmission(submission);
  return submission;
}));
clearInterval(intervalId);
printProgress();
console.table(submissions.map(getSubmissionInfo));

function printProgress() {
  console.clear();
  console.table(datasetInfos);
  printProgressBars(allProgress, startTime);
}
