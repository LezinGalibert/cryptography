import { extendedGCD, modpow, pickLargeNumber } from './math';

// Generates a pair of public and secret keys using the RSA method
export function generateKeyValues(p: number, q: number) {
  const n = p * q;
  const t = (p - 1) * (q - 1);

  let s = pickLargeNumber(0, t);
  while (extendedGCD(s, t).gcd !== 1) {
    s = pickLargeNumber(0, t);
  }
  let { u } = extendedGCD(s, t);
  if (u <= 0) {
    u += t; //Ensures that we always have positif keys
  }
  return { pKey: { s, n }, sKey: { u, n } };
}

export function encryptString(str: string, s: number, n: number) {
  const encodedArray: number[] = [];

  for (let i = 0; i < str.length; i++) {
    encodedArray.push(modpow(str.charCodeAt(i) - 'a'.charCodeAt(0), s, n));
  }
  return encodedArray;
}

export function decryptArray(arr: number[], u: number, n: number) {
  const newArr = arr.map((item) => modpow(item, u, n) + 'a'.charCodeAt(0));
  return newArr.map((item) => String.fromCharCode(item)).join('');
}
