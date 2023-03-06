import { useCallback, useState } from 'react';
import './App.css';
import { isMillerPrime, randomPrimeNumberBySize } from './utils/math';

function App() {
  const [prime, setPrime] = useState(0);
  const [precision, setPrecision] = useState(10);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [isPrime, setIsPrime] = useState(false);

  const [lowBound, setLowBound] = useState(1);
  const [upBound, setUpBound] = useState(2);
  const [confirmedPrimePicker, setHasConfirmedPrimePicker] = useState(false);
  const [newPrime, setNewPrime] = useState(0);

  const renderResult = useCallback(() => {
    return hasConfirmed ? <h1>{isPrime ? `${prime} is prime` : `${prime} is not prime`}</h1> : null;
  }, [prime, hasConfirmed]);

  const onSubmit = useCallback(() => {
    setIsPrime(isMillerPrime(prime, precision));
    setHasConfirmed(true);
  }, [prime, precision]);

  const onSubmitPrimePicker = useCallback(() => {
    const p = randomPrimeNumberBySize(lowBound, upBound, 10);
    setNewPrime(p);
    setHasConfirmedPrimePicker(true);
  }, [lowBound, upBound]);

  const renderNewPrime = useCallback(() => {
    return confirmedPrimePicker ? <h1>{`${newPrime} is your prime`}</h1> : null;
  }, [newPrime, confirmedPrimePicker]);

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          onSubmit();
          e.preventDefault();
        }}>
        <h1>Use Miller test to check if your input is prime!</h1>
        <div className="card">
          <input
            type="text"
            name="Pick your number"
            value={prime}
            onChange={(e) => {
              setHasConfirmed(false);
              setPrime(+e.target.value);
            }}
          />
          <input
            type="text"
            name="Set a precision"
            value={precision}
            onChange={(e) => {
              setHasConfirmed(false);
              setPrecision(+e.target.value);
            }}
          />
        </div>
        <button type="submit">Submit</button>
        {renderResult()}
      </form>

      <form
        onSubmit={(e) => {
          onSubmitPrimePicker();
          e.preventDefault();
        }}>
        <h1>Give me sizes and I'll give you a prime between those sizes</h1>
        <div className="card">
          <input
            type="text"
            name="Pick a lower size"
            value={lowBound}
            onChange={(e) => {
              setHasConfirmedPrimePicker(false);
              setLowBound(+e.target.value);
            }}
          />
          <input
            type="text"
            name="Pick a higher size"
            value={upBound}
            onChange={(e) => {
              setHasConfirmedPrimePicker(false);
              setUpBound(+e.target.value);
            }}
          />
        </div>
        <button type="submit">Submit</button>
        {renderNewPrime()}
      </form>
    </div>
  );
}

export default App;
