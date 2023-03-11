class Node<T> {
  data: T;
  next: Node<T> | undefined;

  constructor(data: T) {
    this.data = data;
  }

  addToHead(data: T) {
    this.next = new Node(data);
  }
}

export class Cell<T> {
  head: Node<T> | undefined;

  constructor(data: T[]) {
    const head = data ? new Node(data[0]) : undefined;
    let tmp = head;
    data.slice(1).forEach((k) => {
      tmp?.addToHead(k);
      tmp = tmp?.next;
    });
    this.head = head;
  }

  delete<T>(node: Node<T>) {
    const nodeStr = JSON.stringify(node);
    let tmp = this.head;

    if (JSON.stringify(tmp) === nodeStr) {
      tmp = tmp?.next;
      this.head = tmp;
    } else {
      while (tmp?.next && JSON.stringify(tmp?.next) !== nodeStr) {
        tmp = tmp.next;
      }
      if (tmp?.next) {
        tmp.next = tmp.next.next;
      }
    }
  }

  static mergeSimple<T>(a: Cell<T>, b: Cell<T>) {
    let currentHead = a.head;

    if (!currentHead) {
      return b;
    }
    while (currentHead.next) {
      currentHead = currentHead.next;
    }
    currentHead.next = b.head;
    return a;
  }
}
