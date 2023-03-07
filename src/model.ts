import { pickRandomNumber, randomPrimePairBySize } from './utils/math';
import { initProtected, Protected } from './utils/protected';
import { generateKeyValues, Key, writeKey } from './utils/rsa';
import { initSignature } from './utils/signature';

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

export function generateVoteDeclarations(votes: number, candidates: number): Protected[] {
  const [p, q] = randomPrimePairBySize(3, 7, 5000);
  const voteArr: { pKey: Key; sKey: Key }[] = [];
  const candidateArr: Key[] = [];

  for (let i = 0; i < votes; i++) {
    voteArr.push(generateKeyValues(p, q));
  }

  const shuffledIndices = selectRandomIndices(0, votes, candidates);

  for (const j in shuffledIndices) {
    candidateArr.push(voteArr[j].pKey);
  }

  const protectedDeclarations = voteArr.map((vote) => {
    const selectedCandidate = writeKey(candidateArr[pickRandomNumber(0, candidates - 1)]);
    const signature = initSignature(selectedCandidate, vote.sKey);
    return initProtected(vote.pKey, selectedCandidate, signature);
  });

  return protectedDeclarations;
}
