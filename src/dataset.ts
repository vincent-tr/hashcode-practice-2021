import { SEP } from "./deps.ts";
import { trimLines } from "./helpers/string.ts";

export type Dataset = {
  name: string;
  daysCount: number;
  booksScores: number[];
  libraries: Library[];
};

export type Library = {
  signupProcessDays: number;
  booksPerDay: number;
  books: number[];
};

export async function readDataset(inputFilePath: string): Promise<Dataset> {
  const input = await Deno.readTextFile(inputFilePath);
  const [firstLine, secondLine, ...libsLines] = trimLines(input.split("\n"));

  const [booksCount, librariesCount, daysCount] = parseIntegerLine(firstLine);
  const booksScores = parseIntegerLine(secondLine);

  const libraries = new Array<Library>(librariesCount);

  for (let i = 0; i < librariesCount; ++i) {
    const [booksCount, signupProcessDays, booksPerDay] = parseIntegerLine(
      libsLines[i * 2],
    );

    const books = parseIntegerLine(libsLines[i * 2] + 1);

    libraries[i] = { signupProcessDays, booksPerDay, books };
  }

  return {
    name: inputFilePath.split(SEP).pop()!,
    daysCount,
    booksScores,
    libraries,
  };
}

function parseIntegerLine(line: string) {
  return line.split(" ").map(Number);
}

export function getDatasetInfo(dataset: Dataset) {
  return {
    "Dataset": dataset.name,
    "Books": dataset.booksScores.length,
    "Libraries": dataset.libraries.length,
  };
}
