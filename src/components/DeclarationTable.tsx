import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { computeWinner, generateVoteDeclarations } from '../model';
import { Cell } from '../utils/cell';
import { Protected } from '../utils/protected';
import { readKey, writeKey } from '../utils/rsa';
import { writeSignature } from '../utils/signature';

export const DeclarationTable = React.memo(() => {
  const [votes, setVotes] = useState(20);
  const [candidates, setCandidates] = useState(2);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [voteDeclarations, setVoteDeclaration] = useState<Protected[]>([]);

  const onSubmit = useCallback(() => {
    const declarations = generateVoteDeclarations(votes, candidates);
    const decl = new Cell(declarations);
    const cand = new Cell(declarations.map((d) => readKey(d.message)));
    const vt = new Cell(declarations.map((d) => d.pKey));
    const [nVotes, winner] = computeWinner(decl, candidates, cand, votes, vt);

    const showToast = () =>
      toast.success(`The winner is ${winner} with ${nVotes} votes`, {
        position: 'top-right',
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

  const renderTable = useCallback(() => {
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
              if (votes > candidates) {
                setHasSubmitted(false);
                setVotes(+e.target.value);
              }
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
              if (votes > candidates) {
                setHasSubmitted(false);
                setCandidates(+e.target.value);
              }
            }}
          />
        </div>
      </div>
      <button type="submit">Show declarations!</button>
      {renderTable()}
    </form>
  );
});
