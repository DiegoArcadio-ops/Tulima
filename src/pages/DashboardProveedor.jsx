import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MapPin, Plus, Edit2, Trash2, X, LogOut,
  Building2, Utensils, Compass, Map as MapIcon, Calendar,
  CheckCircle, Clock, XCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModalConfirm } from '../components/ModalConfirm';
import MiniMap from '../components/MiniMap';

const BASE = 'https://tulima-backend.vercel.app';

const SECCIONES = {
  hoteles: {
    titulo: 'Hoteles',
    url: `${BASE}/hoteles`,
    urlMios: `${BASE}/hoteles/mios`,
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
      { name: 'imagen', label: 'Imagen', type: 'file', required: false, placeholder: 'Sube una foto desde tu dispositivo' },
      { name: 'estrellas', label: 'Estrellas', type: 'number', required: false, placeholder: 'Ej. 5', min: 1, max: 5 },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'ubicacion', label: 'Ubicación exacta en el mapa', type: 'map', required: false },
    ],
  },
  restaurantes: {
    titulo: 'Restaurantes',
    url: `${BASE}/restaurantes`,
    urlMios: `${BASE}/restaurantes/mios`,
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
      { name: 'imagen', label: 'Imagen', type: 'file', required: false, placeholder: 'Sube una foto desde tu dispositivo' },
      { name: 'horarioAbierto', label: 'Horario de apertura', type: 'time', required: false },
      { name: 'horarioCerrado', label: 'Horario de cierre', type: 'time', required: false },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'ubicacion', label: 'Ubicación exacta en el mapa', type: 'map', required: false },
    ],
  },
  tours: {
    titulo: 'Tours',
    url: `${BASE}/tours`,
    urlMios: `${BASE}/tours/mios`,
    icono: Compass,
    nombreKey: 'nombre',
    campos: [
      { name: 'nombre', label: 'Nombre del tour', type: 'text', required: true, placeholder: 'Ej. Tour al Volcán de Colima' },
      { name: 'tipoTour', label: 'Tipo de tour', type: 'text', required: false, placeholder: 'Ej. Aventura, Cultural...' },
      { name: 'tipoServicio', label: 'Tipo de servicio', type: 'text', required: false, placeholder: 'Ej. Guiado, Privado...' },
      { name: 'telefono', label: 'Teléfono de contacto', type: 'text', required: false, placeholder: 'Ej. 3121234567' },
      { name: 'imagen', label: 'Imagen', type: 'file', required: false, placeholder: 'Sube una foto desde tu dispositivo' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'ubicacion', label: 'Ubicación exacta en el mapa', type: 'map', required: false },
    ],
  },
  destinos: {
    titulo: 'Destinos',
    url: `${BASE}/destinos`,
    urlMios: `${BASE}/destinos/mios`,
    icono: MapIcon,
    nombreKey: 'nombre',
    campos: [
      { name: 'nombre', label: 'Nombre del destino', type: 'text', required: true, placeholder: 'Ej. Laguna La Maria' },
      { name: 'nombre_Calle', label: 'Calle o lugar', type: 'text', required: false, placeholder: 'Ej. Plaza Principal' },
      { name: 'numero_Calle', label: 'Número exterior', type: 'number', required: false, placeholder: 'Ej. 1' },
      { name: 'imagen', label: 'Imagen', type: 'file', required: false, placeholder: 'Sube una foto desde tu dispositivo' },
      { name: 'horarioAbierto', label: 'Hora de inicio', type: 'time', required: false },
      { name: 'horarioCerrado', label: 'Hora de fin', type: 'time', required: false },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'ubicacion', label: 'Ubicación exacta en el mapa', type: 'map', required: false },
    ],
  },
  eventos: {
    titulo: 'Eventos',
    url: `${BASE}/eventos`,
    urlMios: `${BASE}/eventos/mios`,
    icono: Calendar,
    nombreKey: 'nombre_Evento',
    campos: [
      { name: 'nombre_Evento', label: 'Nombre del evento', type: 'text', required: true, placeholder: 'Ej. Festival del Fuego 2026' },
      { name: 'tipoEvento', label: 'Tipo de evento', type: 'text', required: false, placeholder: 'Ej. Cultural, Gastronómico...' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text', required: true, placeholder: 'Ej. Av. Niños Héroes' },
      { name: 'numero_Calle', label: 'Número exterior', type: 'number', required: true, placeholder: 'Ej. 10' },
      { name: 'codigoPostal', label: 'Código postal', type: 'number', required: true, placeholder: 'Ej. 28000' },
      { name: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
      { name: 'fechaTermino', label: 'Fecha de término', type: 'date', required: true },
      { name: 'disponibilidad', label: 'Disponibilidad', type: 'text', required: false, placeholder: 'Ej. Lugares limitados, Entrada libre...' },
      { name: 'imagen', label: 'Imagen', type: 'file', required: false, placeholder: 'Sube una foto desde tu dispositivo' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre', required: true },
      { name: 'id_destino', label: 'Destino turístico', type: 'select', catalogo: 'destinos', valueKey: 'id_destino', labelKey: 'nombre', required: true },
      { name: 'ubicacion', label: 'Ubicación exacta en el mapa', type: 'map', required: false },
    ],
  },
};

const obtenerId = (item) =>
  item.id_hotel || item.id_restaurante || item.id_provedor || item.id_destino || item.id_evento || item.id;

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
  // ── 1. TODOS LOS ESTADOS PRIMERO ──
  const { usuario } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [catalogos, setCatalogos] = useState({ municipios: [], categorias: [], destinos: [] });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState(null);
  const [formData, setFormData] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(null);

  // ── 2. DERIVADOS ──
  const seccionesVisibles = usuario?.tipo_servicio
    ? Object.fromEntries(
        Object.entries(SECCIONES).filter(([key]) => key === usuario.tipo_servicio)
      )
    : SECCIONES;

  const seccionActual = seccionActiva ? SECCIONES[seccionActiva] : null;
  const iniciales = usuario?.primerNombre?.[0]?.toUpperCase() || 'P';
  const totalActivos = datos.filter(d => d.activo === true).length;
  const totalPendientes = datos.filter(d => !d.activo).length;

  // ── 3. TODOS LOS useEffect JUNTOS ──
  // Activa la sección según el tipo_servicio del proveedor
  useEffect(() => {
    if (usuario?.tipo_servicio && SECCIONES[usuario.tipo_servicio]) {
      setSeccionActiva(usuario.tipo_servicio);
    }
  }, [usuario]);

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const { data } = await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(data.csrfToken);
      } catch (e) { console.warn('CSRF no disponible', e); }
    };
    fetchCsrf();

    const cargarCatalogos = async () => {
      const [resMun, resCat, resDest] = await Promise.allSettled([
        axios.get(`${BASE}/municipios`),
        axios.get(`${BASE}/categorias`),
        axios.get(`${BASE}/destinos`),
      ]);
      setCatalogos({
        municipios: resMun.status === 'fulfilled' ? resMun.value.data : [],
        categorias: resCat.status === 'fulfilled' ? resCat.value.data : [],
        destinos: resDest.status === 'fulfilled' ? resDest.value.data : [],
      });
    };
    cargarCatalogos();
  }, []);

  useEffect(() => {
    if (seccionActual) cargarDatos();
  }, [seccionActiva]);

  // ── 4. FUNCIONES ──
  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(seccionActual.urlMios, { withCredentials: true });
      setDatos(res.data);
    } catch {
      setError('No se pudieron cargar los registros. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Convierte y comprime una imagen a base64 (máx. ~1280px de ancho, calidad 0.75)
  const handleImagenSeleccionada = (campoName, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      mostrarToast('El archivo debe ser una imagen.', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      mostrarToast('La imagen es demasiado pesada (máx. 8MB).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX_W = 1280;
        const escala = Math.min(1, MAX_W / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setFormData(prev => ({ ...prev, [campoName]: dataUrl }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const { data } = await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true });
      const token = data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
      const payload = { ...formData };

      // El campo "ubicacion" es solo un marcador visual del formulario;
      // los valores reales viajan en latitud/longitud, así que lo quitamos del payload.
      delete payload.ubicacion;

      Object.keys(payload).forEach(k => {
        if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
      });
      if (payload.numero_Calle) payload.numero_Calle = Number(payload.numero_Calle);
      if (payload.codigoPostal) payload.codigoPostal = Number(payload.codigoPostal);
      if (payload.id_municipio) payload.id_municipio = Number(payload.id_municipio);
      if (payload.id_destino) payload.id_destino = Number(payload.id_destino);
      if (payload.estrellas) payload.estrellas = Number(payload.estrellas);
      if (payload.telefono) payload.telefono = String(payload.telefono);
      if (payload.latitud !== undefined) payload.latitud = Number(payload.latitud);
      if (payload.longitud !== undefined) payload.longitud = Number(payload.longitud);

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

const eliminar = (item) => {
  const nombre = item[seccionActual.nombreKey] || 'este registro';
  setModalConfirm({
    mensaje: `¿Eliminar "${nombre}" de forma permanente? Esta acción no se puede deshacer y liberará el cupo para registrar un nuevo ${seccionActual.titulo.slice(0, -1).toLowerCase()}.`,
    item
  });
};

const confirmarEliminar = async () => {
  const item = modalConfirm.item;
  setModalConfirm(null);
  try {
    const { data } = await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true });
    const token = data.csrfToken;
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

  // ── 5. GUARD — va ANTES del return principal ──
  if (!seccionActual) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-slate-400 text-sm">Cargando...</div>
    </div>
  );

  // ── 6. RENDER ──
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
          {Object.entries(seccionesVisibles).map(([key, config]) => {
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
{datos.length === 0 && (
              <button
                onClick={abrirModalCrear}
                className="flex items-center gap-2 bg-[#00a8ff] hover:bg-[#0097e6] text-white px-5 py-2.5 rounded-full font-medium transition-all text-sm flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Agregar {seccionActual.titulo.slice(0, -1)}
              </button>
            )}
          </header>

          <div className="mb-6 flex items-start gap-3 bg-[#00a8ff]/5 border border-[#00a8ff]/20 rounded-xl p-4">
            <Clock className="w-4 h-4 text-[#00a8ff] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              Los registros nuevos aparecen como <span className="font-medium text-amber-600">Pendiente</span> hasta que el administrador los active. Una vez activos son visibles para los turistas.
              {datos.length > 0 && (
                <> Solo puedes tener <span className="font-medium">un {seccionActual.titulo.slice(0, -1).toLowerCase()}</span> por cuenta — si quieres registrar uno distinto, primero elimina el actual.</>
              )}
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
                          {item[seccionActual.nombreKey] || item.nombre || item.nombre_hotel || item.nombre_Evento}
                        </div>
                        {item.tipo && <div className="text-xs text-slate-400 mt-0.5">{item.tipo}</div>}
                        {item.tipoTour && <div className="text-xs text-slate-400 mt-0.5">{item.tipoTour}</div>}
                        {item.tipoEvento && <div className="text-xs text-slate-400 mt-0.5">{item.tipoEvento}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.municipio?.nombre || item.destino_turistico?.municipio?.nombre || '—'}
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
                if (campo.type === 'file') {
                  const valorActual = formData[campo.name];
                  return (
                    <div key={campo.name}>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {campo.label} {campo.required && <span className="text-red-400">*</span>}
                      </label>
                      {valorActual && (
                        <div className="mb-2 relative w-fit">
                          <img
                            src={valorActual}
                            alt="Vista previa"
                            className="h-28 w-auto rounded-lg border border-slate-200 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, [campo.name]: '' }))}
                            className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImagenSeleccionada(campo.name, e.target.files?.[0])}
                        className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00a8ff]/10 file:text-[#00a8ff] hover:file:bg-[#00a8ff]/20 transition-all"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">JPG, PNG o WEBP. Se comprime automáticamente.</p>
                    </div>
                  );
                }
                if (campo.type === 'map') {
                  return (
                    <div key={campo.name}>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {campo.label} {campo.required && <span className="text-red-400">*</span>}
                      </label>
                      <MiniMap
                        lat={formData.latitud != null && formData.latitud !== '' ? Number(formData.latitud) : null}
                        lng={formData.longitud != null && formData.longitud !== '' ? Number(formData.longitud) : null}
                        editable
                        onChange={(lat, lng) => setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }))}
                        height={220}
                      />
                      {formData.latitud != null && formData.latitud !== '' && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Pin actual: {Number(formData.latitud).toFixed(5)}, {Number(formData.longitud).toFixed(5)}
                        </p>
                      )}
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

 {modalConfirm && (
        <ModalConfirm
          mensaje={modalConfirm.mensaje}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setModalConfirm(null)}
        />
      )}

    </div>
  );
}