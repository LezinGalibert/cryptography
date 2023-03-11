import { Cell } from './cell';
import { Protected, writeProtectedCell } from './protected';
import { Key, writeKey } from './rsa';
import { SHA256, enc } from 'crypto-js';
import { Tree } from './tree';

export class Block {
  author: Key;
  votes: Cell<Protected>;
  hash = '';
  previousHash: string;
  nonce = 0;

  constructor(author: Key, votes: Cell<Protected>, previousHash: string) {
    this.author = author;
    this.votes = votes;
    this.previousHash = previousHash;
  }

  write() {
    return `${writeKey(this.author)}${this.previousHash}${writeProtectedCell(this.votes)}${this.nonce.toString(16)}`;
  }

  updateHash() {
    this.hash = parseInt(SHA256(this.write()).toString(enc.Hex), 16).toString(2).padStart(256, '0');
  }

  verify(d: number) {
    return this.hash.slice(0, d) !== '0'.repeat(d);
  }

  computerProofOfWork(d: number) {
    while (this.verify(4 * d)) {
      this.nonce += 1;
      this.updateHash();
    }
  }

  static getLongestChain(tree: Tree<Block>) {
    let declarations = tree.data.votes;
    let currentChild = tree.firstChild;
    if (!currentChild) {
      return declarations;
    }
    while (currentChild?.firstChild) {
      declarations = Cell.mergeSimple(currentChild.data.votes, declarations);
      currentChild = currentChild.firstChild;
    }
    return Cell.mergeSimple(currentChild?.data.votes, declarations);
  }
}
