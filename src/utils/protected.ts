import { decryptArray, Key, readKey, writeKey } from './rsa';
import { readSignature, Signature, writeSignature } from './signature';

export type Protected = ReturnType<typeof initProtected>;
export function initProtected(pKey: Key, message: string, signature: Signature) {
  return { pKey, message, signature };
}
export function verifyProtected(prot: Protected) {
  return decryptArray(prot.signature, prot.pKey) === prot.message;
}

export function writeProtected(prot: Protected) {
  return `${writeKey(prot.pKey)} ${prot.message} ${writeSignature(prot.signature)}`;
}

export function readProtected(str: string): Protected {
  const items = str.split(' ');
  return { pKey: readKey(items[0]), message: items[1], signature: readSignature(items[2]) };
}
