import { randomPrimeNumberBySize } from '../src/utils/math';
import { decryptArray, encryptString, generateKeyValues } from '../src/utils/rsa';

it('Verify that decrypting and encrypting are inverse', () => {
  const p = randomPrimeNumberBySize(3, 7, 5000);
  let q = randomPrimeNumberBySize(3, 7, 5000);

  while (p === q) {
    q = randomPrimeNumberBySize(3, 7, 5000);
  }

  const { pKey, sKey } = generateKeyValues(p, q);
  const message = 'Hello';

  expect(decryptArray(encryptString(message, pKey.s, pKey.n), sKey.u, sKey.n)).toBe(message);
});
