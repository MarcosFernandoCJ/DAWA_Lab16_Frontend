'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProductos, deleteProducto as apiDeleteProducto } from '@/lib/api';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [deleteLoading, setDeleteLoading] = useState(null);
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (codProducto, nombreProducto) => {
    const confirmacion = confirm(`¿Estás seguro de eliminar "${nombreProducto}"?`);
    if (confirmacion) {
      try {
        setDeleteLoading(codProducto);
        await apiDeleteProducto(codProducto);
        setProductos(productos.filter(p => p.codProducto !== codProducto));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = productos
    .filter(producto => 
      producto.nomPro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codProducto.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nombre':
          aValue = a.nomPro.toLowerCase();
          bValue = b.nomPro.toLowerCase();
          break;
        case 'precio':
          aValue = parseFloat(a.precioProducto);
          bValue = parseFloat(b.precioProducto);
          break;
        case 'stock':
          aValue = parseInt(a.stockProducto);
          bValue = parseInt(b.stockProducto);
          break;
        default:
          aValue = a.codProducto;
          bValue = b.codProducto;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStockStatus = (stock) => {
    if (stock === 0) return { 
      color: 'bg-red-50 text-red-700 border-red-200', 
      text: 'Agotado',
      icon: '🚫'
    };
    if (stock <= 10) return { 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      text: 'Stock Bajo',
      icon: '⚠️'
    };
    return { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      text: 'Disponible',
      icon: '✅'
    };
  };

  const getProductIcon = (nombre) => {
    const firstLetter = nombre.charAt(0).toUpperCase();
    const colors = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-500'
    ];
    const colorIndex = nombre.charCodeAt(0) % colors.length;
    return { letter: firstLetter, gradient: colors[colorIndex] };
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-violet-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Cargando productos</h3>
            <p className="text-slate-600">Esto tomará solo un momento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Moderno */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Inventario
                  </h1>
                  <p className="text-slate-600 font-medium">
                    {productos.length} productos en total
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/productos/new')}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <span className="text-sm">+</span>
              </div>
              Nuevo Producto
              <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Stats Cards Mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total</p>
                <p className="text-3xl font-bold text-slate-800">{productos.length}</p>
                <p className="text-xs text-slate-500 mt-1">productos registrados</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Disponibles</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {productos.filter(p => p.stockProducto > 10).length}
                </p>
                <p className="text-xs text-slate-500 mt-1">con stock normal</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Stock Bajo</p>
                <p className="text-3xl font-bold text-amber-600">
                  {productos.filter(p => p.stockProducto <= 10 && p.stockProducto > 0).length}
                </p>
                <p className="text-xs text-slate-500 mt-1">requieren atención</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Agotados</p>
                <p className="text-3xl font-bold text-red-600">
                  {productos.filter(p => p.stockProducto === 0).length}
                </p>
                <p className="text-xs text-slate-500 mt-1">necesitan restock</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controles Mejorados */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Búsqueda */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                🔍 Buscar productos
              </label>
              <div className="relative group">
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 group-hover:border-slate-300"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                    🔍
                  </div>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Filtros */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  📊 Ordenar por
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-4 bg-white/50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
                  >
                    <option value="nombre">Nombre</option>
                    <option value="precio">Precio</option>
                    <option value="stock">Stock</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-4 bg-white/50 border-2 border-slate-200 rounded-xl hover:bg-white transition-all duration-200 hover:border-slate-300"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
              
              {/* Vista */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  👁️ Vista
                </label>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-violet-600 font-semibold' 
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'table' 
                        ? 'bg-white shadow-sm text-violet-600 font-semibold' 
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Productos */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {searchTerm ? 'Sin resultados' : 'Inventario vacío'}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {searchTerm 
                  ? `No encontramos productos que coincidan con "${searchTerm}". Intenta con otros términos.` 
                  : 'Tu inventario está esperando. ¡Agrega tu primer producto y comienza a gestionar tu stock!'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/productos/new')}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="text-lg">+</span>
                  Crear Primer Producto
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              /* Vista de Cuadrícula Moderna */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((producto) => {
                  const stockStatus = getStockStatus(producto.stockProducto);
                  const icon = getProductIcon(producto.nomPro);
                  return (
                    <div key={producto.codProducto} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      {/* Header de la Card */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${icon.gradient} rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {icon.letter}
                          </div>
                          <div>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              #{producto.codProducto}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${stockStatus.color}`}>
                          <span>{stockStatus.icon}</span>
                          {stockStatus.text}
                        </span>
                      </div>
                      
                      {/* Información Principal */}
                      <div className="mb-6">
                        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                          {producto.nomPro}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3">
                            <p className="text-xs text-emerald-600 font-semibold mb-1">💰 PRECIO</p>
                            <p className="text-xl font-bold text-emerald-700">
                              S/ {parseFloat(producto.precioProducto).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
                            <p className="text-xs text-blue-600 font-semibold mb-1">📦 STOCK</p>
                            <p className="text-xl font-bold text-blue-700">
                              {producto.stockProducto}
                            </p>
                            <p className="text-xs text-blue-500">unidades</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/productos/${producto.codProducto}/edit`)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-xl hover:from-amber-200 hover:to-orange-200 transition-all duration-200 font-semibold group/btn"
                        >
                          <span className="group-hover/btn:scale-110 transition-transform">✏️</span>
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.codProducto, producto.nomPro)}
                          disabled={deleteLoading === producto.codProducto}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all duration-200 font-semibold disabled:opacity-50 group/btn"
                        >
                          {deleteLoading === producto.codProducto ? (
                            <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <span className="group-hover/btn:scale-110 transition-transform">🗑️</span>
                          )}
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vista de Tabla Moderna */
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredAndSortedProducts.map((producto) => {
                        const stockStatus = getStockStatus(producto.stockProducto);
                        const icon = getProductIcon(producto.nomPro);
                        return (
                          <tr key={producto.codProducto} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${icon.gradient} rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-200`}>
                                  {icon.letter}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                                    {producto.nomPro}
                                  </div>
                                  <div className="text-sm text-slate-500 font-mono">
                                    #{producto.codProducto}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-lg font-bold text-emerald-600">
                                S/ {parseFloat(producto.precioProducto).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-900">
                                {producto.stockProducto}
                              </span>
                              <span className="text-sm text-slate-500 ml-1">unidades</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${stockStatus.color}`}>
                                <span>{stockStatus.icon}</span>
                                {stockStatus.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => router.push(`/productos/${producto.codProducto}/edit`)}
                                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-lg hover:from-amber-200 hover:to-orange-200 transition-all duration-200 text-sm font-semibold"
                                >
                                  <span>✏️</span>
                                  Editar
                                </button>
                                <button
                                  onClick={() => eliminarProducto(producto.codProducto, producto.nomPro)}
                                  disabled={deleteLoading === producto.codProducto}
                                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-lg hover:from-red-200 hover:to-pink-200 transition-all duration-200 text-sm font-semibold disabled:opacity-50"
                                >
                                  {deleteLoading === producto.codProducto ? (
                                    <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <span>🗑️</span>
                                  )}
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Información de Resultados */}
        {searchTerm && filteredAndSortedProducts.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/50">
              <span className="text-sm text-slate-600">
                <span className="font-semibold text-violet-600">{filteredAndSortedProducts.length}</span> 
                {filteredAndSortedProducts.length === 1 ? ' producto encontrado' : ' productos encontrados'} 
                para <span className="font-semibold">"{searchTerm}"</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}