import logo from './logo.svg';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#dfe6e9' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {/* Add more links here as you add more pages */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
