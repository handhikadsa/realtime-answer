import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Results from './Result';
import Home from './Home';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/results" element={<Results/>} />
      </Routes>
    </Router>
  );
}

export default App;
