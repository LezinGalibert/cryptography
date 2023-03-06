import { increment, isMillerPrime } from '../src/utils/math';

it('Increment by 1, 3, 19', () => {
  const value = 27;
  expect(increment(value)).toBe(28);
  expect(increment(value, 3)).toBe(30);
  expect(increment(value, 19)).toBe(46);
});

it('Miller prime tests', () => {
  expect(isMillerPrime(2, 1)).toBe(true);
  expect(isMillerPrime(25, 3)).toBe(false);
  expect(isMillerPrime(23, 4)).toBe(true);
});
