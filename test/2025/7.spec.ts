import { it, describe, expect, test } from 'vitest';
import {
  doTachyonSplit,
  simulateAllBeamSplits,
  simulateAllBeamTimelines,
} from '../../src/solutions/2025/7';
import { splitStringAtEOL } from '../../src/helpers/readFile';

const testData = {
  input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
  expectedSplits: 21,
};

describe('day 7 2025', () => {
  it('should get correct positions of lasers after splitting', () => {
    // 0123456
    // |.||..|
    //+..^.^.^
    // =======
    // ||.|.|.
    const lasers = [0, 2, 3, 6];
    const input = `..^.^.^`;
    const expectedOutput = [0, 1, 3, 5];
    const expectedSplits = 2;

    const { outputLasers, splits } = doTachyonSplit(input, lasers);
    expect(outputLasers).toEqual(expectedOutput);
    expect(splits).toEqual(expectedSplits);
  });

  it('should count total beam splits', () => {
    const map2D = splitStringAtEOL(testData.input);
    const splitCount = simulateAllBeamSplits(map2D);
    expect(splitCount).toBe(21);
  });

  it.each([
    {
      input: testData.input.split('\n').slice(0, 6).join('\n'),
      expectedTimelines: 4,
    },
    { input: testData.input, expectedTimelines: 40 },
  ])('should count tachyon timelines', ({ input, expectedTimelines }) => {
    const map2D = splitStringAtEOL(input);
    const timelineCount = simulateAllBeamTimelines(map2D);
    expect(timelineCount).toBe(expectedTimelines);
  });
});
