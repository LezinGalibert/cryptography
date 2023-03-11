import { Key } from './rsa';

export class HashCell {
  key: Key;
  val: number;

  constructor(key: Key) {
    this.key = key;
    this.val = 0;
  }
}
