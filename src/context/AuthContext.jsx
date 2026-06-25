import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        // Intenta obtener el usuario de localStorage primero (para cargas rápidas)
        const usuarioGuardado = localStorage.getItem('usuarioTulima');
        if (usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }

        // Luego, verifica con el backend para confirmar la sesión (esto funciona para Google Login)
        const respuesta = await axios.get('https://tulima-backend.vercel.app/auth/me', { withCredentials: true });
        
        if (respuesta.data) {
          const usuarioActual = respuesta.data;
          setUsuario(usuarioActual);
          localStorage.setItem('usuarioTulima', JSON.stringify(usuarioActual));
        } else {
          // Si no hay sesión en el backend, limpia el estado y localStorage
          setUsuario(null);
          localStorage.removeItem('usuarioTulima');
        }
      } catch (error) {
        // Si la petición falla (ej. no hay sesión), nos aseguramos de que todo esté limpio
        console.log('No hay sesión activa o error al verificar.');
        setUsuario(null);
        localStorage.removeItem('usuarioTulima');
      } finally {
        setIsLoading(false);
      }
    };

    verificarSesion();
  }, []);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuarioTulima', JSON.stringify(datosUsuario));
  };

  const logout = async () => {
    await axios.post('https://tulima-backend.vercel.app/logout', {}, { withCredentials: true });
    setUsuario(null);
    localStorage.removeItem('usuarioTulima');
  };

  const value = { usuario, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
