export class TreeNode<T> {
  data: T;
  father: TreeNode<T> | undefined;
  firstChild: TreeNode<T> | undefined;
  nextBrother: TreeNode<T> | undefined;
  height = 0;

  constructor(data: T) {
    this.data = data;
  }

  updateHeight(child: TreeNode<T>) {
    const h = this.height;
    this.height = Math.max(h, child.height + 1);
    return h === this.height;
  }

  addChild(child: TreeNode<T>) {
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

    let newChild = child;
    while (newChild.father) {
      newChild.father.updateHeight(newChild);
      newChild = newChild.father;
    }
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

  static removeChild<T>(child: TreeNode<T>) {
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
