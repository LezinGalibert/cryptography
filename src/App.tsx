import { ToastContainer } from 'react-toastify';
import './App.css';
import { DeclarationTable } from './components/DeclarationTable';

function App() {
  return (
    <>
      <div className="App">
        <DeclarationTable />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
