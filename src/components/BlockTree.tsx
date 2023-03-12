import React from 'react';
import { simulateVotingProcess } from '../model';
import { Block } from '../utils/block';
import { TreeNode } from '../utils/treeNode';
import { Tree } from 'react-tree-graph';
import { writeKey } from '../utils/rsa';

export type TreeData =
  | { name: string; nodeProps: { className: string }[] }
  | { name: string; nodeProps: { className: string }[]; children: TreeData[] };
export function treeToData(tree: TreeNode<Block>): TreeData {
  if (!tree.firstChild) {
    return { name: `Author: ${writeKey(tree.data.author)}`, nodeProps: [{ className: 'red' }] };
  }

  const data = {
    name: `Author: ${writeKey(tree.data.author)}`,
    children: [] as TreeData[],
    nodeProps: [{ className: 'red' }],
  };
  let currentChild = tree.firstChild as TreeNode<Block> | undefined;
  while (currentChild) {
    data.children.push(treeToData(currentChild));
    currentChild = currentChild.nextBrother;
  }

  return data;
}

export const BlockTree: React.FC<{ treeData: TreeData }> = React.memo(({ treeData }) => {
  return <Tree data={treeData} height={1000} width={4000} />;
});
