import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONOS = {
  success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
  error:   <XCircle    className="w-5 h-5 text-red-500   flex-shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  info:    <Info       className="w-5 h-5 text-blue-500  flex-shrink-0" />,
};

const ESTILOS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50   border-red-200   text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-blue-50  border-blue-200  text-blue-800',
};

export function Toast({ mensaje, tipo = 'info', onClose, duracion = 3500 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duracion);
    return () => clearTimeout(t);
  }, [onClose, duracion]);

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-sm animate-fade-in ${ESTILOS[tipo]}`}>
      {ICONOS[tipo]}
      <span className="flex-1">{mensaje}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}