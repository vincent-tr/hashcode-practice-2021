import { Dataset } from "../dataset.ts";
import { Submission } from "../submission.ts";

export type SolverProgress = {
  name: string;
  progress: number;
  total: number;
};

export function solveWorker(
  dataset: Dataset,
  solverName: string,
): [Promise<Submission>, SolverProgress] {
  const worker = new Worker(
    new URL(`../solvers/${solverName}.ts`, import.meta.url).href,
    { type: "module" },
  );
  worker.postMessage(dataset);
  const progress: SolverProgress = {
    name: dataset.name,
    progress: 0,
    total: Infinity,
  };
  return [
    new Promise<Submission>((resolve) => {
      worker.onmessage = (e: MessageEvent<SolverProgress | Submission>) => {
        if ("progress" in e.data) {
          progress.name = e.data.name;
          progress.progress = e.data.progress;
          progress.total = e.data.total;
        } else {
          resolve(e.data);
        }
      };
    }),
    progress,
  ];
}
