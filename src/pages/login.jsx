import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://tulima-backend.vercel.app';

function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [identificador, setIdentificador] = useState('');
  const [contraseña, setContraseña]       = useState('');
  const [error, setError]                 = useState('');
  const [cargando, setCargando]           = useState(false);
  const [csrfToken, setCsrfToken]         = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/csrf-token`, { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken))
      .catch(() => {});
  }, []);

  const getToken = async () =>
    csrfToken ?? (await axios.get(`${API}/api/csrf-token`, { withCredentials: true })).data.csrfToken;

  const redirigir = (usuario) => {
    auth.login(usuario);
    if (usuario.rol === 'admin') return navigate('/admin');
    if (usuario.rol === 'proveedor') return navigate('/dashboard-proveedor');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const token = await getToken();
      const config = { headers: { 'X-CSRF-Token': token }, withCredentials: true };

      // Intento 1: login de usuario / admin (por nombreUsuario o correo)
      try {
        const res = await axios.post(`${API}/login`,
          { nombreUsuario: identificador, contraseña },
          config
        );
        return redirigir(res.data.usuario);
      } catch (errUsuario) {
        // Si no es 401 es un error inesperado, lo lanzamos
        if (errUsuario.response?.status !== 401) throw errUsuario;
      }

      // Intento 2: login de proveedor (por correo)
      try {
        const res = await axios.post(`${API}/login-proveedor`,
          { correo: identificador, contraseña },
          config
        );
        return redirigir(res.data.usuario);
      } catch (errProveedor) {
        if (errProveedor.response?.status !== 401) throw errProveedor;
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }

    } catch {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-500">
            Accede con tu cuenta de usuario, proveedor o administrador
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo o nombre de usuario
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              placeholder="ej. usuario@ejemplo.com"
              value={identificador}
              onChange={e => setIdentificador(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
          >
            {cargando ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400">o continúa con</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;