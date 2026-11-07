import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para saber qué fila está expandida (guardaremos el sale_id)
  const [expandedSaleId, setExpandedSaleId] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHistory = async (start = startDate, end = endDate) => {
    setLoading(true);
    try {
      const response = await api.get('/sales/history', {
        params: { startDate: start, endDate: end }
      });
      setSales(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError('No se pudo cargar el historial de ventas.');
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchHistory();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-CL', options);
  };

  const toggleDetails = (id) => {
    // Si la fila clickeada ya está abierta, la cerramos (null), sino, la abrimos (id)
    setExpandedSaleId(prevId => (prevId === id ? null : id));
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    fetchHistory('', ''); // Forzamos la búsqueda vacía inmediatamente
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium mt-10">Cargando historial de ventas...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium mt-10 bg-red-50 rounded-xl">{error}</div>;


  const exportToCSV = () => {
    if (sales.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    // 1. Definir las cabeceras del CSV
    const headers = ['ID Venta', 'Fecha', 'Cajero', 'Método de Pago', 'Artículos', 'Total'];

    // 2. Mapear los datos de React a formato de texto (filas)
    const rows = sales.map(sale => {
      // Envolvemos los textos en comillas dobles para evitar problemas si tienen comas
      return [
        sale.sale_id,
        `"${formatDate(sale.sale_date)}"`,
        `"${sale.cashier_name}"`,
        `"${sale.payment_method_name}"`,
        sale.total_items,
        sale.total // Exportamos el número puro, sin símbolo $ para que Excel pueda sumar
      ].join(',');
    });

    // 3. Unir cabeceras y filas con saltos de línea
    const csvContent = [headers.join(','), ...rows].join('\n');

    // 4. Crear el archivo Blob con codificación UTF-8 para Excel (BOM)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // 5. Crear un enlace invisible, simular el clic y limpiar
    const link = document.createElement('a');
    link.href = url;
    // Nombre del archivo dinámico con la fecha actual
    link.setAttribute('download', `historial_ventas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Historial de Ventas</h1>
        <p className="text-gray-500 mt-1">Revisa todas las transacciones realizadas y sus detalles.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500 outline-none bg-gray-50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500 outline-none bg-gray-50"
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => fetchHistory()}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
          >
            Buscar
          </button>
          {(startDate || endDate) && (
            <button
              onClick={handleClearFilters}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg transition-colors border border-red-100"
            >
              Limpiar
            </button>
          )}

          {/* NUEVO: Botón de Exportar a CSV */}
          <button
            onClick={exportToCSV}
            disabled={sales.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Exportar datos visibles a Excel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
        </div>


      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            {/* Cabecera de la tabla */}
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">ID Venta</th>
                <th className="p-4 font-bold">Fecha y Hora</th>
                <th className="p-4 font-bold">Cajero</th>
                <th className="p-4 font-bold">Método de Pago</th>
                <th className="p-4 font-bold text-center">Artículos</th>
                <th className="p-4 font-bold text-right">Total</th>
                <th className="p-4 font-bold text-center">Acción</th>
              </tr>
            </thead>

            {sales.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 font-medium">
                    No hay ventas registradas aún.
                  </td>
                </tr>
              </tbody>
            ) : (
              // Usamos un tbody para cada venta. Esto evita tener que usar React.Fragment
              // y mantiene la semántica HTML de la tabla impecable.
              sales.map((sale) => (
                <tbody key={sale.sale_id} className="border-b border-gray-100 last:border-none transition-colors hover:bg-gray-50/50">

                  {/* Fila Principal de la Venta */}
                  <tr className={expandedSaleId === sale.sale_id ? 'bg-pink-50/30' : ''}>
                    <td className="p-4 font-bold text-gray-800">#{sale.sale_id}</td>
                    <td className="p-4 text-gray-600 text-sm">{formatDate(sale.sale_date)}</td>
                    <td className="p-4 text-gray-800 font-medium">{sale.cashier_name}</td>
                    <td className="p-4 text-gray-600 text-sm">
                      <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200 font-medium">
                        {sale.payment_method_name}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-600">{sale.total_items}</td>
                    <td className="p-4 text-right font-black text-pink-600">{formatCurrency(sale.total)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleDetails(sale.sale_id)}
                        className={`p-2 rounded-lg transition-all ${expandedSaleId === sale.sale_id
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        title="Ver detalles"
                      >
                        <svg
                          className={`w-5 h-5 transform transition-transform ${expandedSaleId === sale.sale_id ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  {/* Fila Desplegable con los Detalles (extraídos de la subconsulta json_agg) */}
                  {expandedSaleId === sale.sale_id ? (
                    <tr>
                      <td colSpan="7" className="p-0 border-t border-dashed border-gray-200 bg-gray-50">
                        <div className="p-6">
                          <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Detalle del Pedido #{sale.sale_id}
                          </h4>

                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                  <th className="p-3 font-semibold">Producto</th>
                                  <th className="p-3 font-semibold text-center">Cantidad</th>
                                  <th className="p-3 font-semibold text-right">Precio Unitario</th>
                                  <th className="p-3 font-semibold text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sale.details && sale.details.length > 0 ? (
                                  sale.details.map((detail, index) => (
                                    <tr key={index} className="border-t border-gray-100">
                                      <td className="p-3 font-medium text-gray-800">{detail.product_name}</td>
                                      <td className="p-3 text-center">{detail.quantity}</td>
                                      <td className="p-3 text-right text-gray-600">{formatCurrency(detail.unit_price)}</td>
                                      <td className="p-3 text-right font-bold text-gray-800">{formatCurrency(detail.subtotal)}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4" className="p-3 text-center text-gray-400">Error: Sin detalles registrados</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                        </div>
                      </td>
                    </tr>
                  ) : null}

                </tbody>
              ))
            )}
          </table>
        </div>
      </div>
    </div>
  );
}