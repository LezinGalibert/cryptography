import { Cell } from './cell';
import { Protected, writeProtectedCell } from './protected';
import { Key, writeKey } from './rsa';
import { SHA256, enc } from 'crypto-js';
import { TreeNode } from './treeNode';

export class Block {
  author: Key;
  votes: Cell<Protected>;
  hash = '';
  previousHash = '';
  nonce = 0;

  constructor(author: Key, votes: Cell<Protected>) {
    this.author = author;
    this.votes = votes;
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

  initialize(previousBlock?: Block) {
    this.previousHash = previousBlock?.hash ?? '';
    this.computerProofOfWork(2);
  }

  static getLongestChain(tree: TreeNode<Block>) {
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
