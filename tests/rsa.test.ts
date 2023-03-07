import { randomPrimeNumberBySize } from '../src/utils/math';
import { decryptArray, encryptString, generateKeyValues, readKey, writeKey } from '../src/utils/rsa';

const p = randomPrimeNumberBySize(3, 7, 5000);
let q = randomPrimeNumberBySize(3, 7, 5000);

while (p === q) {
  q = randomPrimeNumberBySize(3, 7, 5000);
}

const { pKey, sKey } = generateKeyValues(p, q);

it('Verify that decrypting and encrypting are inverse', () => {
  const message = 'Hello';

  expect(decryptArray(encryptString(message, pKey), sKey)).toBe(message);
});

it('Check correct read and write key routines', () => {
  expect(readKey(writeKey(pKey))).toStrictEqual(pKey);
  expect(readKey(writeKey(sKey))).toStrictEqual(sKey);
});
