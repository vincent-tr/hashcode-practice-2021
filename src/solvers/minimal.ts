import { Dataset } from "../dataset.ts";
import { SolverProgress } from "../helpers/solver.ts";
import { Submission } from "../submission.ts";

self.onmessage = ({ data: dataset }: MessageEvent<Dataset>) => {
  const { name } = dataset;
  const submission: Submission = { name, dataset, scans: [] };
  const progress: SolverProgress = {
    name,
    progress: 0,
    total: dataset.libraries.length,
  };

  self.postMessage(progress);

  for (const [index, library] of dataset.libraries.entries()) {
    submission.scans.push({
      library: index,
      books: library.books,
    });

    progress.progress = index;
    self.postMessage(progress);
  }

  progress.progress = dataset.libraries.length;
  self.postMessage(progress);
  self.postMessage(submission);
  self.close();
};
