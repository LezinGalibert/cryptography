import { randomPrimeNumberBySize } from '../src/utils/math';
import { generateKeyValues } from '../src/utils/rsa';
import { initSignature, readSignature, writeSignature } from '../src/utils/signature';

const p = randomPrimeNumberBySize(3, 7, 5000);
let q = randomPrimeNumberBySize(3, 7, 5000);

while (p === q) {
  q = randomPrimeNumberBySize(3, 7, 5000);
}

const { sKey } = generateKeyValues(p, q);

it('Check correct read and write signature routines', () => {
  const message = 'Hello';
  const sgn = initSignature(message, sKey);

  expect(readSignature(writeSignature(sgn))).toStrictEqual(sgn);
});
