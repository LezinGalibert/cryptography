import { Block } from './utils/block';
import { Cell } from './utils/cell';
import { HashTable } from './utils/hashTable';
import { pickRandomNumber, randomPrimePairBySize } from './utils/math';
import { initProtected, Protected } from './utils/protected';
import { generateKeyValues, Key, readKey, writeKey } from './utils/rsa';
import { initSignature } from './utils/signature';
import { TreeNode } from './utils/treeNode';

function selectRandomIndices(lowerBound: number, upperBound: number, nIndices: number) {
  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };
  const shuffledIndices = shuffleArray([...Array(upperBound - lowerBound + 1).keys()]);
  return shuffledIndices.slice(0, nIndices);
}

export function generateVoteDeclarations(votes: number, candidates: number, rig?: Key): Protected[] {
  const [p, q] = randomPrimePairBySize(3, 7, 5000);
  const voteArr: { pKey: Key; sKey: Key }[] = [];
  const candidateArr: Key[] = [];

  const blockDuplicate = new Set<string>();

  for (let i = 0; i < votes; i++) {
    const newKeyPair = generateKeyValues(p, q);
    const keyStr = writeKey(newKeyPair.pKey);
    if (!(keyStr in blockDuplicate)) {
      blockDuplicate.add(keyStr);
      voteArr.push(newKeyPair);
    }
  }

  const shuffledIndices = selectRandomIndices(0, votes, candidates);

  for (const j in shuffledIndices) {
    candidateArr.push(voteArr[j].pKey);
  }

  const protectedDeclarations = voteArr.map((vote) => {
    const selectedCandidate = writeKey(rig ?? candidateArr[pickRandomNumber(0, candidates - 1)]);
    const signature = initSignature(selectedCandidate, vote.sKey);
    return initProtected(vote.pKey, selectedCandidate, signature);
  });

  return protectedDeclarations;
}

export function computeWinner(
  decl: Cell<Protected>,
  sizeC: number,
  candidates: Cell<Key>,
  sizeV: number,
  voters: Cell<Key>,
) {
  const hashC = new HashTable(sizeC);
  hashC.initHashTable(candidates);
  const hashV = new HashTable(sizeV);
  hashV.initHashTable(voters);

  let head = decl.head;
  while (head) {
    if (hashV.getHashCellForKey(head.data.pKey)?.val === 0) {
      hashV.updateCellForKey(head.data.pKey);
      hashC.updateCellForKey(readKey(head.data.message));
    }
    head = head.next;
  }

  return hashC;
}

export function makeModel(hash: HashTable) {
  const [winnerKey, winnerVotes] = hash.findMax();
  return {
    winnerKey,
    winnerVotes,
    results: hash.table.map((c) => {
      return { candidate: writeKey(c.key), votes: c.val };
    }),
  };
}

export function simulateVotingProcess(voters: number, candidates: number, malicious: number, batchSize: number) {
  const decl = generateVoteDeclarations(voters, candidates);
  const cheater = readKey(decl.map((d) => d.message)[pickRandomNumber(0, candidates - 1)]);
  let stopRigging = false;

  let remainingVotes = voters;
  let declBatch = [];
  let i = 0;
  const blockList: Block[] = [];
  let lastValidBlock: Block | undefined;
  while (remainingVotes) {
    stopRigging = remainingVotes < 2 * batchSize;
    declBatch = decl.slice(i * batchSize, (i + 1) * batchSize);

    const validBlock = new Block(declBatch[0].pKey, new Cell(declBatch));
    validBlock.initialize(lastValidBlock);
    blockList.push(validBlock);
    lastValidBlock = validBlock;

    if (!stopRigging && blockList.length > 1) {
      for (let j = 0; j < malicious; j++) {
        const riggedDeclaration = generateVoteDeclarations(batchSize, candidates, cheater);
        const riggedBlock = new Block(cheater, new Cell(riggedDeclaration));
        riggedBlock.initialize(blockList[pickRandomNumber(1, blockList.length - 1)]);
        blockList.push(riggedBlock);
      }
    }

    i++;
    remainingVotes -= batchSize;
  }

  const treeList = blockList.map((block) => new TreeNode(block));
  treeList.forEach((t) => {
    const father = treeList.find((tree) => tree.data.hash === t.data.previousHash);
    father?.addChild(t);
  });

  return treeList[0];
}
