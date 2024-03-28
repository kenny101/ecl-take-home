import { $ } from "bun";

// Function to run the CLI command and return the output
async function runCli(command: string) {
    await $`bun run ../cli.ts invalid/path 3`;
}

await runCli('')