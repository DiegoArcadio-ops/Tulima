import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building2, Utensils, Compass, MapPin, Calendar, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const TIPOS_SERVICIO = [
  { id: 'hoteles',      label: 'Hotel',       desc: 'Alojamiento y hospedaje',         icono: Building2  },
  { id: 'restaurantes', label: 'Restaurante', desc: 'Gastronomía y alimentos',          icono: Utensils   },
  { id: 'tours',        label: 'Tour',        desc: 'Excursiones y guías turísticos',   icono: Compass    },
  { id: 'destinos',     label: 'Destino',     desc: 'Lugares y atracciones turísticas', icono: MapPin     },
  { id: 'eventos',      label: 'Evento',      desc: 'Festivales y eventos culturales',  icono: Calendar   },
];

function RegistroProveedor() {
  const [paso, setPaso] = useState(1);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [formData, setFormData] = useState({
    primerNombre: '',
    nombreUsuario: '',
    correo: '',
    rfc: '',
    contraseña: '',
    telefono: '',
    genero: '',
    edad: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [csrfToken, setCsrfToken] = useState(null);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;

      const respuesta = await axios.post('https://tulima-backend.vercel.app/proveedores', {
        primerNombre:      formData.primerNombre,
        nombreUsuario:     formData.nombreUsuario,
        correoCorporativo: formData.correo,
        rfc:               formData.rfc,
        contraseña:        formData.contraseña,
        tipo_servicio:     tipoSeleccionado,
        telefono:          formData.telefono || null,
        genero:            formData.genero,
        edad:              formData.edad ? parseInt(formData.edad) : null
      }, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': token }
      });

      if (respuesta.status === 201) {
        setExito('¡Solicitud enviada! El administrador revisará y activará tu cuenta. Te notificaremos por correo.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('Error en el registro de proveedor:', err);
      setError(err.response?.data?.error || 'Hubo un problema al crear la cuenta. Inténtalo de nuevo.');
    }
  };

  const tipoActual = TIPOS_SERVICIO.find(t => t.id === tipoSeleccionado);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full space-y-6">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Registro de Proveedor</h2>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para ofrecer tus servicios en Tulima
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4">
          {[1, 2].map(n => (
            <React.Fragment key={n}>
              <div className={`flex items-center gap-2 text-sm font-medium ${paso >= n ? 'text-[#00a8ff]' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  paso > n
                    ? 'bg-[#00a8ff] border-[#00a8ff] text-white'
                    : paso === n
                    ? 'border-[#00a8ff] text-[#00a8ff]'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {paso > n ? <CheckCircle className="w-4 h-4" /> : n}
                </div>
                <span className="hidden sm:block">{n === 1 ? 'Tipo de servicio' : 'Datos de registro'}</span>
              </div>
              {n < 2 && <div className={`flex-1 max-w-16 h-0.5 ${paso > n ? 'bg-[#00a8ff]' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Alertas */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {exito && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">{exito}</div>
        )}

        {/* ── PASO 1: Selección de tipo ── */}
        {paso === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-1">¿Qué tipo de servicio ofrecerás?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Solo podrás registrar <strong>un tipo de servicio</strong> por cuenta. Elige con cuidado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TIPOS_SERVICIO.map(({ id, label, desc, icono: Icono }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTipoSeleccionado(id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all text-left ${
                    tipoSeleccionado === id
                      ? 'border-[#00a8ff] bg-[#00a8ff]/5 shadow-md'
                      : 'border-gray-200 hover:border-[#00a8ff]/40 hover:bg-gray-50'
                  }`}
                >
                  {tipoSeleccionado === id && (
                    <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-[#00a8ff]" />
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tipoSeleccionado === id ? 'bg-[#00a8ff] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icono className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-sm ${tipoSeleccionado === id ? 'text-[#00a8ff]' : 'text-gray-800'}`}>{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!tipoSeleccionado}
                onClick={() => setPaso(2)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#00a8ff] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all hover:bg-[#0097e6] text-sm"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: Datos de registro ── */}
        {paso === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            {/* Resumen del tipo elegido */}
            {tipoActual && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-[#00a8ff]/5 border border-[#00a8ff]/20 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#00a8ff] flex items-center justify-center text-white flex-shrink-0">
                  <tipoActual.icono className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Tipo de servicio: <span className="text-[#00a8ff]">{tipoActual.label}</span></p>
                  <p className="text-xs text-gray-500">{tipoActual.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="ml-auto text-xs text-[#00a8ff] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Cambiar
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del representante o Empresa *</label>
                <input
                  name="primerNombre" type="text" required
                  placeholder="Tu nombre o Razón Social"
                  value={formData.primerNombre} onChange={handleChange}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de usuario *</label>
                <input
                  name="nombreUsuario" type="text" required
                  placeholder="Ej. proveedor123"
                  value={formData.nombreUsuario} onChange={handleChange}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Correo de Contacto *</label>
                <input
                  name="correo" type="email" required
                  placeholder="Ej. ventas@empresa.com"
                  value={formData.correo} onChange={handleChange}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">RFC (Identificación Fiscal) *</label>
                <input
                  name="rfc" type="text" required
                  placeholder="Ej. ABC123456T1"
                  value={formData.rfc} onChange={handleChange}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  name="contraseña" type="password" required
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contraseña} onChange={handleChange}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono comercial</label>
                <input
                  name="telefono" type="tel"
                  placeholder="Ej. 3121234567"
                  value={formData.telefono} onChange={handleChange}
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Género</label>
                  <select
                    name="genero" value={formData.genero} onChange={handleChange}
                    className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="N/A">Empresa / No aplica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Edad</label>
                  <input
                    name="edad" type="number" min="0" max="120"
                    placeholder="Ej. 35"
                    value={formData.edad} onChange={handleChange}
                    className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-[#00a8ff] focus:border-[#00a8ff] sm:text-sm"
                  />
                </div>
              </div>

              {/* Aviso de aprobación */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Tu cuenta quedará <strong>pendiente de aprobación</strong> por el administrador antes de poder iniciar sesión.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setPaso(1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-all"
                >
                  Enviar solicitud
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="font-medium text-[#00a8ff] hover:text-blue-500">Inicia sesión aquí</a>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RegistroProveedor;
