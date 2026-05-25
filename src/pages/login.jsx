import React, { useState , useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const URL = "https://tulima-backend.vercel.app/login";

function Login() { 
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;
      
      const respuesta = await axios.post(URL,
        { nombreUsuario: nombreUsuario, contraseña: contraseña },
        {
          headers: { 'X-CSRF-Token': token },
          withCredentials: true
        }
      );
      
      if (respuesta.status === 200 || respuesta.status === 201) {

        const usuarioLogueado = respuesta.data.usuario; 
        
        if (usuarioLogueado) {
          localStorage.setItem('usuarioTulima', JSON.stringify(usuarioLogueado));

          if (usuarioLogueado.rol === 'admin' || usuarioLogueado.id_rol === 1) {
            navigate('/admin'); 
          } else {
            navigate('/'); 
          }
        } else {
          navigate('/'); 
        }

      } else if (respuesta.data?.mfaRequired) {
      }
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://tulima-backend.vercel.app/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nombreUsuario" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                autoComplete="nombreUsuario"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contraseña" className="sr-only">
                Contraseña
              </label>
              <input
                id="contraseña"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              ¿No tienes cuenta?{' '}
              <a href="/registro" className="font-medium text-blue-600 hover:text-blue-500">
                Regístrate aquí
              </a>
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continuar con Google
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;