import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const URL_USER = "https://tulima-backend.vercel.app/login";
// Ajusta esta URL a la ruta de tu backend para proveedores
const URL_PROVIDER = "https://tulima-backend.vercel.app/login-proveedor"; 

function Login() {
  const navigate = useNavigate();
  const auth = useAuth(); // Usamos el contexto
  const [csrfToken, setCsrfToken] = useState(null);

  // Estados para Usuario Normal
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');

  // Estados para Proveedor
  const [proveedorEmail, setProveedorEmail] = useState('');
  const [proveedorRFC, setProveedorRFC] = useState('');
  const [proveedorContraseña, setProveedorContraseña] = useState('');
  const [errorProveedor, setErrorProveedor] = useState('');

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const { data } = await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true });
        setCsrfToken(data.csrfToken);
      } catch (e) {
        console.warn('No se pudo obtener CSRF token', e);
      }
    };
    fetchCsrf();
  }, []);

  // Handler para Login de Usuario Normal
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setErrorUsuario('');
    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;

      const respuesta = await axios.post(URL_USER,
        { nombreUsuario: nombreUsuario, contraseña: contraseña },
        {
          headers: { 'X-CSRF-Token': token },
          withCredentials: true
        }
      );

      if (respuesta.status === 200 || respuesta.status === 201) {
        const usuarioLogueado = respuesta.data.usuario;
        if (usuarioLogueado) {
          auth.login(usuarioLogueado); // Usamos la función del contexto
          if (usuarioLogueado.rol === 'admin' || usuarioLogueado.id_rol === 1) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } else if (respuesta.data?.mfaRequired) {
        // Lógica de MFA
      }
    } catch (error) {
      console.error("Error al iniciar sesión de usuario:", error);
      setErrorUsuario('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    }
  };

  // Handler para Login de Proveedor
  const handleProviderSubmit = async (e) => {
    e.preventDefault();
    setErrorProveedor('');
    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;

      const respuesta = await axios.post(URL_PROVIDER,
        { 
          email: proveedorEmail, 
          rfc: proveedorRFC, 
          contraseña: proveedorContraseña 
        },
        {
          headers: { 'X-CSRF-Token': token },
          withCredentials: true
        }
      );

      if (respuesta.status === 200 || respuesta.status === 201) {
        const proveedorLogueado = respuesta.data.proveedor;
        if (proveedorLogueado) {
          auth.login(proveedorLogueado); // Usamos la función del contexto también para proveedores
          navigate('/panel-proveedor'); // Redirige al dashboard de proveedor
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión de proveedor:", error);
      setErrorProveedor('Credenciales de proveedor inválidas. Verifica tus datos.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://tulima-backend.vercel.app/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Contenedor Principal Más Ancho para soportar las dos columnas */}
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 lg:gap-12 relative">
        
        {/* =========================================
            COLUMNA IZQUIERDA: INICIO DE SESIÓN USUARIOS
            ========================================= */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900 uppercase">
              Inicio de Sesión Usuarios
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accede a tu cuenta para planear tu experiencia
            </p>
          </div>
          
          {errorUsuario && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm" role="alert">
              <span className="block sm:inline">{errorUsuario}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleUserSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico (Usuario)
                </label>
                <input
                  id="nombreUsuario"
                  name="nombreUsuario"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ej. usuario@ejemplo.com"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contraseñaUsuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="contraseñaUsuario"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tu contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Iniciar Sesión (Usuario)
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-4">
                ¿No tienes cuenta?{' '}
                <a href="/registro" className="font-medium text-blue-600 hover:text-blue-500">
                  Regístrate aquí
                </a>
              </p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continuar con Google
              </button>
            </div>
          </form>
        </div>

        {/* Separador Visual (Solo visible en pantallas medianas o grandes) */}
        <div className="hidden md:flex flex-col items-center justify-center relative">
          <div className="absolute inset-y-0 w-px bg-gray-300"></div>
          <span className="relative bg-gray-50 px-3 py-1 text-sm text-gray-500 font-bold uppercase rounded-full border border-gray-300">
            O
          </span>
        </div>

        {/* =========================================
            COLUMNA DERECHA: INICIO DE SESIÓN PROVEEDORES
            ========================================= */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900 uppercase">
              Inicio de Sesión Proveedores
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Gestiona tus servicios comerciales
            </p>
          </div>

          {errorProveedor && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm" role="alert">
              <span className="block sm:inline">{errorProveedor}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleProviderSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="proveedorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Corporativo
                </label>
                <input
                  id="proveedorEmail"
                  name="proveedorEmail"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
                  placeholder="ej. ventas@proveedor.com"
                  value={proveedorEmail}
                  onChange={(e) => setProveedorEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="proveedorContraseña" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="proveedorContraseña"
                  name="proveedorContraseña"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
                  placeholder="Tu contraseña"
                  value={proveedorContraseña}
                  onChange={(e) => setProveedorContraseña(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-colors"
              >
                Iniciar Sesión (Proveedor)
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿Nuevo proveedor?{' '}
                <a href="/registro-proveedor" className="font-medium text-slate-800 hover:text-slate-600">
                  Registrate aquí
                </a>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;