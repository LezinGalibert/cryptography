import React, { useCallback, useState } from 'react';
import { generateVoteDeclarations } from '../model';
import { Protected } from '../utils/protected';
import { writeKey } from '../utils/rsa';
import { writeSignature } from '../utils/signature';

export const DeclarationTable = React.memo(() => {
  const [votes, setVotes] = useState(20);
  const [candidates, setCandidates] = useState(2);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [voteDeclarations, setVoteDeclaration] = useState<Protected[]>([]);

  const onSubmit = useCallback(() => {
    const declarations = generateVoteDeclarations(votes, candidates);
    setVoteDeclaration(declarations);
    setHasSubmitted(true);
  }, [votes, candidates]);

  const renderTable = useCallback(() => {
    return hasSubmitted ? (
      <table>
        <td>
          <th>Public Key</th>
          {voteDeclarations.map((dec, i) => (
            <tr key={i}>{writeKey(dec.pKey)}</tr>
          ))}
        </td>
        <td>
          <th>Secret Key</th>
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
      onSubmit={(e) => {
        onSubmit();
        e.preventDefault();
      }}>
      <h1>How many voters and how many candidates</h1>
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
      <button type="submit">Show declarations!</button>
      {renderTable()}
    </form>
  );
});
