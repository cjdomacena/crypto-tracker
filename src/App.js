import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav';
import Coin from './pages/Coin';
import Dashboard from './pages/Dashboard';

function App()
{


  return (
    <div className="App w-full h-full">
      <Nav />
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="coin/:coinID" element={<Coin/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
