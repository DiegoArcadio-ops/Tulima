import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MapPin, Plus, Edit2, Trash2, X, LogOut,
  Building2, Utensils, Compass, Map as MapIcon,
  CheckCircle, Clock, XCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE = 'https://tulima-backend.vercel.app';

const SECCIONES = {
  hoteles: {
    titulo: 'Hoteles',
    url: `${BASE}/hoteles`,
    icono: Building2,
    nombreKey: 'nombre_hotel',
    campos: [
      { name: 'nombre_hotel', label: 'Nombre del hotel', type: 'text', required: true, placeholder: 'Ej. Hotel Volcán Colima' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text', required: true, placeholder: 'Ej. Av. Rey Coliman' },
      { name: 'numero_Calle', label: 'Número exterior', type: 'number', required: true, placeholder: 'Ej. 123' },
      { name: 'codigoPostal', label: 'Código postal', type: 'number', required: false, placeholder: 'Ej. 28000' },
      { name: 'telefono', label: 'Teléfono', type: 'text', required: false, placeholder: 'Ej. 3121234567' },
      { name: 'email', label: 'Correo electrónico', type: 'email', required: false, placeholder: 'Ej. contacto@hotel.com' },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false, placeholder: 'Describe tu hotel brevemente...' },
      { name: 'imagen', label: 'URL de la imagen', type: 'text', required: false, placeholder: 'https://...' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'id_categoria', label: 'Categoría', type: 'select', catalogo: 'categorias', valueKey: 'id_categoria', labelKey: 'nombre', required: true },
    ],
  },
  restaurantes: {
    titulo: 'Restaurantes',
    url: `${BASE}/restaurantes`,
    icono: Utensils,
    nombreKey: 'nombre',
    campos: [
      { name: 'nombre', label: 'Nombre del restaurante', type: 'text', required: true, placeholder: 'Ej. Mariscos El Pacífico' },
      { name: 'tipo', label: 'Tipo de restaurante', type: 'text', required: false, placeholder: 'Ej. Mariscos, Tacos, Italiana...' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text', required: true, placeholder: 'Ej. Calle Madero' },
      { name: 'numero_Calle', label: 'Número exterior', type: 'number', required: true, placeholder: 'Ej. 45' },
      { name: 'codigoPostal', label: 'Código postal', type: 'number', required: false, placeholder: 'Ej. 28000' },
      { name: 'telefono', label: 'Teléfono', type: 'text', required: false, placeholder: 'Ej. 3121234567' },
      { name: 'email', label: 'Correo electrónico', type: 'email', required: false, placeholder: 'Ej. contacto@restaurante.com' },
      { name: 'imagen', label: 'URL de la imagen', type: 'text', required: false, placeholder: 'https://...' },
      { name: 'horarioAbierto', label: 'Horario de apertura', type: 'time', required: false },
      { name: 'horarioCerrado', label: 'Horario de cierre', type: 'time', required: false },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'id_categoria', label: 'Categoría', type: 'select', catalogo: 'categorias', valueKey: 'id_categoria', labelKey: 'nombre', required: true },
    ],
  },
  tours: {
    titulo: 'Tours',
    url: `${BASE}/tours`,
    icono: Compass,
    nombreKey: 'nombre',
    campos: [
      { name: 'nombre', label: 'Nombre del tour', type: 'text', required: true, placeholder: 'Ej. Tour al Volcán de Colima' },
      { name: 'tipoTour', label: 'Tipo de tour', type: 'text', required: false, placeholder: 'Ej. Aventura, Cultural...' },
      { name: 'tipoServicio', label: 'Tipo de servicio', type: 'text', required: false, placeholder: 'Ej. Guiado, Privado...' },
      { name: 'telefono', label: 'Teléfono de contacto', type: 'text', required: false, placeholder: 'Ej. 3121234567' },
      { name: 'imagen', label: 'URL de la imagen', type: 'text', required: false, placeholder: 'https://...' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
    ],
  },
  destinos: {
    titulo: 'Destinos',
    url: `${BASE}/destinos`,
    icono: MapIcon,
    nombreKey: 'nombre',
    campos: [
      { name: 'nombre', label: 'Nombre del destino / evento', type: 'text', required: true, placeholder: 'Ej. Festival de la Chayota 2026' },
      { name: 'nombre_Calle', label: 'Calle o lugar', type: 'text', required: false, placeholder: 'Ej. Plaza Principal' },
      { name: 'numero_Calle', label: 'Número exterior', type: 'number', required: false, placeholder: 'Ej. 1' },
      { name: 'imagen', label: 'URL de la imagen', type: 'text', required: false, placeholder: 'https://...' },
      { name: 'horarioAbierto', label: 'Hora de inicio', type: 'time', required: false },
      { name: 'horarioCerrado', label: 'Hora de fin', type: 'time', required: false },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'id_categoria', label: 'Categoría', type: 'select', catalogo: 'categorias', valueKey: 'id_categoria', labelKey: 'nombre', required: false },
    ],
  },
};

