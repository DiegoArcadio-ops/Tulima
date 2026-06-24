import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistroProveedor() {
  const [formData, setFormData] = useState({
    primerNombre: '',
    nombreUsuario: '',
    correoCorporativo: '', // Nuevo campo
    rfc: '',               // Nuevo campo
    contraseña: '',
    telefono: '',
    genero: '',
    edad: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      // NOTA: Ajusta esta URL a la ruta de tu backend que procesa proveedores
      const respuesta = await axios.post('https://tulima-backend.vercel.app/proveedores', {
        primerNombre: formData.primerNombre,
        nombreUsuario: formData.nombreUsuario,
        correoCorporativo: formData.correoCorporativo,
        rfc: formData.rfc,
        contraseña: formData.contraseña,
        telefono: formData.telefono ? formData.telefono : null,
        genero: formData.genero,
        edad: formData.edad ? parseInt(formData.edad) : null
      });

      if (respuesta.status === 201) {
        setExito('¡Cuenta de proveedor creada con éxito! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Error en el registro de proveedor:', err);
      setError(err.response?.data?.error || 'Hubo un problema al crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro de Proveedor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para ofrecer tus servicios en nuestra plataforma
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              <span>{error}</span>
            </div>
          )}

          {exito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm" role="alert">
              <span>{exito}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="primerNombre" className="block text-xs font-medium text-gray-700 mb-1">
                Nombre del representante o Empresa
              </label>
              <input
                id="primerNombre"
                name="primerNombre"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tu nombre o Razón Social"
                value={formData.primerNombre}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="nombreUsuario" className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ej. proveedor123"
                value={formData.nombreUsuario}
                onChange={handleChange}
              />
            </div>

            {/* --- INICIO CAMPOS NUEVOS --- */}
            <div>
              <label htmlFor="correoCorporativo" className="block text-xs font-medium text-gray-700 mb-1">
                Correo Corporativo
              </label>
              <input
                id="correoCorporativo"
                name="correoCorporativo"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ej. ventas@empresa.com"
                value={formData.correoCorporativo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="rfc" className="block text-xs font-medium text-gray-700 mb-1">
                RFC (Identificación Fiscal)
              </label>
              <input
                id="rfc"
                name="rfc"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ej. ABC123456T1"
                value={formData.rfc}
                onChange={handleChange}
              />
            </div>
            {/* --- FIN CAMPOS NUEVOS --- */}

            <div>
              <label htmlFor="contraseña" className="block text-xs font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Crea una contraseña segura"
                value={formData.contraseña}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-xs font-medium text-gray-700 mb-1">
                Número de teléfono comercial
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ej. 3121234567"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="genero" className="block text-xs font-medium text-gray-700 mb-1">
                  Género (Opcional)
                </label>
                <select
                  id="genero"
                  name="genero"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.genero}
                  onChange={handleChange}
                >
                  <option value="">Selecciona...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro / Prefiero no decir</option>
                  <option value="N/A">Empresa / No aplica</option>
                </select>
              </div>

              <div>
                <label htmlFor="edad" className="block text-xs font-medium text-gray-700 mb-1">
                  Edad (Opcional)
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  min="0"
                  max="120"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ej. 35"
                  value={formData.edad}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 mt-4 transition-colors"
            >
              Registrarse como Proveedor
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistroProveedor;