import { randomPrimeNumberBySize, randomPrimePairBySize } from '../src/utils/math';
import { generateKeyValues } from '../src/utils/rsa';
import { initSignature, readSignature, writeSignature } from '../src/utils/signature';

const [p, q] = randomPrimePairBySize(3, 7, 5000);
const { sKey } = generateKeyValues(p, q);

it('Check correct read and write signature routines', () => {
  const message = 'Hello';
  const sgn = initSignature(message, sKey);

  expect(readSignature(writeSignature(sgn))).toStrictEqual(sgn);
});
