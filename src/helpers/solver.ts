import { Dataset } from "../dataset.ts";
import { Submission } from "../submission.ts";

export type SolverProgress = {
  name: string;
  progress: number;
  total: number;
};

// TODO Update or remove
// export function solveWorker(
//   dataset: Dataset,
//   solverName: string,
// ): Promise<Submission> {
//   const worker = new Worker(
//     new URL(`../solvers/${solverName}.ts`, import.meta.url).href,
//     { type: "module" },
//   );
//   worker.postMessage(dataset);
//   return new Promise<Submission>((resolve) => {
//     worker.onmessage = (e: MessageEvent<SolverProgress | Submission>) => {
//       if ("progress" in e.data) {
//         console.log("Progress", e.data.name, e.data.progress, e.data.total);
//       } else {
//         resolve(e.data);
//       }
//     };
//   });
// }
