import {
  Cell,
  Direction4Points,
  getMapSize,
  isInMap,
  MapLines,
  Size,
} from '../../helpers/map';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';
import { sumOfArray } from './1';

export interface Trail {
  head: Cell;
  end: Cell;
}

export interface UniqueTrails {
  // key is x-y of trailhead
  [key: string]: {
    [key: string]: {
      trail: Trail; // key is x-y of end
      subTrailCount: number;
    };
  };
}

export const findPossibleTrailheads = (lines: MapLines): Cell[] => {
  const possibleTrailheads: Cell[] = [];
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; ++x) {
      if (line[x] === '0') {
        possibleTrailheads.push({ x, y });
      }
    }
  });
  return possibleTrailheads;
};

export const findAllTrailheads = (
  possibleTrailheads: Cell[],
  lines: MapLines,
  size: Size
): UniqueTrails => {
  const uniqueTrails: UniqueTrails = {};
  possibleTrailheads.forEach((possibleTrail) => {
    recursiveFindFullTrail({
      currentDigit: 0,
      position: possibleTrail,
      direction: undefined,
      head: possibleTrail,
      mapLines: lines,
      size,
      uniqueTrails,
    });
  });
  return uniqueTrails;
};

export const Direction4PointsArray: Readonly<Direction4Points[]> = [
  Direction4Points.NORTH,
  Direction4Points.EAST,
  Direction4Points.SOUTH,
  Direction4Points.WEST,
];

interface recursiveFindFullTrailProps {
  currentDigit: number;
  position: Cell;
  direction: Direction4Points | undefined;
  head: Cell;
  mapLines: MapLines;
  size: Size;
  uniqueTrails: UniqueTrails;
}

export const recursiveFindFullTrail = ({
  currentDigit,
  position,
  direction,
  head,
  mapLines,
  size,
  uniqueTrails,
}: recursiveFindFullTrailProps) => {
  if (currentDigit < 0 || currentDigit > 9) {
    throw new Error('expected a single digit to find');
  }
  if (currentDigit === 9) {
    const uniqueKeyTrailhead = `${head.x}-${head.y}`;
    const uniqueKeyEnd = `${position.x}-${position.y}`;
    if (!(uniqueKeyTrailhead in uniqueTrails)) {
      uniqueTrails[uniqueKeyTrailhead] = {};
    }
    if (!(uniqueKeyEnd in uniqueTrails[uniqueKeyTrailhead])) {
      uniqueTrails[uniqueKeyTrailhead][uniqueKeyEnd] = {
        trail: { head, end: position },
        subTrailCount: 1,
      };
    } else {
      uniqueTrails[uniqueKeyTrailhead][uniqueKeyEnd] = {
        trail: { head, end: position },
        subTrailCount:
          uniqueTrails[uniqueKeyTrailhead][uniqueKeyEnd].subTrailCount + 1,
      };
    }
    return;
  }

  const numberToFindString = (currentDigit + 1).toString();
  for (const newDirection of Direction4PointsArray) {
    if (direction !== undefined) {
      const reverseDirection = (Number(direction) + 2) % 4;
      if (reverseDirection === newDirection) {
        // don't go backwards
        continue;
      }
    }
    let nextPosition: Cell;
    switch (newDirection) {
      case Direction4Points.NORTH:
        nextPosition = { x: position.x, y: position.y - 1 };
        break;
      case Direction4Points.EAST:
        nextPosition = { x: position.x + 1, y: position.y };
        break;
      case Direction4Points.SOUTH:
        nextPosition = { x: position.x, y: position.y + 1 };
        break;
      case Direction4Points.WEST:
        nextPosition = { x: position.x - 1, y: position.y };
        break;
      default:
        throw new Error('impossible direction');
    }

    if (!isInMap(nextPosition, size)) {
      continue;
    }
    if (mapLines[nextPosition.y][nextPosition.x] === numberToFindString) {
      recursiveFindFullTrail({
        currentDigit: currentDigit + 1,
        position: nextPosition,
        direction: newDirection,
        head,
        mapLines,
        size,
        uniqueTrails,
      });
    }
  }
};

export const getTrailheadScores = (trails: UniqueTrails): number[] => {
  const trailHeadsArray = Object.values(trails);
  const scores = trailHeadsArray.map(
    (trailhead) => Object.keys(trailhead).length
  );
  return scores;
};

export const solution10_1 = async (ratingSystem: 1 | 2 = 1) => {
  const input = await readInput('../data/2024/10_input.txt');
  const strings = splitStringAtEOL(input);
  const size = getMapSize(strings);
  const possibleTrailheads = findPossibleTrailheads(strings);
  const trails = findAllTrailheads(possibleTrailheads, strings, size);
  const scores =
    ratingSystem === 1
      ? getTrailheadScores(trails)
      : getTrailheadNewRatingScores(trails);
  const sumOfScores = sumOfArray(scores);
  return sumOfScores;
};

export const getTrailheadNewRatingScores = (trails: UniqueTrails): number[] => {
  const trailHeadsArray = Object.values(trails);
  const scores = trailHeadsArray.map((trailhead) => {
    const trails = Object.values(trailhead);
    const subTrailRatings = trails.map(
      (uniqueTrail) => uniqueTrail.subTrailCount
    );
    return sumOfArray(subTrailRatings);
  });
  return scores;
};

export const solution10_2 = async () => {
  return await solution10_1(2);
};
