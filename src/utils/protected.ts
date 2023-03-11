import { Cell } from './cell';
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

export function readProtectedCellList(protList: Protected[]): Cell<Protected> {
  return new Cell(protList);
}

export function writeProtectedCell(prot: Cell<Protected>) {
  let head = prot.head;
  let s = '';
  while (head) {
    s += writeProtected(head.data);
    head = head.next;
  }
  return s;
}

export function sanitizeDeclarations(declarations: Cell<Protected>) {
  let currentHead = declarations.head;
  while (currentHead) {
    if (!verifyProtected(currentHead.data)) {
      const tmp = currentHead;
      declarations.delete(tmp);
    }
    currentHead = currentHead.next;
  }
}
