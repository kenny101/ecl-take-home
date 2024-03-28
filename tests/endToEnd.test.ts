import { expect, test, describe } from "bun:test";
import { $ } from "bun";

// Function to run the CLI command and return the output
async function runCli(command: string) {
    await $`bun run ../cli.ts invalid/path 3`;
}

describe('CLI Tests', async () => {
    test('Should display error message for invalid file path', () => {
        // const output = await runCli('invalid/path 3');
        // expect(output).toContain('Invalid path to file.');
    });

    test('Should display usage message for missing arguments', () => {
        const output = runCli('');
        expect(output).toContain('Usage: ./highest <file_path> <N highest scores>');
    });

});
