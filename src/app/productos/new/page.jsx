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
  const [step, setStep] = useState(1);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nomPro.trim()) {
      newErrors.nomPro = 'El nombre es requerido';
    } else if (form.nomPro.length < 3) {
      newErrors.nomPro = 'El nombre debe tener al menos 3 caracteres';
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
      
      // Animación de éxito
      setStep(3);
      setTimeout(() => {
        router.push('/productos');
      }, 2000);
    } catch (error) {
      console.error('Error al crear producto:', error);
      setSaving(false);
    }
  };

  const getProductIcon = (nombre) => {
    if (!nombre) return { letter: '?', gradient: 'from-slate-400 to-slate-500' };
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

  const getStockColor = (stock) => {
    if (!stock || stock === 0) return 'text-red-600';
    if (stock <= 10) return 'text-amber-600';
    return 'text-emerald-600';
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <span className="text-6xl">✨</span>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            ¡Producto Creado!
          </h1>
          <p className="text-slate-600 mb-6">
            <span className="font-semibold text-emerald-600">{form.nomPro}</span> ha sido agregado exitosamente a tu inventario.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Redirigiendo...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Mejorado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl">✨</span>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg">+</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Crear Nuevo Producto
          </h1>
          <p className="text-slate-600 text-lg">
            Agrega un nuevo producto a tu inventario y gestiona tu stock
          </p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                1
              </div>
              <span className="text-sm font-semibold">Información</span>
            </div>
            <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
            }`}></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                2
              </div>
              <span className="text-sm font-semibold">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">📝</span>
                Información del Producto
              </h2>
              <p className="text-emerald-100 mt-1">Completa todos los campos requeridos</p>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Nombre Field Mejorado */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                    Nombre del Producto *
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 font-medium ${
                        errors.nomPro ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500 group-hover:border-slate-300'
                      }`}
                      placeholder="Ej: Laptop Dell Inspiron 15, iPhone 14 Pro..."
                      value={form.nomPro}
                      onChange={(e) => {
                        setForm({ ...form, nomPro: e.target.value });
                        if (errors.nomPro) setErrors({ ...errors, nomPro: '' });
                      }}
                    />
                    {form.nomPro && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.nomPro && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">
                      <span>⚠️</span> 
                      <span className="font-medium">{errors.nomPro}</span>
                    </div>
                  )}
                </div>

                {/* Grid para Precio y Stock */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Precio Field Mejorado */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      Precio de Venta *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold text-lg">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/20 font-bold text-lg ${
                          errors.precioProducto ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-green-500 group-hover:border-slate-300'
                        }`}
                        placeholder="0.00"
                        value={form.precioProducto}
                        onChange={(e) => {
                          setForm({ ...form, precioProducto: e.target.value });
                          if (errors.precioProducto) setErrors({ ...errors, precioProducto: '' });
                        }}
                      />
                      {form.precioProducto && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.precioProducto && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">
                        <span>⚠️</span> 
                        <span className="font-medium">{errors.precioProducto}</span>
                      </div>
                    )}
                  </div>

                  {/* Stock Field Mejorado */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                      Stock Inicial *
                    </label>
                    <div className="relative group">
                      <input
                        type="number"
                        min="0"
                        className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg ${
                          errors.stockProducto ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500 group-hover:border-slate-300'
                        }`}
                        placeholder="Ej: 50"
                        value={form.stockProducto}
                        onChange={(e) => {
                          setForm({ ...form, stockProducto: e.target.value });
                          if (errors.stockProducto) setErrors({ ...errors, stockProducto: '' });
                        }}
                      />
                      <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                        unidades
                      </span>
                      {form.stockProducto && (
                        <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.stockProducto && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">
                        <span>⚠️</span> 
                        <span className="font-medium">{errors.stockProducto}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons Mejorados */}
                <div className="flex gap-4 pt-8">
                  <button
                    type="button"
                    onClick={() => router.push('/productos')}
                    className="flex-1 px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20"
                  >
                    ← Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !form.nomPro || !form.precioProducto || !form.stockProducto}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚀</span>
                        Crear Producto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Vista Previa Mejorada */}
          <div className="space-y-6">
            {/* Preview Card Principal */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">👁️</span>
                  Vista Previa
                </h3>
                <p className="text-slate-300 mt-1">Así se verá tu producto</p>
              </div>
              
              <div className="p-8">
                {form.nomPro || form.precioProducto || form.stockProducto ? (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-dashed border-slate-300">
                    <div className="flex items-start gap-4 mb-4">
                      {(() => {
                        const icon = getProductIcon(form.nomPro);
                        return (
                          <div className={`w-16 h-16 bg-gradient-to-br ${icon.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                            {icon.letter}
                          </div>
                        );
                      })()}
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-xl mb-2">
                          {form.nomPro || 'Nombre del producto'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded-md">
                            #AUTO
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            !form.stockProducto || form.stockProducto === '0' 
                              ? 'bg-red-50 text-red-600' 
                              : parseInt(form.stockProducto) <= 10 
                                ? 'bg-amber-50 text-amber-600' 
                                : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {!form.stockProducto || form.stockProducto === '0' ? '🚫 Sin stock' : 
                             parseInt(form.stockProducto) <= 10 ? '⚠️ Stock bajo' : '✅ Disponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-emerald-600 font-bold mb-1">💰 PRECIO</p>
                        <p className="text-2xl font-bold text-emerald-700">
                          S/ {form.precioProducto ? parseFloat(form.precioProducto).toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-blue-600 font-bold mb-1">📦 STOCK</p>
                        <p className={`text-2xl font-bold ${getStockColor(form.stockProducto)}`}>
                          {form.stockProducto || '0'}
                        </p>
                        <p className="text-xs text-slate-500">unidades</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📦</span>
                    </div>
                    <p className="text-slate-500 text-lg">
                      Completa el formulario para ver la vista previa
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span>💡</span>
                Consejos para tu producto
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Usa nombres descriptivos y únicos para facilitar las búsquedas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Establece precios competitivos investigando el mercado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Mantén un stock mínimo de 10 unidades para evitar roturas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}