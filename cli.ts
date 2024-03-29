import { parseArgs } from "util";
import {
  readFileLineByLine,
  type Output,
  sortOutputsByScoreDescending,
} from "./utils";

const { positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    flag1: {
      type: "boolean",
    },
    flag2: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

// Extract the pathname and K from command-line arguments
const [filePath, K] = positionals;

if (!filePath || !K) {
  console.error("Usage: ./highest <file_path> <N highest scores>");
  process.exit(1);
}

const file = Bun.file(filePath);
const fileExists = await file.exists();
if (!fileExists) {
  console.error("Invalid path to file.");
  process.exit(1);
}

// O(N) Space Complexity
const output: Output[] = await readFileLineByLine(filePath);

// N log K Time Complexity
const sortedOutput: Output[] = sortOutputsByScoreDescending(
  output,
  parseInt(K, 10)
);

console.log(JSON.stringify(sortedOutput));
process.exit(0);
