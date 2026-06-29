import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function RutaProtegidaProveedor({ children }) {
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    const verificarPermisos = async () => {
      try {
        const respuesta = await axios.get('https://tulima-backend.vercel.app/auth/me', {
          withCredentials: true
        });
        const usuario = respuesta.data;

        if (usuario.rol === 'proveedor' || usuario.id_rol === 2) {
          setEstado('permitido');
        } else {
          setEstado('denegado');
        }
      } catch (error) {
        setEstado('denegado');
      }
    };
    verificarPermisos();
  }, []);

  if (estado === 'cargando') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a8ff]"></div>
        <p className="mt-4 text-slate-500 font-medium">Verificando acceso de proveedor...</p>
      </div>
    );
  }

  if (estado === 'denegado') {
    return <Navigate to="/login" replace />;
  }

  return children;
}