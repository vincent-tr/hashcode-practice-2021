import { getDatasetInfo, readDataset } from "./dataset.ts";
import { SolverProgress } from "./helpers/solver.ts";
import {
  getSubmissionInfo,
  Submission,
  writeSubmission,
} from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
const datasetInfos = datasets.map(getDatasetInfo);
const progressByName: { [name: string]: SolverProgress } = {};
const progressIntervalId = setInterval(printProgress, 1000);
const submissions = await Promise.all(datasets.map(async (dataset) => {
  const worker = new Worker(
    new URL(`./solvers/minimal.ts`, import.meta.url).href,
    { type: "module" },
  );
  worker.postMessage(dataset);
  const submission = await new Promise<Submission>((resolve) => {
    worker.onmessage = (e: MessageEvent<SolverProgress | Submission>) => {
      if ("progress" in e.data) {
        progressByName[e.data.name] = e.data;
      } else {
        resolve(e.data);
      }
    };
  });
  writeSubmission(submission);
  return submission;
}));
clearInterval(progressIntervalId);
printProgress();
console.table(submissions.map(getSubmissionInfo));

function printProgress() {
  // Happens when not all workers have started
  if (Object.keys(progressByName).length < datasets.length) {
    return;
  }
  console.clear();
  console.table(datasetInfos);
  for (const { name, progress, total } of Object.values(progressByName)) {
    if (progress === total) {
      console.log(name, "done");
    } else {
      console.log(name, progress, total);
    }
  }
}
