import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const login = async (datosUsuario) => {
    // 1. Establece un estado de usuario inicial para una respuesta de UI rápida.
    setUsuario(datosUsuario);
    localStorage.setItem('usuarioTulima', JSON.stringify(datosUsuario));

    // 2. Inmediatamente después, busca el perfil completo para obtener todos los datos.
    // Esto soluciona el problema de que el saludo no muestre el nombre hasta recargar.
    try {
      const respuesta = await axios.get('https://tulima-backend.vercel.app/auth/me', { withCredentials: true });
      if (respuesta.data) {
        const usuarioCompleto = respuesta.data;
        setUsuario(usuarioCompleto);
        localStorage.setItem('usuarioTulima', JSON.stringify(usuarioCompleto));
      }
    } catch (error) {
      console.error("No se pudo obtener el perfil completo post-login, se usará data inicial.", error);
    }
  };

  const logout = async () => {
    try {
      // Para mayor seguridad, obtenemos el token CSRF justo antes de la petición
      const { data } = await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true });
      await axios.post('https://tulima-backend.vercel.app/logout', {}, {
        headers: { 'X-CSRF-Token': data.csrfToken },
        withCredentials: true
      });
    } catch (error) {
      console.error('Error en el backend al cerrar sesión, se procederá con la limpieza local:', error);
    } finally {
      setUsuario(null);
      localStorage.removeItem('usuarioTulima');
      navigate('/'); // Redirige al inicio después de cerrar sesión
    }
  };

  const value = { usuario, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
