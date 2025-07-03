'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProducto } from '@/lib/api';

export default function CrearProducto() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    nomPro: '', 
    precioProducto: '', 
    stockProducto: '' 
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nomPro.trim()) {
      newErrors.nomPro = 'El nombre es requerido';
    }
    
    if (!form.precioProducto || parseFloat(form.precioProducto) <= 0) {
      newErrors.precioProducto = 'El precio debe ser mayor a 0';
    }
    
    if (!form.stockProducto || parseInt(form.stockProducto) < 0) {
      newErrors.stockProducto = 'El stock no puede ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      await createProducto({
        ...form,
        precioProducto: parseFloat(form.precioProducto),
        stockProducto: parseInt(form.stockProducto)
      });
      router.push('/productos');
    } catch (error) {
      console.error('Error al crear producto:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Crear Nuevo Producto</h1>
          <p className="text-slate-600">Agrega un nuevo producto a tu inventario</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span>📦</span>
              Información del Producto
            </h2>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.nomPro ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                  placeholder="Ej: Laptop Dell Inspiron 15"
                  value={form.nomPro}
                  onChange={(e) => {
                    setForm({ ...form, nomPro: e.target.value });
                    if (errors.nomPro) setErrors({ ...errors, nomPro: '' });
                  }}
                />
                {errors.nomPro && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>⚠</span> {errors.nomPro}
                  </p>
                )}
              </div>

              {/* Grid para Precio y Stock */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Precio Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Precio de Venta
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">S/</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                        errors.precioProducto ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-green-500'
                      }`}
                      placeholder="0.00"
                      value={form.precioProducto}
                      onChange={(e) => {
                        setForm({ ...form, precioProducto: e.target.value });
                        if (errors.precioProducto) setErrors({ ...errors, precioProducto: '' });
                      }}
                    />
                  </div>
                  {errors.precioProducto && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span> {errors.precioProducto}
                    </p>
                  )}
                </div>

                {/* Stock Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.stockProducto ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'
                    }`}
                    placeholder="Ej: 50"
                    value={form.stockProducto}
                    onChange={(e) => {
                      setForm({ ...form, stockProducto: e.target.value });
                      if (errors.stockProducto) setErrors({ ...errors, stockProducto: '' });
                    }}
                  />
                  {errors.stockProducto && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span> {errors.stockProducto}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Card */}
              {(form.nomPro || form.precioProducto || form.stockProducto) && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border-2 border-dashed border-slate-300">
                  <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                    <span>👁</span> Vista Previa
                  </h3>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <h4 className="font-semibold text-slate-800">
                      {form.nomPro || 'Nombre del producto'}
                    </h4>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-green-600 font-semibold">
                        S/ {form.precioProducto || '0.00'}
                      </span>
                      <span className="text-slate-500">
                        Stock: {form.stockProducto || '0'} unidades
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/productos')}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Crear Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}