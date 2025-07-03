'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProducto, updateProducto } from '@/lib/api';

export default function EditarProducto() {
  const router = useRouter();
  const params = useParams();
  const codProducto = params.codProducto;
  
  const [form, setForm] = useState({
    nomPro: '',
    precioProducto: '',
    stockProducto: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (codProducto) {
      getProducto(codProducto)
        .then((data) => {
          setForm(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [codProducto]);

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
      await updateProducto(codProducto, {
        ...form,
        precioProducto: parseFloat(form.precioProducto),
        stockProducto: parseInt(form.stockProducto)
      });
      router.push('/productos');
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Editar Producto</h1>
          <p className="text-slate-600">Modifica la información del producto</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.nomPro ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  placeholder="Ingresa el nombre del producto"
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

              {/* Precio Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Precio
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
                  Stock Disponible
                </label>
                <input
                  type="number"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                    errors.stockProducto ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'
                  }`}
                  placeholder="Cantidad en stock"
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Guardar Cambios
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