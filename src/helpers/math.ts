export const alwaysPositiveModulo = (value: number, modulo: number) => {
  return ((value % modulo) + modulo) % modulo;
};

export const addNumbers = (numbers: number[]) =>
  numbers.reduce((acc, cur) => acc + cur, 0);

export const multiplyNumbers = (numbers: number[]) =>
  numbers.reduce((acc, cur) => acc * cur, 1);

export function factorial(input: number) {
  if (input <= 0) {
    throw new Error('cannot factorial <= 0');
  }

  let output = 1;
  for (let i = input; i > 1; --i) {
    output *= i;
  }
  return output;
}
