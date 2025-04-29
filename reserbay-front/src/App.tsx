import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';  // Asegúrate de tener un componente Login
import UserProfile from './UserProfile';  // Asegúrate de tener un componente UserProfile

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

