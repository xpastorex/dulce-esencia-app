import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function Inicio() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold text-blue-600">
        Panel Principal
      </h1>
      {user ? (
        <div className="text-center">
          <p className="mb-4 text-xl">Bienvenido, {user.name} ({user.role})</p>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Ir a Login</Link>
          <Link to="/register" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">Registrarse</Link>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;