import { describe, expect, it } from 'vitest';
import { factorial } from '../math';

describe('math', () => {
  it.each([
    { input: 3, output: 6 },
    { input: 5, output: 120 },
  ])('factorial', ({ input, output }) => {
    const result = factorial(input);
    expect(result).toBe(output);
  });
});
