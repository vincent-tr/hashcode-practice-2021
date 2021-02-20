import { getDatasetInfo, readDataset } from "./dataset.ts";
import { solveMinimal } from "./solvers/minimal.ts";
import { getSubmissionInfo, writeSubmission } from "./submission.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
console.table(datasets.map(getDatasetInfo));
const submissions = datasets.map(solveMinimal);
console.table(submissions.map(getSubmissionInfo));
submissions.forEach(writeSubmission);
