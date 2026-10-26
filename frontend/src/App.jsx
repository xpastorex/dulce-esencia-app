import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Sales from './pages/Sales';
import Products from './pages/Products';
import SalesHistory from './pages/SalesHistory';

// Redirige al inicio si ya está logeado (para pantallas de login/registro)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/" replace />;
  return children;
};

// Redirige al login si NO está logeado (para las vistas de la app)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  
  // Si está logeado, envuelve la vista en el Layout del Sidebar
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Rutas Privadas (Protegidas y envueltas en el Sidebar) */}
        <Route path="/" element={<PrivateRoute><Sales /></PrivateRoute>} />
        <Route path="/productos" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><SalesHistory /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;