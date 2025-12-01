import {
  distances,
  similarityScores,
  sumOfArray,
} from '../../src/solutions/2024/1';

const list1 = [3, 4, 2, 1, 3, 3];
const list2 = [4, 3, 5, 3, 9, 3];

test('list returns right distance for each', () => {
  const d = distances(list1, list2);
  expect(d).toEqual([2, 1, 0, 1, 2, 5]);
});

test('list returns correct added distances', () => {
  const d = distances(list1, list2);
  const td = sumOfArray(d);
  expect(td).toBe(11);
});

test('list returns right similarity scores', () => {
  const expected = [9, 4, 0, 0, 9, 9];
  const scores = similarityScores(list1, list2);
  expect(scores).toStrictEqual(expected);
});
