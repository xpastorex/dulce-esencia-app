import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // Inicializamos el estado vacío o en null
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showStockModal, setShowStockModal] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Hacemos la petición GET al endpoint que acabamos de crear
        const response = await api.get('/dashboard/stats');

        // Guardamos los datos reales en el estado
        setStats(response.data.data);
      } catch (err) {
        console.error('Error al cargar métricas:', err);
        setError('No se pudieron cargar las estadísticas del panel.');
      } finally {
        // Apagamos el estado de carga
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

  // Manejo de la pantalla mientras carga o si falla
  if (loading) return <div className="p-8 text-center text-gray-500 font-medium mt-10">Cargando métricas del sistema...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium mt-10 bg-red-50 rounded-xl">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-500 mt-1">Resumen de rendimiento de Dulce Esencia.</p>
      </div>

      {/* ==========================================
          FILA 1: KPIs PRINCIPALES (Tarjetas)
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Tarjeta 1: Ventas del Día */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold text-sm uppercase">Ventas Hoy</h3>
            <span className="p-2 bg-green-50 text-green-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-black text-gray-800">{formatCurrency(stats.ventasHoy)}</p>
        </div>

        {/* Tarjeta 2: Ventas del Mes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold text-sm uppercase">Ventas Mes</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-black text-gray-800">{formatCurrency(stats.ventasMes)}</p>
        </div>

        {/* Tarjeta 3: Ticket Promedio */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold text-sm uppercase">Ticket Promedio</h3>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-black text-gray-800">{formatCurrency(stats.ticketPromedio)}</p>
        </div>

        {/* Tarjeta 4: Alertas de Stock */}
        <div
          onClick={() => setShowStockModal(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center cursor-pointer hover:border-red-300 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold text-sm uppercase group-hover:text-red-500 transition-colors">Stock Crítico</h3>
            <span className="p-2 bg-red-50 text-red-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-black text-red-600">{stats.stockCritico} prod.</p>
          <p className="text-sm text-red-500 font-medium mt-2 flex items-center gap-1">
            Ver detalles <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </p>
        </div>
      </div>

      {/* ==========================================
          FILA 2: GRÁFICOS Y RANKINGS
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico de Ventas (Placeholder) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución de Ventas (Últimos 7 días)</h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.graficoVentas}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="fecha"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Ingresos']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#DB2777" /* Color pink-600 de Tailwind */
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#DB2777', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Productos del Mes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Más Vendidos (Mes)</h3>

          {stats.topProductos.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-10">Aún no hay ventas registradas este mes.</p>
          ) : (
            <div className="space-y-4">
              {stats.topProductos.map((producto, index) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{producto.nombre}</p>
                      <p className="text-xs text-gray-500">{producto.cantidad} unidades</p>
                    </div>
                  </div>
                  <p className="font-bold text-pink-600 text-sm">{formatCurrency(producto.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">

            {/* Cabecera del modal */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <h3 className="font-bold text-lg">Reporte de Stock Crítico</h3>
              </div>
              <button onClick={() => setShowStockModal(false)} className="text-red-400 hover:text-red-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Lista de productos */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {stats.productosCriticos.length === 0 ? (
                <p className="text-center text-gray-500 font-medium">Todo el inventario está en niveles óptimos.</p>
              ) : (
                <div className="space-y-3">
                  {stats.productosCriticos.map(producto => (
                    <div key={producto.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-800">{producto.nombre}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${producto.stock === 0 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        {producto.stock === 0 ? 'Agotado' : `Quedan ${producto.stock}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pie del modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setShowStockModal(false)}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md active:scale-95"
              >
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}