import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav';
import Dashboard from './pages/Dashboard';

function App()
{


  return (
    <div className="App w-full h-full">
      <Nav />
      <div className="container mx-auto mt-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
