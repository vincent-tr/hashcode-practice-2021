import { getInfo, readDataset } from "./dataset.ts";

const datasets = await Promise.all(Deno.args.map(readDataset));
console.table(datasets.map(getInfo));
