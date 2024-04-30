import Login from '../src/components/login'
import Register from '../src/components/register'
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../src/components/admin_dashboard';
import UserDashboard from '../src/components/user_dashboard';

function App() {
  return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<UserDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
  );
}

export default App;