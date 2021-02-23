import { Dataset } from "./dataset.ts";

export type Submission = {
  name: string;
  dataset: Dataset;
  scans: LibraryScan[];
};

export type LibraryScan = {
  library: number;
  books: number[];
};

export async function writeSubmission(submission: Submission) {
  const submissionDir = getSubmissionDirectory(submission);
  try {
    await Deno.mkdir(submissionDir, { recursive: true });
  } catch {
    // Submission directory already exists
  }
  const fileName = `${getSubmissionScore(submission)}.out`;
  const lines = [`${submission.scans.length}`];

  for (const scan of submission.scans) {
    lines.push(`${scan.library} ${scan.books.length}`);
    lines.push(scan.books.join(" "));
  }

  await Deno.writeTextFile(`${submissionDir}/${fileName}`, lines.join("\n"));
}

export function getSubmissionInfo(submission: Submission) {
  const score = getSubmissionScore(submission);
  return {
    "Dataset": `${submission.name}`,
    "Scans": submission.scans.length,
    "Score": score,
    "Submission file": `${getSubmissionDirectory(submission)}/${score}.out`,
  };
}

function getSubmissionDirectory({ name }: Submission): string {
  return `submission/${name}`;
}

function getSubmissionScore(submission: Submission): number {
  const bookIds = new Set<number>();
  for (const scan of submission.scans) {
    for (const book of scan.books) {
      bookIds.add(book);
    }
  }

  let score = 0;
  for (const book of bookIds) {
    score += submission.dataset.booksScores[book];
  }

  return score;
}
