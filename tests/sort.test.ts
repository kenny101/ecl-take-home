import { expect, test } from "bun:test";
import { sortOutputsByScoreDescending, type Output } from "../utils";

test("Sorting outputs by score descending", () => {
  const expectedSortedOutput = [
    { score: "95", id: "3" },
    { score: "90", id: "1" },
    { score: "85", id: "4" }
  ];

  const outputs: Output[] = [
    { score: "90", id: "1" },
    { score: "80", id: "2" },
    { score: "95", id: "3" },
    { score: "85", id: "4" },
    { score: "75", id: "5" },
  ];

  const sortedOutputs = sortOutputsByScoreDescending(outputs, 3);

  // Check if the length of the sorted array is correct
  expect(sortedOutputs.length).toBe(3);

  // Check if each element in the sorted array matches the expected output
  for (let i = 0; i < expectedSortedOutput.length; i++) {
    expect(sortedOutputs[i]).toEqual(expectedSortedOutput[i]);
  }
});

test("Sorting outputs by score descending with smaller input array", () => {
  const expectedSortedOutput: Output[] = [
    { score: "95", id: "3" },
    { score: "90", id: "1" },
    { score: "80", id: "2" }
  ];

  const outputs: Output[] = [
    { score: "90", id: "1" },
    { score: "80", id: "2" },
    { score: "95", id: "3" },
  ];

  const sortedOutputs = sortOutputsByScoreDescending(outputs, 5);

  // Check if the length of the sorted array is correct
  expect(sortedOutputs.length).toBe(3);

  // Check if each element in the sorted array matches the expected output
  for (let i = 0; i < expectedSortedOutput.length; i++) {
    expect(sortedOutputs[i]).toEqual(expectedSortedOutput[i]);
  }
});

test("Sorting outputs by score descending with empty input array", () => {
  const outputs: Output[] = [];
  const sortedOutputs = sortOutputsByScoreDescending(outputs, 3);
  expect(sortedOutputs.length).toBe(0);
});