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

export function printProgressBars(
  allProgress: SolverProgress[],
  startTime: number,
) {
  const maxNameLength = Math.max(
    ...allProgress.map((({ name }) => name.length)),
  );
  const elapsedTime = Date.now() - startTime;
  for (const { name, progress, total } of allProgress) {
    const progressRatio = progress / total;
    const remainingSeconds = elapsedTime * (total / progress - 1) / 1000;
    const progressPercent = Math.floor(100 * progressRatio);
    console.log(
      name.padEnd(maxNameLength, " "),
      [
        `${progress}/${total === Infinity ? "-" : total}`,
        remainingSeconds === Infinity ? "--:--" : [
          `${Math.floor(remainingSeconds / 60)}`.padStart(2, "0"),
          `${Math.floor(remainingSeconds % 60)}`.padStart(2, "0"),
        ].join(":"),
      ].join(" ").padStart(25),
      `[${"#".repeat(progressPercent).padEnd(100, "-")}]`,
      `${progressPercent}%`.toString().padStart(4, " "),
    );
  }
}
