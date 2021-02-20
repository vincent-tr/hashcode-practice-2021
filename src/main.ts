import { getDatasetInfo, readDataset } from "./dataset.ts";
import {
  getSubmissionInfo,
  Submission,
  writeSubmission,
} from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
console.table(datasets.map(getDatasetInfo));
const submissions = await Promise.all(datasets.map(async (dataset) => {
  const worker = new Worker(
    new URL("./solvers/minimal.ts", import.meta.url).href,
    { type: "module" },
  );
  worker.postMessage(dataset);
  const submission = await new Promise<Submission>((resolve) => {
    worker.onmessage = (e) => resolve(e.data);
  });
  writeSubmission(submission);
  console.log(dataset.name, "done");
  return submission;
}));
console.table(submissions.map(getSubmissionInfo));
