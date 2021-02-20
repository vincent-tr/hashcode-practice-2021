import { Dataset } from "../dataset.ts";
import { Submission } from "../submission.ts";

export function solveWorker(
  dataset: Dataset,
  solverName: string,
): Promise<Submission> {
  const worker = new Worker(
    new URL(`../solvers/${solverName}.ts`, import.meta.url).href,
    { type: "module" },
  );
  worker.postMessage(dataset);
  return new Promise<Submission>((resolve) => {
    worker.onmessage = (e) => resolve(e.data);
  });
}
