import { createFrequencyMap } from '../../helpers/createFrequencyMap';
import { readInput, readNumbersIntoTwoLists } from '../../helpers/readFile';

export function distances(list1: number[], list2: number[]) {
  const list1_sorted = list1.slice().sort();
  const list2_sorted = list2.slice().sort();

  if (list1_sorted.length !== list2_sorted.length) {
    throw new Error(
      "Expected lengths to be equal, must handle this case if they're not."
    );
  }

  const distances = [];

  for (let i = 0; i < list1_sorted.length; ++i) {
    distances.push(Math.abs(list1_sorted[i] - list2_sorted[i]));
  }
  return distances;
}

// Adds all numbers in an array
export function sumOfArray(numbers: number[]) {
  return numbers.reduce((prev, cur) => {
    return prev + cur;
  }, 0);
}

export async function solution1_1() {
  // get the total distance of sorted arrays
  const input = await readInput('../data/2024/1_input.txt');
  const { list1, list2 } = readNumbersIntoTwoLists(input);
  const d = distances(list1, list2);
  const td = sumOfArray(d);
  return td;
}

export function similarityScores(list1: number[], list2: number[]) {
  if (list1.length !== list2.length) {
    throw new Error(
      "Expected lengths to be equal, must handle this case if they're not."
    );
  }
  const freq2 = createFrequencyMap(list2);
  const scores = list1.map((num, i) => {
    const score = freq2[num] ?? 0;
    return num * score;
  });
  return scores;
}

export async function solution1_2() {
  // get the total distance of sorted arrays
  const input = await readInput('../data/2024/1_input.txt');
  const { list1, list2 } = readNumbersIntoTwoLists(input);
  const scores = similarityScores(list1, list2);
  const scoreSum = sumOfArray(scores);
  return scoreSum;
}
