import { Cell } from './cell';
import { HashCell } from './hashCell';
import { modpow } from './math';
import { Key, writeKey } from './rsa';

export class HashTable {
  table: HashCell[];
  size: number;

  constructor(size: number) {
    this.size = size;
    this.table = Array(size);
  }

  hashFunction(key: Key) {
    return modpow(key.modulus + key.exponent, 2, this.size);
  }

  findPosition(key: Key) {
    const keyStr = writeKey(key);
    let position = this.table.findIndex((hashCell) => hashCell && writeKey(hashCell.key) === keyStr);
    let safetyCount = 0;

    if (position === -1) {
      let hash = this.hashFunction(key);
      while (this.table[hash] && writeKey(this.table[hash].key) !== keyStr && safetyCount < this.size) {
        hash++;
        safetyCount++;
        hash %= this.size;
      }
      if (safetyCount === this.size) {
        return undefined;
      }
      position = hash;
    }
    return position;
  }

  getHashCellForKey(key: Key) {
    const idx = this.findPosition(key);
    return idx !== undefined ? this.table[idx] : undefined;
  }

  updateCellForKey(key: Key) {
    const cell = this.getHashCellForKey(key);
    if (cell) {
      cell.val++;
    }
  }

  findMax() {
    let currMax = 0;
    let idx = 0;

    this.table.forEach((cell, i) => {
      if (cell.val > currMax) {
        currMax = cell.val;
        idx = i;
      }
    });

    return [currMax.toString(), writeKey(this.table[idx].key)];
  }

  initHashTable(keys: Cell<Key>) {
    let head = keys.head;
    while (head) {
      const position = this.findPosition(head.data);
      if (position === undefined) {
        break;
      }
      const hashCell = new HashCell(head.data);
      this.table[position] = hashCell;
      head = head.next;
    }
  }
}
