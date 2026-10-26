import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar qué fila está expandida (acordeón)
  const [expandedSaleId, setExpandedSaleId] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get('/sales/history');
        setSales(response.data.data);
      } catch (err) {
        setError('Error al cargar el historial de ventas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const toggleRow = (id) => {
    setExpandedSaleId(expandedSaleId === id ? null : id);
  };

  const handlePrint = (e, saleId) => {
    e.stopPropagation(); // Evita que se colapse la fila al hacer clic en el botón
    alert(`Imprimiendo boleta para la venta #${saleId}... (Conexión futura a impresora térmica)`);
  };

  if (loading) return <div className="p-8 text-center">Cargando historial...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Ventas</h1>

      {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">N° Venta</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Fecha y Hora</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Cajero</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Método Pago</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
              </tr>
            </thead>
            
            {/* CAMBIO PRINCIPAL AQUÍ */}
            {sales.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay ventas registradas.</td>
                </tr>
              </tbody>
            ) : (
              sales.map((sale) => (
                /* CADA VENTA TIENE SU PROPIO TBODY CON LA KEY */
                <tbody key={sale.sale_id}>
                  {/* Fila Principal */}
                  <tr 
                    onClick={() => toggleRow(sale.sale_id)}
                    className={`cursor-pointer transition-colors border-b hover:bg-pink-50 
                      ${expandedSaleId === sale.sale_id ? 'bg-pink-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">#{sale.sale_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(sale.sale_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{sale.cashier_name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{sale.payment_method_name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-pink-600 text-right">
                      {formatCurrency(sale.total)}
                    </td>
                  </tr>

                  {/* Fila Expandible (Detalles) */}
                  {expandedSaleId === sale.sale_id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="5" className="px-6 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          
                          <div className="flex-1 w-full">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Detalle del Pedido ({sale.total_items} ítems)</h4>
                            <ul className="space-y-1">
                              {sale.details?.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex justify-between max-w-md">
                                  <span>{item.quantity}x {item.product_name}</span>
                                  <span className="font-mono">{formatCurrency(item.subtotal)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button 
                            onClick={(e) => handlePrint(e, sale.sale_id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded shadow hover:bg-gray-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Imprimir Boleta
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))
            )}
          </table>
        </div>
      </div>
    </div>
  );
}