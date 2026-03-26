import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Layout } from './components/Layout';
import { Questions } from './pages/Questions';
import { Exams } from './pages/Exams';
import { Reports } from './pages/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Layout>
          <Routes>
            <Route path="/" element={<Questions />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;

