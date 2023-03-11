export class Tree<T> {
  data: T;
  father: Tree<T> | undefined;
  firstChild: Tree<T> | undefined;
  nextBrother: Tree<T> | undefined;
  height = 0;

  constructor(data: T) {
    this.data = data;
  }

  updateHeight(child: Tree<T>) {
    const h = this.height;
    this.height = Math.max(h, child.height + 1);
    return h === this.height;
  }

  addChild(child: Tree<T>) {
    let currentChild = this.firstChild;
    child.father = this;
    if (!currentChild) {
      this.firstChild = child;
    } else {
      while (currentChild.nextBrother) {
        currentChild = currentChild?.nextBrother;
      }
      currentChild.nextBrother = child;
    }
    this.updateHeight(child);
  }

  highestChild() {
    let currentChild = this.firstChild;
    let max = 0;
    let maxHeightChild = currentChild;
    while (currentChild) {
      if (max < currentChild.height) {
        max = currentChild.height;
        maxHeightChild = currentChild;
      }
      currentChild = currentChild.nextBrother;
    }
    return maxHeightChild;
  }

  lastNode() {
    let currentChild = this.firstChild;
    while (currentChild?.firstChild) {
      currentChild = currentChild.highestChild();
    }
    return currentChild;
  }

  static removeChild<T>(child: Tree<T>) {
    const father = child.father;
    if (father) {
      let currentChild = father.firstChild;
      if (currentChild === child) {
        father.firstChild = child.nextBrother;
        if (father.firstChild) {
          father.updateHeight(father.firstChild);
        } else {
          father.height = 0;
        }
      } else {
        while (currentChild?.nextBrother && currentChild.nextBrother !== child) {
          currentChild = currentChild.nextBrother;
        }
        currentChild = child.nextBrother;
      }
      child.father = undefined;
      child.nextBrother = undefined;
      child.height = 0;
    }
  }
}
