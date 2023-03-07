import { encryptString, Key } from './rsa';

export type Signature = ReturnType<typeof initSignature>;
export function initSignature(message: string, sKey: Key) {
  return encryptString(message, sKey);
}

export function writeSignature(sgn: Signature): string {
  return sgn.map((x) => x.toString(16)).join('#');
}

export function readSignature(str: string): Signature {
  return str.split('#').map((s) => parseInt(s, 16));
}
