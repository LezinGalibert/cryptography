import { useCallback, useState } from 'react';
import './App.css';
import { isMillerPrime } from './utils/math';

function App() {
  const [prime, setPrime] = useState(0);
  const [precision, setPrecision] = useState(10);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [isPrime, setIsPrime] = useState(false);

  const renderResult = useCallback(() => {
    return hasConfirmed ? <h1>{isPrime ? `${prime} is prime` : `${prime} is not prime`}</h1> : null;
  }, [isPrime, hasConfirmed]);

  return (
    <div className="App">
      <form
        onSubmit={(event) => {
          setIsPrime(isMillerPrime(prime, precision));
          setHasConfirmed(true);
          event.preventDefault();
        }}>
        <h1>Use Miller test to check if your input is prime!</h1>
        <div className="card">
          <input type="text" name="Pick your number" value={prime} onChange={(e) => setPrime(+e.target.value)} />
          <input type="text" name="Set a precision" value={precision} onChange={(e) => setPrecision(+e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {renderResult()}
    </div>
  );
}

export default App;
