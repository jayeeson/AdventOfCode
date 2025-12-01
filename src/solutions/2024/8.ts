// 1. create a map of locations of unique frequency antennas
// 2.

import {
  Cell,
  getCellDiff,
  getMapSize,
  isInMap,
  Size,
} from '../../helpers/map';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';

export interface AntennaLocations {
  [key: string | number]: Cell[];
}

export interface AntinodeLocations {
  [key: string]: Cell; // Each cell will have key `x-y`
}

export const getAntennaLocations = (lines: string[]): AntennaLocations => {
  const antennaLocations: AntennaLocations = {};

  lines.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      const match = char.match(/[a-zA-Z0-9]/);
      if (match) {
        if (!antennaLocations[char]) {
          antennaLocations[char] = [{ x, y }];
        } else {
          antennaLocations[char].push({ x, y });
        }
      }
    });
  });

  return antennaLocations;
};

export const getAntinodesOfLocations = (
  antenna1: Cell,
  antenna2: Cell,
  mapSize: Size,
  resonance: boolean = false
): Cell[] => {
  const diff = getCellDiff(antenna1, antenna2);
  const antinodes: Cell[] = [];
  for (let i = resonance ? 0 : 1; i <= (resonance ? 100 : 1); ++i) {
    const possibleAntinode1 = {
      x: antenna1.x - diff.x * i,
      y: antenna1.y - diff.y * i,
    };
    if (isInMap(possibleAntinode1, mapSize)) {
      antinodes.push(possibleAntinode1);
    }
  }
  for (let i = resonance ? 0 : 1; i <= (resonance ? 100 : 1); ++i) {
    const possibleAntinode2 = {
      x: antenna2.x + diff.x * i,
      y: antenna2.y + diff.y * i,
    };
    if (isInMap(possibleAntinode2, mapSize)) {
      antinodes.push(possibleAntinode2);
    }
  }
  return antinodes;
};

export const createMapOfAllAntinodeLocations = (
  antennaLocations: AntennaLocations,
  mapSize: Size,
  includeResonance: boolean = false
) => {
  const antinodeLocations: AntinodeLocations = {};

  for (const key in antennaLocations) {
    const antennaLocationsAtFrequencyX = antennaLocations[key];
    antennaLocationsAtFrequencyX.forEach((location, index) => {
      for (let j = 0; j < antennaLocationsAtFrequencyX.length; ++j) {
        if (index === j) {
          continue;
        }
        const antinodes = getAntinodesOfLocations(
          location,
          antennaLocationsAtFrequencyX[j],
          mapSize,
          includeResonance
        );
        antinodes.forEach((an) => {
          const hashKey = `${an.x}-${an.y}`;
          if (hashKey in antinodeLocations) {
            return; // continue
          }
          antinodeLocations[hashKey] = an;
        });
      }
    });
  }
  return antinodeLocations;
};

export const solution8_1 = async () => {
  const input = await readInput('../data/2024/8_input.txt');
  const inputStrings = splitStringAtEOL(input);
  const antennaLocations = getAntennaLocations(inputStrings);
  const mapSize = getMapSize(inputStrings);
  const allAntinodes = createMapOfAllAntinodeLocations(
    antennaLocations,
    mapSize
  );
  return Object.keys(allAntinodes).length;
};

export const solution8_2 = async () => {
  const input = await readInput('../data/2024/8_input.txt');
  const inputStrings = splitStringAtEOL(input);
  const antennaLocations = getAntennaLocations(inputStrings);
  const mapSize = getMapSize(inputStrings);
  const includeResonance = true;
  const allAntinodes = createMapOfAllAntinodeLocations(
    antennaLocations,
    mapSize,
    includeResonance
  );
  return Object.keys(allAntinodes).length;
};
