import { expect, test, describe } from "bun:test";
import { $, type ShellOutput } from "bun";

// Function to run the CLI command and return the shell output (Only works on MacOS / Linux)
// async function runCli(args: string): Promise<ShellOutput> {
//   const command = `bun run cli.ts ${args}`
//   console.log("ran:", command)
//   const result: ShellOutput = await $`${command}`;
//   return result;
// }

describe("CLI Tests", () => {
  test("Should display error message for invalid file path and exit code 1", async () => {
    const output: ShellOutput = await $`bun run cli.ts invalid/path 3`;
    expect(output.stderr.toString()).toBe("Invalid path to file.\n");
    expect(output.exitCode).toBe(1);
  });

  test("Invalid args should display usage message for missing arguments and exit with code 1", async () => {
    const output: ShellOutput = await $`bun run cli.ts ./data/basic.data`;
    expect(output.stderr.toString()).toBe(
      "Usage: ./highest <file_path> <N highest scores>\n"
    );
    expect(output.exitCode).toBe(1);
  });

  test("Invalid JSON in data file should display JSON error message and exit with code 2", async () => {
    const output: ShellOutput = await $`bun run cli.ts ./data/bad_json.data 3`;

    expect(output.stderr.toString()).toBe(
      "Error Parsing JSON: At least one value contains invalid JSON\n"
    );
    expect(output.exitCode).toBe(2);
  });

  test("Missing colon in data file should display error message and exit with code 2", async () => {
    const output: ShellOutput =
      await $`bun run cli.ts ./data/missing_colon.data 3`;
    expect(output.stderr.toString()).toBe(
      "Invalid data format: missing colon separator\n"
    );
    expect(output.exitCode).toBe(2);
  });

  test("Correctly parses basic input file and exit with code 0", async () => {
    const output: ShellOutput = await $`bun run cli.ts ./data/basic.data 3`;
    const expectedSortedOutput = [
      {
        score: "8864076170002432",
        id: "a39307d3-4826-54d5-8e1b-5b7d8994a716",
      },
      {
        score: "7667194055884800",
        id: "32483d86-83cb-5778-811c-156c6854b9c0",
      },
      {
        score: "6348702421614592",
        id: "1fef0dbc-c75b-5959-835f-80e5f15b6da1",
      },
    ];

    expect(output.stderr.toString()).toBe("");
    expect(output.stdout.toString()).toBe(
      JSON.stringify(expectedSortedOutput) + "\n"
    );
    expect(output.exitCode).toBe(0);
  });

  test("Correctly parses input file with new line and exit with code 0", async () => {
    const output: ShellOutput =
      await $`bun run cli.ts ./data/valid_but_has_newline.data 3`;
    const expectedSortedOutput = [
      {
        score: "8864076170002432",
        id: "a39307d3-4826-54d5-8e1b-5b7d8994a716",
      },
      {
        score: "7667194055884800",
        id: "32483d86-83cb-5778-811c-156c6854b9c0",
      },
      {
        score: "6348702421614592",
        id: "1fef0dbc-c75b-5959-835f-80e5f15b6da1",
      },
    ];

    expect(output.stderr.toString()).toBe("");
    expect(output.stdout.toString()).toBe(
      JSON.stringify(expectedSortedOutput) + "\n"
    );
    expect(output.exitCode).toBe(0);
  });

  test("Correctly parses example_input_data_1.data input file and exit with code 0", async () => {
    const output: ShellOutput =
      await $`bun run cli.ts ./data/example_input_data_1.data 3`;

    const expectedSortedOutput = [
      {
        score: "8872929053900800",
        id: "e956fcad-f815-5d0e-bc30-50e64792ab99",
      },
      {
        score: "8864076170002432",
        id: "a39307d3-4826-54d5-8e1b-5b7d8994a716",
      },
      {
        score: "8747967389368320",
        id: "4ad170bf-252c-5c1c-a563-31ddb0770910",
      },
    ];

    expect(output.stderr.toString()).toBe("");
    expect(output.stdout.toString()).toBe(
      JSON.stringify(expectedSortedOutput) + "\n"
    );
    expect(output.exitCode).toBe(0);
  });

  test("Correctly parses example_input_data_2.data input file and exit with code 0", async () => {
    const output: ShellOutput =
      await $`bun run cli.ts ./data/example_input_data_2.data 3`;

    const expectedSortedOutput = [
      {
        score: "9005026213101568",
        id: "a6546eba-9ee4-572c-898a-5dc8fb595502",
      },
      {
        score: "9003802642350080",
        id: "58ded152-9a9e-5f98-a17b-d862043b513f",
      },
      {
        score: "9000580766760960",
        id: "2afece21-09ff-5a4b-aa6a-5e59698be2e0",
      },
    ];
    expect(output.stderr.toString()).toBe("");
    expect(output.stdout.toString()).toBe(
      JSON.stringify(expectedSortedOutput) + "\n"
    );
    expect(output.exitCode).toBe(0);
  });

  test("Correctly parses example_input_data_3.data input file and exit with code 0", async () => {
    const output: ShellOutput =
      await $`bun run cli.ts ./data/example_input_data_3.data 3`;

    const expectedSortedOutput = [
      {
        score: "9007182007762944",
        id: "d1efcfc6-9298-5856-bece-ed4242c36b5d",
      },
      {
        score: "9007125380464640",
        id: "88e23d99-64d7-5939-8a21-e68a637a0566",
      },
      {
        score: "9006994092457984",
        id: "45ad2cf6-9673-523f-a20e-3c31df0e488a",
      },
    ];

    expect(output.stderr.toString()).toBe("");
    expect(output.stdout.toString()).toBe(
      JSON.stringify(expectedSortedOutput) + "\n"
    );
    expect(output.exitCode).toBe(0);
  });
});
