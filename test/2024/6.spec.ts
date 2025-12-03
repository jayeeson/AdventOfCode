import { Direction4Points } from '../../src/helpers/map';
import { splitStringAtEOL } from '../../src/helpers/readFile';
import {
  countNumberFinalGuardPositions,
  drawMaxLinePath,
  findNextObstacleOrExitAndUpdateMap,
  findNumberOfLoopablePositions,
  getGuardPosition,
  inferDirection,
  solution6_2,
} from '../../src/solutions/2024/6';
import { fail } from '../helpers/testUtils';
import { it, expect } from 'vitest';

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const expectedPathAtExit = `....#.....
....XXXXX#
....X...X.
..#.X...X.
..XXXXX#X.
..X.X.X.X.
.#XXXXXXX.
.XXXXXXX#.
#XXXXXXX..
......#X..`;
const expectedNumberDistinctPositions = 41;

it("can find guard's position", () => {
  const lines = splitStringAtEOL(testInput);
  const position = getGuardPosition(lines);
  expect(position).toMatchObject({ x: 4, y: 6 });
});

it("can infer guard's starting direction", () => {
  const lines = splitStringAtEOL(testInput);
  const position = getGuardPosition(lines);
  expect(position).not.toBeNull();
  const startingDirection = inferDirection(position, lines);
  expect(startingDirection).toBe(Direction4Points.NORTH);
});

it('can get max position before hitting an obstacle', () => {
  const lines = splitStringAtEOL(testInput);
  const position = getGuardPosition(lines);
  const startingDirection = inferDirection(position, lines);
  if (position && startingDirection !== null) {
    const nextPosition = findNextObstacleOrExitAndUpdateMap(
      startingDirection,
      position,
      lines
    );
    expect(nextPosition).toMatchObject({ position: { x: 4, y: 1 } });
  } else {
    fail("wasn't supposed to be null");
  }
  const mapAfterHittingObstacle = `....#.....
....X....#
....X.....
..#.X.....
....X..#..
....X.....
.#..X.....
........#.
#.........
......#...`;
  const expectedNewMap = splitStringAtEOL(mapAfterHittingObstacle);

  expect(lines).toEqual(expectedNewMap);
});

it.each([
  { input: testInput, expected: expectedPathAtExit, numPositions: 41 },
  { input: `.<.`, expected: 'XX.', numPositions: 2 },
  { input: '.\nv\n.', expected: '.\nX\nX', numPositions: 2 },
  { input: `.\n^\n.`, expected: 'X\nX\n.', numPositions: 2 },
  { input: `.>.`, expected: '.XX', numPositions: 2 },
])('can chart path until exit, %s', ({ input, expected, numPositions }) => {
  const lines = splitStringAtEOL(input);
  const drawMaxLinePathOutput = drawMaxLinePath(lines);
  const expectedFinalPathLines = splitStringAtEOL(expected);
  expect(lines).toEqual(expectedFinalPathLines);
  expect(drawMaxLinePathOutput?.exit).toBe(true);
  const numberPositions = countNumberFinalGuardPositions(lines);
  expect(numberPositions).toBe(numPositions);
  expect;
});

it('can count total loopable positions with addition of single obstacle', () => {
  const lines = splitStringAtEOL(testInput);
  const numberLoops = findNumberOfLoopablePositions(lines);
  expect(numberLoops).toBe(6);
});

it('handles a corner ok', () => {
  const input = `..#..
.#.#.
.....
..^..`;
  const lines = splitStringAtEOL(input);
  drawMaxLinePath(lines);
  const expectedPathAtExit = `..#..
.#X#.
..X..
..X..`;
  const expectedFinalPathLines = splitStringAtEOL(expectedPathAtExit);
  expect(lines).toEqual(expectedFinalPathLines);
  const numberPositions = countNumberFinalGuardPositions(lines);
  expect(numberPositions).toBe(3);
});
