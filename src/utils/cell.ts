export class Cell<T> {
  data: T;
  next: Cell<T> | undefined;

  constructor(data: T) {
    this.data = data;
  }

  addToHead(data: T) {
    this.next = new Cell(data);
  }

  static readKeys<T>(key: T[]) {
    const head = new Cell(key[0]);
    let tmp = head as Cell<T> | undefined;
    key.slice(1).forEach((k) => {
      tmp?.addToHead(k);
      tmp = tmp?.next;
    });

    return head;
  }
}
