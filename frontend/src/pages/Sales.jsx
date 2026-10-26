import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para los filtros de categorías
  const [activeCategories, setActiveCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const loadedProducts = response.data.data;
        setProducts(loadedProducts);
        
        // Inicializar todas las categorías como activas por defecto
        const uniqueCategories = [...new Set(loadedProducts.map(p => p.category_name || 'General'))];
        setActiveCategories(uniqueCategories);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Funciones de Categorías
  const categories = [...new Set(products.map(p => p.category_name || 'General'))];

  const toggleCategory = (categoryName) => {
    setActiveCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName); // Apagar
      } else {
        return [...prev, categoryName]; // Prender
      }
    });
  };

  const filteredProducts = products.filter(product => 
    activeCategories.includes(product.category_name || 'General')
  );

  // Funciones del Carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito por completo?')) {
      setCart([]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    alert('¡Hola Mundo! Conectaremos esto al backend pronto.');
  };

  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Cargando catálogo...</div>;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 bg-gray-100 -m-6 md:-m-8 p-6 md:p-8">
      
      {/* ==========================================
          LADO IZQUIERDO: CATÁLOGO DE PRODUCTOS 
          ========================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Punto de Venta</h1>
          <p className="text-sm text-gray-500">Selecciona los productos para agregar al pedido</p>
        </div>

        {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded shadow-sm">{error}</div>}

        {/* Botones de Filtro de Categorías */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map(category => {
            const isActive = activeCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm
                  ${isActive 
                    ? 'bg-pink-600 text-white border-transparent' 
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Grid scrolleable de productos filtrados */}
        <div className="flex-1 overflow-y-auto pr-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">No hay productos en las categorías seleccionadas.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 md:pb-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`flex flex-col relative overflow-hidden bg-white rounded-xl shadow-sm border transition-all hover:shadow-md active:scale-95 text-left h-44 w-full
                    ${product.stock === 0 ? 'opacity-50 cursor-not-allowed border-gray-100' : 'border-gray-200 hover:border-pink-300'}`}
                >
                  {/* Etiqueta flotante de Stock si está agotado */}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow z-10">
                      Agotado
                    </div>
                  )}

                  <div className="w-full h-24 bg-gray-100 shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3 w-full flex flex-col flex-1">
                    <span className="font-bold text-gray-800 line-clamp-1 w-full text-sm leading-tight mb-1">
                      {product.name}
                    </span>
                    <span className="font-black text-pink-600 mt-auto text-sm">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          LADO DERECHO: CARRITO (BOLETA)
          ========================================== */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-120px)] md:h-full relative">
        
        <div className="p-4 border-b bg-gray-50 rounded-t-xl flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Pedido Actual</h2>
          <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} ítems
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-medium">El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-gray-800 flex-1 leading-tight pr-2">{item.name}</span>
                  <span className="font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-pink-600 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-8 text-center bg-gray-50 py-1.5 border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-pink-600 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors border border-red-100"
                    title="Eliminar producto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-white rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold uppercase text-sm tracking-wider">Total a Pagar</span>
            <span className="text-3xl font-black text-pink-600">{formatCurrency(cartSubtotal)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={clearCart}
              disabled={cart.length === 0}
              className="py-3 font-bold text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-100"
            >
              Vaciar
            </button>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="py-3 font-bold text-white bg-green-500 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              Pagar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}