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
  const [originalForm, setOriginalForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (codProducto) {
      getProducto(codProducto)
        .then((data) => {
          setForm(data);
          setOriginalForm(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [codProducto]);

  useEffect(() => {
    const changed = JSON.stringify(form) !== JSON.stringify(originalForm);
    setHasChanges(changed);
  }, [form, originalForm]);

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
      await updateProducto(codProducto, {
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
      console.error('Error al actualizar:', error);
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

  const getStockStatus = (stock) => {
    if (stock === 0) return { 
      color: 'bg-red-50 text-red-700 border-red-200', 
      text: 'Sin Stock',
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

  const getChangedFields = () => {
    const changes = [];
    if (form.nomPro !== originalForm.nomPro) {
      changes.push({ field: 'Nombre', old: originalForm.nomPro, new: form.nomPro });
    }
    if (parseFloat(form.precioProducto) !== parseFloat(originalForm.precioProducto)) {
      changes.push({ 
        field: 'Precio', 
        old: `S/ ${parseFloat(originalForm.precioProducto).toFixed(2)}`, 
        new: `S/ ${parseFloat(form.precioProducto).toFixed(2)}` 
      });
    }
    if (parseInt(form.stockProducto) !== parseInt(originalForm.stockProducto)) {
      changes.push({ 
        field: 'Stock', 
        old: `${originalForm.stockProducto} unidades`, 
        new: `${form.stockProducto} unidades` 
      });
    }
    return changes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-amber-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Cargando producto</h3>
            <p className="text-slate-600">Obteniendo información...</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <span className="text-6xl">💾</span>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            ¡Producto Actualizado!
          </h1>
          <p className="text-slate-600 mb-6">
            Los cambios en <span className="font-semibold text-amber-600">{form.nomPro}</span> han sido guardados exitosamente.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            Redirigiendo...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Mejorado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl">✏️</span>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg">📝</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Editar Producto
          </h1>
          <p className="text-slate-600 text-lg mb-2">
            Modifica la información de tu producto
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            <span>🏷️</span>
            Código: #{codProducto}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">📝</span>
                Actualizar Información
              </h2>
              <p className="text-amber-100 mt-1">
                {hasChanges ? 'Hay cambios sin guardar' : 'Sin cambios pendientes'}
              </p>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Nombre Field */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                    Nombre del Producto *
                    {form.nomPro !== originalForm.nomPro && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        Modificado
                      </span>
                    )}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 font-medium ${
                        errors.nomPro ? 'border-red-300 focus:border-red-500' : 
                        form.nomPro !== originalForm.nomPro ? 'border-blue-300 focus:border-blue-500' :
                        'border-slate-200 focus:border-amber-500 group-hover:border-slate-300'
                      }`}
                      placeholder="Ingresa el nombre del producto"
                      value={form.nomPro}
                      onChange={(e) => {
                        setForm({ ...form, nomPro: e.target.value });
                        if (errors.nomPro) setErrors({ ...errors, nomPro: '' });
                      }}
                    />
                    {form.nomPro && form.nomPro !== originalForm.nomPro && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">✎</span>
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
                  {/* Precio Field */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      Precio de Venta *
                      {parseFloat(form.precioProducto) !== parseFloat(originalForm.precioProducto) && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                          Modificado
                        </span>
                      )}
                    </label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold text-lg">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/20 font-bold text-lg ${
                          errors.precioProducto ? 'border-red-300 focus:border-red-500' : 
                          parseFloat(form.precioProducto) !== parseFloat(originalForm.precioProducto) ? 'border-blue-300 focus:border-blue-500' :
                          'border-slate-200 focus:border-green-500 group-hover:border-slate-300'
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
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">
                        <span>⚠️</span> 
                        <span className="font-medium">{errors.precioProducto}</span>
                      </div>
                    )}
                  </div>

                  {/* Stock Field */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                      Stock Disponible *
                      {parseInt(form.stockProducto) !== parseInt(originalForm.stockProducto) && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                          Modificado
                        </span>
                      )}
                    </label>
                    <div className="relative group">
                      <input
                        type="number"
                        min="0"
                        className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg ${
                          errors.stockProducto ? 'border-red-300 focus:border-red-500' : 
                          parseInt(form.stockProducto) !== parseInt(originalForm.stockProducto) ? 'border-blue-300 focus:border-blue-500' :
                          'border-slate-200 focus:border-blue-500 group-hover:border-slate-300'
                        }`}
                        placeholder="Cantidad en stock"
                        value={form.stockProducto}
                        onChange={(e) => {
                          setForm({ ...form, stockProducto: e.target.value });
                          if (errors.stockProducto) setErrors({ ...errors, stockProducto: '' });
                        }}
                      />
                      <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                        unidades
                      </span>
                    </div>
                    {errors.stockProducto && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl">
                        <span>⚠️</span> 
                        <span className="font-medium">{errors.stockProducto}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
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
                    disabled={saving || !hasChanges}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">💾</span>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Vista Previa y Comparación */}
          <div className="space-y-6">
            {/* Vista Previa Actual */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">👁️</span>
                  Vista Actual
                </h3>
                <p className="text-slate-300 mt-1">Así se ve tu producto actualmente</p>
              </div>
              
              <div className="p-8">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6">
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
                        {form.nomPro}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded-md">
                          #{codProducto}
                        </span>
                        {(() => {
                          const status = getStockStatus(parseInt(form.stockProducto));
                          return (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                              <span>{status.icon}</span>
                              {status.text}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-xs text-emerald-600 font-bold mb-1">💰 PRECIO</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        S/ {parseFloat(form.precioProducto).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-xs text-blue-600 font-bold mb-1">📦 STOCK</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {form.stockProducto}
                      </p>
                      <p className="text-xs text-slate-500">unidades</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Cambios */}
            {hasChanges && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <span>🔄</span>
                  Cambios Pendientes
                </h4>
                <div className="space-y-3">
                  {getChangedFields().map((change, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-700">{change.field}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                          Modificado
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Anterior:</p>
                          <p className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {change.old}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Nuevo:</p>
                          <p className="font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                            {change.new}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span>💡</span>
                Consejos de edición
              </h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Revisa cuidadosamente los cambios antes de guardar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Los cambios de precio afectarán futuras ventas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Actualiza el stock regularmente para mantener precisión</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}