import { randomPrimePairBySize } from '../src/utils/math';
import { initProtected, readProtected, verifyProtected, writeProtected } from '../src/utils/protected';
import { generateKeyValues } from '../src/utils/rsa';
import { initSignature, readSignature, writeSignature } from '../src/utils/signature';

const [p, q] = randomPrimePairBySize(3, 7, 5000);
const { pKey, sKey } = generateKeyValues(p, q);

const message = 'Hello';
const sgn = initSignature(message, sKey);
const prot = initProtected(pKey, message, sgn);

it('Verify that protected signature corresponds to the message encrypted with sKey', () => {
  expect(verifyProtected(prot)).toBeTruthy();

  const falsifiedProt = initProtected(pKey, 'Byebye', sgn);
  expect(verifyProtected(falsifiedProt)).toBeFalsy();
});

it('Check correct read and write protected routines', () => {
  expect(readProtected(writeProtected(prot))).toStrictEqual(prot);
});
