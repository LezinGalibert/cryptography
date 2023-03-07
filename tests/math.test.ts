import { extendedGCD, isMillerPrime } from '../src/utils/math';

it('Miller prime tests', () => {
  expect(isMillerPrime(2, 1)).toBe(true);
  expect(isMillerPrime(25, 3)).toBe(false);
  expect(isMillerPrime(23, 4)).toBe(true);
});

it('Extended GCD calculation checks', () => {
  expect(extendedGCD(35, 15)).toStrictEqual({ gcd: 5, u: 1, v: -2 });
  expect(extendedGCD(43, 20)).toStrictEqual({ gcd: 1, u: 7, v: -15 });
  expect(extendedGCD(67, 67)).toStrictEqual({ gcd: 67, u: 1, v: 0 });
});
