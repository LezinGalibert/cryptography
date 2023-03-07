import React, { useCallback, useState } from 'react';
import { randomPrimeNumberBySize } from '../utils/math';

export const SubmitFormWithSliders = React.memo(() => {
  const [lowBound, setLowBound] = useState(1);
  const [upBound, setUpBound] = useState(2);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [newPrime, setNewPrime] = useState(0);

  const onSubmit = useCallback(() => {
    const p = randomPrimeNumberBySize(lowBound, upBound, 10);
    setNewPrime(p);
    setHasSubmitted(true);
  }, [lowBound, upBound]);

  const renderNewPrime = useCallback(() => {
    return hasSubmitted ? <h1>{`${newPrime} is your prime`}</h1> : null;
  }, [newPrime, hasSubmitted]);

  return (
    <form
      onSubmit={(e) => {
        onSubmit();
        e.preventDefault();
      }}>
      <h1>Give me sizes and I'll give you a prime between those sizes</h1>
      <div className="card">
        <div className="horizontal">
          <p>{`Lower size: ${lowBound}`}</p>
          <input
            type="range"
            name="Pick a lower size"
            min={1}
            max={7}
            value={lowBound}
            onChange={(e) => {
              setHasSubmitted(false);
              setLowBound(Math.min(+e.target.value, upBound));
            }}
          />

          <p>{`Upper size: ${upBound}`}</p>
          <input
            type="range"
            name="Pick a higher size"
            min={2}
            max={7}
            value={upBound}
            onChange={(e) => {
              setHasSubmitted(false);
              setUpBound(Math.max(+e.target.value, lowBound));
            }}
          />
        </div>
      </div>
      <button type="submit">Submit</button>
      {renderNewPrime()}
    </form>
  );
});
