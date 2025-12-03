import {
  countNumberOfTimesHitTarget,
  doTurn,
  VaultSafeTurn,
  countAllClickByZeros,
} from '../../src/solutions/2025/1';
import { it, expect } from 'vitest';

const DEBUG = false;

const test_data = {
  initialPosition: 50,
  moves: [
    { move: 'L68', expectedPosition: 82, clickBys: 1 },
    { move: 'L30', expectedPosition: 52, clickBys: 1 },
    { move: 'R48', expectedPosition: 0, clickBys: 2 },
    { move: 'L5', expectedPosition: 95, clickBys: 2 },
    { move: 'R60', expectedPosition: 55, clickBys: 3 },
    { move: 'L55', expectedPosition: 0, clickBys: 4 },
    { move: 'L1', expectedPosition: 99, clickBys: 4 },
    { move: 'L99', expectedPosition: 0, clickBys: 5 },
    { move: 'R14', expectedPosition: 14, clickBys: 5 },
    { move: 'L82', expectedPosition: 32, clickBys: 6 },
  ],
};

it.each<{ start: number; move: VaultSafeTurn; expected: number }>([
  { start: 0, move: 'L1', expected: 99 },
  { start: 0, move: 'R1', expected: 1 },
  { start: 99, move: 'R1', expected: 0 },
  { start: 0, move: 'L100', expected: 0 },
  { start: 0, move: 'L101', expected: 99 },
])(
  'should point to the correct number after a single turn',
  ({ start, move, expected }) => {
    const result = doTurn(start, move);
    expect(result).toBe(expected);
  }
);

it('should point to the correct number after a series of turns', () => {
  const start = test_data.initialPosition;
  let currentPosition = start;
  for (const { move, expectedPosition } of test_data.moves) {
    const result = doTurn(currentPosition, move as VaultSafeTurn);
    expect(result).toBe(expectedPosition);
    currentPosition = expectedPosition;
  }
});

it('should return number of times it finished at 0', () => {
  const hitCount = countNumberOfTimesHitTarget(
    0,
    test_data.initialPosition,
    test_data.moves.map((m) => m.move as VaultSafeTurn)
  );
  expect(hitCount).toBe(3);
});

// part 2

// click at 0: going from 99 to 1, it does click past 0.
it.each([
  { start: 99, move: 'R2', expected: 1 },
  { start: 99, move: 'R102', expected: 2 },
  { start: 0, move: 'R100', expected: 1 },
  { start: 0, move: 'R200', expected: 2 },
  { start: 1, move: 'L2', expected: 1 },
  { start: 1, move: 'L102', expected: 2 },
  { start: 0, move: 'L100', expected: 1 },
  { start: 0, move: 'L200', expected: 2 },
  { start: 0, move: 'L1', expected: 0 },
  { start: 0, move: 'R1', expected: 0 },
  { start: 0, move: 'R101', expected: 1 },
  { start: 0, move: 'L101', expected: 1 },
  { start: 50, move: 'R99', expected: 1 },
  { start: 50, move: 'R199', expected: 2 },
  { start: 50, move: 'R999', expected: 10 },
  { start: 2, move: 'L1', expected: 0 },
  { start: 75, move: 'R25', expected: 1 },
  { start: 75, move: 'R99', expected: 1 },
  { start: 75, move: 'R125', expected: 2 },
  { move: 'L68', start: 50, expected: 1 },
  { move: 'L30', start: 82, expected: 0 },
  { move: 'R48', start: 52, expected: 1 },
  { move: 'L5', start: 0, expected: 0 },
  { move: 'R60', start: 95, expected: 1 },
  { move: 'L55', start: 55, expected: 1 },
  { move: 'L1', start: 0, expected: 0 },
  { move: 'L99', start: 99, expected: 1 },
  { move: 'R14', start: 0, expected: 0 },
  { move: 'L82', start: 14, expected: 1 },
])(
  'should return number of times clicked at 0 for single turn, %s',
  ({ start, move, expected }) => {
    const totalClickByCount = countAllClickByZeros(start, [
      move,
    ] as VaultSafeTurn[]);
    expect(totalClickByCount).toBe(expected);
  }
);

it('should return number of times clicked at 0 for full suite', () => {
  const moves = test_data.moves.map((m) => m.move as VaultSafeTurn);
  const totalClickByCount = countAllClickByZeros(50, moves);
  expect(totalClickByCount).toBe(6);
});