const obtenerId = (item) =>
  item.id_hotel || item.id_restaurante || item.id_tour || item.id_destino || item.id;

function BadgeEstado({ activo }) {
  if (activo === true) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Activo
    </span>
  );
  if (activo === false) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">
      <XCircle className="w-3 h-3" /> Inactivo
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Pendiente
    </span>
  );
}

export default function DashboardProveedor() {
  const [seccionActiva, setSeccionActiva] = useState('hoteles');
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [catalogos, setCatalogos] = useState({ municipios: [], categorias: [] });
  const { usuario } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState(null);
  const [formData, setFormData] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);

  const seccionActual = SECCIONES[seccionActiva];

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const { data } = await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(data.csrfToken);
      } catch (e) { console.warn('CSRF no disponible', e); }
    };
    fetchCsrf();

    const cargarCatalogos = async () => {
      const [resMun, resCat] = await Promise.allSettled([
        axios.get(`${BASE}/municipios`),
        axios.get(`${BASE}/categorias`),
      ]);
      setCatalogos({
        municipios: resMun.status === 'fulfilled' ? resMun.value.data : [],
        categorias: resCat.status === 'fulfilled' ? resCat.value.data : [],
      });
    };
    cargarCatalogos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(seccionActual.url, { withCredentials: true });
      setDatos(res.data);
    } catch {
      setError('No se pudieron cargar los registros. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [seccionActiva]);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdActual(null);
    const inicial = {};
    seccionActual.campos.forEach(c => { inicial[c.name] = ''; });
    setFormData(inicial);
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setModoEdicion(true);
    setIdActual(obtenerId(item));
    setFormData({ ...item });
    setModalAbierto(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const token = csrfToken ?? (await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true })).data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
      const payload = { ...formData };

      Object.keys(payload).forEach(k => {
        if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
      });
      if (payload.numero_Calle) payload.numero_Calle = Number(payload.numero_Calle);
      if (payload.codigoPostal) payload.codigoPostal = Number(payload.codigoPostal);
      if (payload.id_municipio) payload.id_municipio = Number(payload.id_municipio);
      if (payload.id_categoria) payload.id_categoria = Number(payload.id_categoria);
      if (payload.telefono) payload.telefono = String(payload.telefono);

      if (!modoEdicion) {
        payload.estadoConvenio = true;
        payload.activo = false;
      }

      if (modoEdicion) {
        await axios.put(`${seccionActual.url}/${idActual}`, payload, config);
        mostrarToast('Registro actualizado correctamente');
      } else {
        await axios.post(seccionActual.url, payload, config);
        mostrarToast('Registro enviado — quedará visible tras la aprobación del administrador');
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors.map(e => `${e.path || e.param}: ${e.msg}`).join(' · ')
        : err.response?.data?.error || 'Error al guardar. Intenta de nuevo.';
      mostrarToast(msg, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (item) => {
    const nombre = item[seccionActual.nombreKey] || 'este registro';
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      const token = csrfToken ?? (await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true })).data.csrfToken;
      await axios.delete(`${seccionActual.url}/${obtenerId(item)}`, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': token },
      });
      mostrarToast('Registro eliminado');
      cargarDatos();
    } catch {
      mostrarToast('No se pudo eliminar el registro', 'error');
    }
  };

  const iniciales = usuario?.primerNombre?.[0]?.toUpperCase() || 'P';
  const totalActivos = datos.filter(d => d.activo === true).length;
  const totalPendientes = datos.filter(d => !d.activo).length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.tipo === 'error'
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {toast.tipo === 'error'
            ? <XCircle className="w-4 h-4 flex-shrink-0" />
            : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="max-w-xs">{toast.mensaje}</span>
        </div>
      )}

      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 flex-shrink-0">
        <div className="p-6 flex items-center gap-2">
          <MapPin className="text-[#00a8ff] w-7 h-7" />
          <span className="text-xl font-bold text-slate-800">Tulima</span>
          <span className="bg-[#00a8ff]/10 text-[#00a8ff] text-xs px-2 py-0.5 rounded-md ml-1 font-medium">Proveedor</span>
        </div>

        {usuario && (
          <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#00a8ff] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {iniciales}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{usuario.primerNombre}</p>
                <p className="text-xs text-slate-500">Proveedor de servicios</p>
              </div>
            </div>
          </div>
        )}

        <div className="mx-4 mb-4 grid grid-cols-2 gap-2">
          <div className="bg-green-50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-green-700">{totalActivos}</p>
            <p className="text-xs text-green-600">Activos</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-amber-700">{totalPendientes}</p>
            <p className="text-xs text-amber-600">Pendientes</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {Object.entries(SECCIONES).map(([key, config]) => {
            const Icono = config.icono;
            const activo = seccionActiva === key;
            return (
              <button
                key={key}
                onClick={() => setSeccionActiva(key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  activo
                    ? 'bg-[#00a8ff]/10 text-[#00a8ff]'
                    : 'hover:bg-slate-50 text-slate-600 hover:text-[#00a8ff]'
                }`}
              >
                <Icono className="w-5 h-5 flex-shrink-0" />
                <span>{config.titulo}</span>
                {activo && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <a href="/" className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Salir al sitio principal
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto">

          <header className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{seccionActual.titulo}</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Gestiona tus {seccionActual.titulo.toLowerCase()} — los nuevos quedarán pendientes de aprobación.
              </p>
            </div>
            <button
              onClick={abrirModalCrear}
              className="flex items-center gap-2 bg-[#00a8ff] hover:bg-[#0097e6] text-white px-5 py-2.5 rounded-full font-medium transition-all text-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Agregar {seccionActual.titulo.slice(0, -1)}
            </button>
          </header>

          <div className="mb-6 flex items-start gap-3 bg-[#00a8ff]/5 border border-[#00a8ff]/20 rounded-xl p-4">
            <Clock className="w-4 h-4 text-[#00a8ff] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              Los registros nuevos aparecen como <span className="font-medium text-amber-600">Pendiente</span> hasta que el administrador los active. Una vez activos son visibles para los turistas.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 h-16 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          ) : datos.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
              {React.createElement(seccionActual.icono, { className: 'w-12 h-12 text-slate-300 mx-auto mb-4' })}
              <p className="text-slate-500 font-medium">Aún no tienes {seccionActual.titulo.toLowerCase()} registrados</p>
              <p className="text-slate-400 text-sm mt-1">Agrega el primero con el botón de arriba</p>
              <button onClick={abrirModalCrear} className="mt-4 text-[#00a8ff] text-sm hover:underline font-medium">
                + Agregar {seccionActual.titulo.slice(0, -1)}
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-medium uppercase tracking-wide">
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Municipio</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {datos.map(item => (
                    <tr key={obtenerId(item)} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 text-sm">
                          {item[seccionActual.nombreKey] || item.nombre || item.nombre_hotel}
                        </div>
                        {item.tipo && <div className="text-xs text-slate-400 mt-0.5">{item.tipo}</div>}
                        {item.tipoTour && <div className="text-xs text-slate-400 mt-0.5">{item.tipoTour}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.municipio?.nombre || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <BadgeEstado activo={item.activo} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => abrirModalEditar(item)}
                            className="p-2 text-slate-400 hover:text-[#00a8ff] hover:bg-[#00a8ff]/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminar(item)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {modoEdicion ? 'Editar' : 'Nuevo'} {seccionActual.titulo.slice(0, -1)}
                </h3>
                {!modoEdicion && (
                  <p className="text-xs text-slate-400 mt-0.5">Quedará pendiente hasta que el admin lo apruebe</p>
                )}
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardar} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
              {seccionActual.campos.map(campo => {
                if (campo.type === 'textarea') return (
                  <div key={campo.name}>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {campo.label} {campo.required && <span className="text-red-400">*</span>}
                    </label>
                    <textarea
                      name={campo.name}
                      value={formData[campo.name] || ''}
                      onChange={handleChange}
                      placeholder={campo.placeholder}
                      rows="3"
                      required={campo.required}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/40 focus:border-[#00a8ff] transition-all resize-none"
                    />
                  </div>
                );
                if (campo.type === 'select') {
                  const opciones = catalogos[campo.catalogo] || [];
                  return (
                    <div key={campo.name}>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {campo.label} {campo.required && <span className="text-red-400">*</span>}
                      </label>
                      <select
                        name={campo.name}
                        value={formData[campo.name] || ''}
                        onChange={e => setFormData(prev => ({ ...prev, [campo.name]: e.target.value ? parseInt(e.target.value) : '' }))}
                        required={campo.required}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/40 focus:border-[#00a8ff] bg-white transition-all"
                      >
                        <option value="">Selecciona una opción...</option>
                        {opciones.map(op => (
                          <option key={op[campo.valueKey]} value={op[campo.valueKey]}>
                            {op[campo.labelKey]}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return (
                  <div key={campo.name}>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {campo.label} {campo.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type={campo.type}
                      name={campo.name}
                      value={formData[campo.name] || ''}
                      onChange={handleChange}
                      placeholder={campo.placeholder}
                      required={campo.required}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/40 focus:border-[#00a8ff] transition-all"
                    />
                  </div>
                );
              })}
            </form>

            <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="px-5 py-2.5 bg-[#00a8ff] hover:bg-[#0097e6] disabled:opacity-60 text-white font-medium rounded-xl transition-all text-sm"
              >
                {guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Enviar para revisión'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}