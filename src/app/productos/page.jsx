'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProductos, deleteProducto as apiDeleteProducto } from '@/lib/api'; // <--- ¡AÑADIDO! Renombramos deleteProducto para evitar conflicto

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos(); // <--- ¡MODIFICADO! Usa la función de api.js
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      // Aquí podrías mostrar un mensaje de error más amigable al usuario
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (codProducto, nombreProducto) => {
    const confirmacion = confirm(`¿Estás seguro de eliminar "${nombreProducto}"?`);
    if (confirmacion) {
      try {
        // <--- ¡MODIFICADO! Usa la función de api.js para eliminar
        await apiDeleteProducto(codProducto); 

        // Si la eliminación fue exitosa (la función apiDeleteProducto no lanza error), actualiza el estado
        setProductos(productos.filter(p => p.codProducto !== codProducto));
        alert('Producto eliminado exitosamente.'); // O un Toast/notificación
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto. Consulta la consola para más detalles.');
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
    if (stock === 0) return { color: 'bg-red-100 text-red-800', text: 'Sin stock' };
    if (stock <= 10) return { color: 'bg-yellow-100 text-yellow-800', text: 'Stock bajo' };
    return { color: 'bg-green-100 text-green-800', text: 'Disponible' };
  };

  useEffect(() => {
    fetchProductos();
  }, []); // Se ejecuta una vez al montar el componente para cargar los productos iniciales

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                <span className="text-3xl">📦</span>
                Gestión de Productos
              </h1>
              <p className="text-slate-600">
                Administra tu inventario de productos de manera eficiente
              </p>
            </div>
            <button
              onClick={() => router.push('/productos/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <span className="text-lg">+</span>
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Productos</p>
                <p className="text-2xl font-bold text-slate-800">{productos.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-600">
                  {productos.filter(p => p.stockProducto <= 10 && p.stockProducto > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {productos.filter(p => p.stockProducto === 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buscar productos
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="nombre">Nombre</option>
                  <option value="precio">Precio</option>
                  <option value="stock">Stock</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/Table */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Comienza agregando tu primer producto al inventario'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/productos/new')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                >
                  <span>+</span>
                  Agregar Primer Producto
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAndSortedProducts.map((producto, index) => {
                    const stockStatus = getStockStatus(producto.stockProducto);
                    return (
                      <tr key={producto.codProducto} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            #{producto.codProducto}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                              {producto.nomPro.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {producto.nomPro}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-green-600">
                            S/ {parseFloat(producto.precioProducto).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-900">
                            {producto.stockProducto} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/productos/${producto.codProducto}/edit`)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                            >
                              <span>✏️</span>
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarProducto(producto.codProducto, producto.nomPro)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                              <span>🗑️</span>
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

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-slate-200">
              {filteredAndSortedProducts.map((producto) => {
                const stockStatus = getStockStatus(producto.stockProducto);
                return (
                  <div key={producto.codProducto} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                          {producto.nomPro.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{producto.nomPro}</h3>
                          <p className="text-sm text-slate-500">#{producto.codProducto}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">Precio</p>
                        <p className="text-lg font-semibold text-green-600">
                          S/ {parseFloat(producto.precioProducto).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Stock</p>
                        <p className="text-sm font-medium text-slate-900">
                          {producto.stockProducto} unidades
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/productos/${producto.codProducto}/edit`)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                      >
                        <span>✏️</span>
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.codProducto, producto.nomPro)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        <span>🗑️</span>
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Count */}
        {searchTerm && (
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              Se encontraron {filteredAndSortedProducts.length} producto(s) que coinciden con "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}