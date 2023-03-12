import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { computeWinner, generateVoteDeclarations, makeModel, simulateVotingProcess } from '../model';
import { Cell } from '../utils/cell';
import { Protected } from '../utils/protected';
import { readKey, writeKey } from '../utils/rsa';
import { writeSignature } from '../utils/signature';
import { BlockTree, TreeData, treeToData } from './BlockTree';

export const DeclarationTable = React.memo(() => {
  const [votes, setVotes] = useState(20);
  const [candidates, setCandidates] = useState(2);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [voteDeclarations, setVoteDeclaration] = useState<Protected[]>([]);
  const [results, setResults] = useState<{ candidate: string; votes: number }[]>();
  const [treeData, setTreeData] = useState<TreeData>();

  const onSubmit = useCallback(() => {
    const declarations = generateVoteDeclarations(votes, candidates);
    const decl = new Cell(declarations);
    const cand = new Cell(declarations.map((d) => readKey(d.message)));
    const vt = new Cell(declarations.map((d) => d.pKey));
    const model = makeModel(computeWinner(decl, candidates, cand, votes, vt));

    const treeDataModel = treeToData(simulateVotingProcess(200, 3, 5, 10));
    setTreeData(treeDataModel);

    setResults(model.results);

    const showToast = () =>
      toast.success(`The winner is ${model.winnerKey} with ${model.winnerVotes} votes`, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

    setVoteDeclaration(declarations);
    setHasSubmitted(true);
    showToast();
  }, [votes, candidates]);

  const renderVotes = useCallback(() => {
    return hasSubmitted ? (
      <table className="table">
        <td>
          <th>Public Key</th>
          {voteDeclarations.map((dec, i) => (
            <tr key={i}>{writeKey(dec.pKey)}</tr>
          ))}
        </td>
        <td>
          <th>Candidate Key</th>
          {voteDeclarations.map((dec, i) => (
            <tr key={i}>{dec.message}</tr>
          ))}
        </td>
        <td>
          <th>Signature</th>
          {voteDeclarations.map((dec, i) => (
            <tr key={i}>{writeSignature(dec.signature)}</tr>
          ))}
        </td>
      </table>
    ) : null;
  }, [hasSubmitted, voteDeclarations]);

  const renderResults = useCallback(() => {
    return hasSubmitted ? (
      <table className="table">
        <td>
          <th>Candidate Key</th>
          {results?.map((r) => (
            <tr>{r.candidate}</tr>
          ))}
        </td>
        <td>
          <th>Number of votes</th>
          {results?.map((r) => (
            <tr>{r.votes}</tr>
          ))}
        </td>
      </table>
    ) : null;
  }, [hasSubmitted, results]);

  const renderTree = useCallback(() => {
    return hasSubmitted && treeData ? <BlockTree treeData={treeData} /> : null;
  }, [hasSubmitted, treeData]);

  return (
    <form
      className="form"
      onSubmit={(e) => {
        onSubmit();
        e.preventDefault();
      }}>
      <h1>How many voters and how many candidates</h1>
      <div className="itemPair">
        <div className="itemWithHeader">
          <p>Number of voters</p>
          <input
            type="number"
            name="Select the number of voters"
            value={votes}
            onChange={(e) => {
              setHasSubmitted(false);
              setVotes(+e.target.value);
            }}
          />
        </div>
        <div className="itemWithHeader">
          <p>Number of candidates</p>
          <input
            type="number"
            name="Select the number of candidates"
            value={candidates}
            onChange={(e) => {
              setHasSubmitted(false);
              setCandidates(+e.target.value);
            }}
          />
        </div>
      </div>
      <button type="submit">Show declarations!</button>
      {renderVotes()}
      {renderResults()}
      {renderTree()}
    </form>
  );
});
