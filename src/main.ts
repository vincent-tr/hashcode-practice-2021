import { getDatasetInfo, readDataset } from "./dataset.ts";
import { SolverProgress, solveWorker } from "./helpers/solver.ts";
import {
  getSubmissionInfo,
  Submission,
  writeSubmission,
} from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
const datasetInfos = datasets.map(getDatasetInfo);
const allProgress: SolverProgress[] = [];
const intervalId = setInterval(printProgress, 1000);
const submissions = await Promise.all(datasets.map(async (dataset) => {
  const [submissionPromise, progress] = solveWorker(dataset, "minimal");
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
  const maxNameLength = Math.max(
    ...allProgress.map((({ name }) => name.length)),
  );
  for (const { name, progress, total } of allProgress) {
    const percent = Math.floor(100 * progress / total);
    console.log(
      name.padEnd(maxNameLength, " "),
      `${progress}/${total === Infinity ? "" : total}`.padStart(15, " "),
      `[${"#".repeat(percent).padEnd(100, "-")}]`,
      `${percent}%`.toString().padStart(4, " "),
    );
  }
}
