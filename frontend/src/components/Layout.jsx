import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // Rutas del menú
  const navItems = [
    { name: 'Dashboard', path: '/' },          
    { name: 'Nueva Venta', path: '/venta' },    
    { name: 'Productos', path: '/productos' },
    { name: 'Historial', path: '/historial' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Botón hamburguesa para móvil (visible solo en pantallas pequeñas) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute top-4 left-4 z-20 p-2 bg-pink-600 text-white rounded shadow"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay oscuro para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Principal */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0`}
      >
        {/* Cabecera del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-pink-600 tracking-tight">Dulce Esencia</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Cierra el menú en móvil al navegar
                className={`block px-4 py-3 rounded transition-colors duration-200 ${
                  isActive 
                    ? 'bg-pink-100 text-pink-700 font-semibold border-r-4 border-pink-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Botón de Cerrar Sesión fijo abajo */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        {/* Espaciado superior en móvil para no chocar con el botón hamburguesa */}
        <div className="md:hidden h-16 bg-white shadow-sm w-full"></div>
        
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}