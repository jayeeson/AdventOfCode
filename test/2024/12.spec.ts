import { Cell, getMapSize } from '../../src/helpers/map';
import { splitStringAtEOL } from '../../src/helpers/readFile';
import {
  findAllDonuts,
  GardenRegionCells,
  getAllRegionInfo,
  getGardenFencePriceInfo,
  recursivelyGetRegionCells,
} from '../../src/solutions/2024/12';
import { it, expect } from 'vitest';

const inputs = [
  {
    input: `AAAA
BBCD
BBCC
EEEC`,
    expectedRegion: {
      A: [{ perimeter: 10, area: 4 }],
      B: [{ perimeter: 8, area: 4 }],
      C: [{ perimeter: 10, area: 4 }],
      D: [{ perimeter: 4, area: 1 }],
      E: [{ perimeter: 8, area: 3 }],
    },
    expectedPriceWithPerimeter: 140,
    expectedPriceWithSides: 80,
  },
  {
    input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
    expectedRegion: {
      E: [{ perimeter: 36, area: 17 }],
      X: [
        { perimeter: 10, area: 4 },
        { perimeter: 10, area: 4 },
      ],
    },
    expectedPriceWithPerimeter: undefined,
    expectedPriceWithSides: 236,
  },
  {
    input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
    expectedRegion: {
      O: [{ perimeter: 36, area: 21 }],
      X: [
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
      ],
    },
    expectedPriceWithPerimeter: 772,
    expectedPriceWithSides: 436,
  },
  {
    input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
    expectedRegion: {
      R: [{ perimeter: 18, area: 12 }],
      I: [
        { perimeter: 22, area: 14 },
        { perimeter: 8, area: 4 },
      ],
      C: [
        { perimeter: 28, area: 14 },
        { perimeter: 4, area: 1 },
      ],
      F: [{ perimeter: 18, area: 10 }],
      V: [{ perimeter: 20, area: 13 }],
      J: [{ perimeter: 20, area: 11 }],
      E: [{ perimeter: 18, area: 13 }],
      M: [{ perimeter: 12, area: 5 }],
      S: [{ perimeter: 8, area: 3 }],
    },
    expectedPriceWithPerimeter: 1930,
    expectedPriceWithSides: 1206,
  },
  {
    input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
    expectedRegion: {
      A: [{ perimeter: 40, area: 28 }],
      B: [
        { perimeter: 8, area: 4 },
        { perimeter: 8, area: 4 },
      ],
    },
    expectedPriceWithPerimeter: 1184,
    expectedPriceWithSides: 368,
  },
  {
    input: `DAAAAC
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
    expectedRegion: {
      A: [{ perimeter: 40, area: 26 }],
      B: [
        { perimeter: 8, area: 4 },
        { perimeter: 8, area: 4 },
      ],
      C: [{ perimeter: 4, area: 1 }],
      D: [{ perimeter: 4, area: 1 }],
    },
    expectedPriceWithPerimeter: 1112,
    expectedPriceWithSides: 456,
  },
  {
    input: `AAAAAA
ABBBBA
ABAABA
ABAABA
ABBBBA
AAAAAA`,
    expectedRegion: {
      A: [
        { perimeter: 40, area: 20 },
        { perimeter: 8, area: 4 },
      ],
      B: [{ perimeter: 24, area: 12 }],
    },
    expectedPriceWithPerimeter: 1120,
    expectedPriceWithSides: 272,
  },

  {
    input: `AAAAAAAA
ABBBBBBA
ABAAAABA
ABACCABA
ABACCABA
ABAAAABA
ABBBBBBA
AAAAAAAA`,
    expectedRegion: {
      A: [
        { perimeter: 56, area: 28 },
        { perimeter: 24, area: 12 },
      ],
      B: [{ perimeter: 40, area: 20 }],
      C: [{ perimeter: 8, area: 4 }],
    },
    expectedPriceWithPerimeter: 2688,
    expectedPriceWithSides: 496,
  },
  {
    input: `BAB
AAA
AAB`,
    expectedRegion: {
      A: [{ perimeter: 12, area: 6 }],
      B: [
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
      ],
    },
    expectedPriceWithPerimeter: 84,
    expectedPriceWithSides: 72,
  },
];

it.each(inputs)(
  'get correct perimeters, areas, prices, %s',
  ({
    input,
    expectedRegion,
    expectedPriceWithPerimeter,
    expectedPriceWithSides,
  }) => {
    const lines = splitStringAtEOL(input);
    const regionInfo = getAllRegionInfo(lines, true);
    expect(regionInfo).toMatchObject(expectedRegion);
    if (expectedPriceWithPerimeter) {
      const totalPriceWithPerimeter = getGardenFencePriceInfo(regionInfo);
      expect(totalPriceWithPerimeter).toBe(expectedPriceWithPerimeter);
    }
    const totalPriceWithSides = getGardenFencePriceInfo(regionInfo, false);
    expect(totalPriceWithSides).toBe(expectedPriceWithSides);
  }
);

it('find all donuts', () => {
  const input = `OOO
OXO
OOO`;
  const lines = splitStringAtEOL(input);
  const position: Cell = { x: 0, y: 0 };
  const characterToFind = lines[position.y][position.x];
  const thisRegion: GardenRegionCells = {};
  const allCells: GardenRegionCells = {};
  const size = getMapSize(lines);
  recursivelyGetRegionCells({
    position,
    size,
    thisRegion,
    allMappedCells: allCells,
    characterToFind: new RegExp(characterToFind),
    shouldContinue: (nextPosition: Cell) => {
      return !lines[nextPosition.y][nextPosition.x].match(characterToFind);
    },
  });
  const allDonuts = findAllDonuts(thisRegion, size);
  expect(allDonuts).toMatchObject([
    {
      tl: { x: 0, y: 0 },
      tr: { x: 2, y: 0 },
      bl: { x: 0, y: 2 },
      br: { x: 2, y: 2 },
    },
  ]);
});
