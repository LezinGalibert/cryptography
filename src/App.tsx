import './App.css';
import { DeclarationTable } from './components/DeclarationTable';
import { SubmitFormWithSliders } from './components/SubmitFormWithSliders';

function App() {
  return (
    <div className="App">
      <SubmitFormWithSliders />
      <DeclarationTable />
    </div>
  );
}

export default App;
