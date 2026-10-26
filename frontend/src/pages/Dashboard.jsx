export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de las ventas e inventario de Dulce Esencia.</p>
      </div>

      {/* Tarjetas de métricas de ejemplo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium text-sm">Ventas del Día</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium text-sm">Pedidos Hoy</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium text-sm">Productos con Bajo Stock</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
        Aquí irán los gráficos (ej. usando Recharts o Chart.js) en el futuro.
      </div>
    </div>
  );
}