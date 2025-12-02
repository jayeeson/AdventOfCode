import { alwaysPositiveModulo } from '../../helpers/alwaysPositiveModulo';
import { readInput } from '../../helpers/readFile';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TensDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TurnDirection = 'L' | 'R';
export type VaultSafeTurn =
  | `${TurnDirection}${Digit}`
  | `${TurnDirection}${TensDigit}${Digit}`
  | `${TurnDirection}${TensDigit}${Digit}${Digit}`;

export function doTurn(start: number, move: VaultSafeTurn): number {
  const direction = move[0];

  const directionNumber = direction == 'L' ? -1 : 1;

  const turnValue = Number(move.substring(1));

  return alwaysPositiveModulo(start + directionNumber * turnValue, 100);
}

export const countNumberOfTimesHitTarget = (
  target: number,
  start: number,
  moves: VaultSafeTurn[]
) => {
  let hitCount = 0;
  let currentPosition = start;
  for (const move of moves) {
    currentPosition = doTurn(currentPosition, move);
    if (currentPosition === target) {
      hitCount += 1;
    }
  }
  return hitCount;
};

export const solution_2025_1_1 = async () => {
  const input = await readInput('../data/2025/1_input.txt');
  const moveList = input.split('\n') as VaultSafeTurn[];

  const target = 0;
  const initialPosition = 50;
  return countNumberOfTimesHitTarget(target, initialPosition, moveList);
};

export const countClickByZero = (start: number, move: VaultSafeTurn) => {
  const direction = move[0];

  const directionNumber = direction == 'L' ? -1 : 1;
  const turnValue = Number(move.substring(1));

  const newPos = alwaysPositiveModulo(start + directionNumber * turnValue, 100);

  const epsilon = 1e-5;
  const fullRotations = Math.trunc((turnValue + epsilon) / 100.0);

  const getPasses = () => {
    if (directionNumber === 1) {
      if (start > newPos && newPos !== 0) {
        return fullRotations + 1;
      }
      return fullRotations;
    }

    if (start < newPos && start !== 0) {
      return fullRotations + 1;
    }
    return fullRotations;
  };

  const passes = getPasses();

  // don't double count a full revolution that starts and ends at 0
  if (newPos === 0 && start === 0) {
    return Math.max(passes - 1, 0);
  }

  return passes;
};

export const countAllClickByZeros = (start: number, moves: VaultSafeTurn[]) => {
  let currentPosition = start;
  let totalClickByCount = 0;
  for (const move of moves) {
    const clickByCount = countClickByZero(currentPosition, move);
    currentPosition = doTurn(currentPosition, move);

    const isAtTarget = currentPosition === 0;
    const clicksThisTurn = clickByCount + (isAtTarget ? 1 : 0);
    totalClickByCount += clicksThisTurn;
  }
  return totalClickByCount;
};

export const solution_2025_1_2 = async () => {
  const input = await readInput('../data/2025/1_input.txt');
  const moveList = input.split('\n') as VaultSafeTurn[];
  return countAllClickByZeros(50, moveList);
};
