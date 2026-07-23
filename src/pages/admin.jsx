import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, LayoutDashboard, Map, Settings, Utensils, Building2, Map as MapIcon, Compass, X, LogOut, Home , Menu} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toast } from '../components/Toast';
import Paginacion from '../components/Paginacion';

const SECCIONES = {
  destinos: {
    titulo: 'Destinos',
    url: 'https://api.tulima.site/destinos',
    icono: Map,
    campos: [
      { name: 'nombre', label: 'Nombre del Destino', type: 'text' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text' },
      { name: 'numero_Calle', label: 'Número Exterior', type: 'number' },
      { name: 'codigoPostal', label: 'Código Postal', type: 'number' },
      { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
      { name: 'horarioAbierto', label: 'Horario de Apertura', type: 'time' },
      { name: 'horarioCerrado', label: 'Horario de Cierre', type: 'time' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
    ],
    columnas: {
      col2: { label: 'Categoría', valor: (item) => item.tipo || 'N/A' },
      col3: { label: 'Ubicación', valor: (item) => item.municipio?.nombre || 'N/A' },
    },
  },
  hoteles: {
    titulo: 'Hoteles',
    url: 'https://api.tulima.site/hoteles',
    icono: Building2,
    campos: [
      { name: 'nombre_hotel', label: 'Nombre del Hotel', type: 'text' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text' },
      { name: 'numero_Calle', label: 'Número Exterior', type: 'number' },
      { name: 'codigoPostal', label: 'Código Postal', type: 'number' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'email', label: 'Correo Electrónico', type: 'email' },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
      { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
    ],
    columnas: {
      col2: { label: 'Categoría', valor: (item) => item.tipo || 'N/A' },
      col3: { label: 'Ubicación', valor: (item) => item.municipio?.nombre || 'N/A' },
    },
  },
  restaurantes: {
    titulo: 'Restaurantes',
    url: 'https://api.tulima.site/restaurantes',
    icono: Utensils,
    campos: [
      { name: 'nombre', label: 'Nombre del Restaurante', type: 'text' },
      { name: 'tipo', label: 'Tipo de Restaurante', type: 'text' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text' },
      { name: 'numero_Calle', label: 'Número Exterior', type: 'number' },
      { name: 'codigoPostal', label: 'Código Postal', type: 'number' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'email', label: 'Correo Electrónico', type: 'email' },
      { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
      { name: 'horarioAbierto', label: 'Horario de Apertura', type: 'time' },
      { name: 'horarioCerrado', label: 'Horario de Cierre', type: 'time' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
    ],
    columnas: {
      col2: { label: 'Categoría', valor: (item) => item.tipo || 'N/A' },
      col3: { label: 'Ubicación', valor: (item) => item.municipio?.nombre || 'N/A' },
    },
  },
  // municipios: {
  //   titulo: 'Municipios',
  //   url: 'https://tulima-backend.vercel.app/municipios',
  //   icono: MapIcon,
  //   campos: [
  //     { name: 'nombre', label: 'Nombre del Municipio', type: 'text' },
  //     { name: 'descripcion', label: 'Descripción', type: 'textarea' },
  //     { name: 'url_imagen', label: 'URL de la Imagen', type: 'text' },
  //   ],
  //   columnas: {
  //     col2: { label: 'Categoría', valor: () => 'Municipio' },
  //     col3: { label: 'Ubicación', valor: (item) => item.nombre || 'N/A' },
  //   },
  // },
  tours: {
    titulo: 'Tours',
    url: 'https://api.tulima.site/tours',
    icono: Compass,
    campos: [
      { name: 'nombre', label: 'Nombre del Tour', type: 'text' },
      { name: 'tipoTour', label: 'Tipo de Tour', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'tipoServicio', label: 'Tipo de Servicio', type: 'text' },
      { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
    ],
    columnas: {
      col2: { label: 'Categoría', valor: (item) => item.tipoTour || 'N/A' },
      col3: { label: 'Ubicación', valor: (item) => item.municipio?.nombre || 'N/A' },
    },
  },
  proveedores: {
    titulo: 'Proveedores',
    url: 'https://api.tulima.site/usuarios',
    icono: Settings,
    campos: [],
    columnas: {
      col2: { label: 'Correo', valor: (item) => item.correo || 'N/A' },
      col3: { label: 'RFC', valor: (item) => item.rfc || 'N/A' },
    },
  },
};

const obtenerId = (item) =>
  item.id_destino || item.id_hotel || item.id_restaurante || item.id_municipio || item.id_tour || item.id_usuario || item.id;

const obtenerNombre = (item) =>
  item.nombre_hotel ||
  item.nombre ||
  (item.primerNombre ? `${item.primerNombre} ${item.apellidoPaterno || ''}`.trim() : null) ||
  '—';

  function DashboardResumen({ stats }) {
    const categorias = [
      { key: 'hoteles', label: 'Hoteles', icono: Building2 },
      { key: 'restaurantes', label: 'Restaurantes', icono: Utensils },
      { key: 'tours', label: 'Tours', icono: Compass },
      { key: 'destinos', label: 'Destinos', icono: Map },
      { key: 'proveedores', label: 'Proveedores', icono: Settings },
    ];
  
    const totales = categorias.reduce(
      (acc, c) => {
        const s = stats[c.key] || { total: 0, activos: 0, inactivos: 0 };
        acc.total += s.total;
        acc.activos += s.activos;
        acc.inactivos += s.inactivos;
        return acc;
      },
      { total: 0, activos: 0, inactivos: 0 }
    );
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Registros totales</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totales.total}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Activos</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{totales.activos}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Inactivos / pendientes</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{totales.inactivos}</p>
          </div>
        </div>
  
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Por categoría</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {categorias.map(c => {
              const s = stats[c.key] || { total: 0, activos: 0, inactivos: 0 };
              const Icono = c.icono;
              const pct = s.total > 0 ? Math.round((s.activos / s.total) * 100) : 0;
              return (
                <div key={c.key} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#00a8ff]/10 flex items-center justify-center flex-shrink-0">
                    <Icono className="w-4 h-4 text-[#00a8ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 text-sm">{c.label}</span>
                      <span className="text-sm text-slate-500">
                        {s.activos} activos · {s.inactivos} inactivos · {s.total} total
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00a8ff] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

export default function TulimaAdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState('hoteles');
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [toast, setToast] = useState(null);
  const [catalogos, setCatalogos] = useState({ municipios: [], categorias: [] });
  const [pagina, setPagina] = useState(1);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const { data } = await axios.get('https://api.tulima.site/api/csrf-token', { withCredentials: true });
        setCsrfToken(data.csrfToken);
      } catch (e) {
        console.warn('No se pudo obtener CSRF token', e);
      }
    };
    fetchCsrf();
  }, []);

  useEffect(() => {
    const cargarCatalogos = async () => {
      const [resMun] = await Promise.allSettled([
        axios.get('https://api.tulima.site/municipios'),
      ]);
      setCatalogos({
        municipios: resMun.status === 'fulfilled' ? resMun.value.data : [],
        categorias: [],
      });
    };
    cargarCatalogos();
  }, []);

  const esDashboard = seccionActiva === 'dashboard';
  const seccionActual = esDashboard ? null : SECCIONES[seccionActiva];

  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const urlAdmin = seccionActual?.url + '/admin/todos';
      const respuesta = await axios.get(urlAdmin, { withCredentials: true });
      setDatos(respuesta.data);
    } catch (err) {
      console.error(`Error al cargar ${seccionActiva}:`, err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (esDashboard) return;
    setPagina(1);
    cargarDatos();
  }, [seccionActiva]);

  const toggleActivo = async (item) => {
    const id = obtenerId(item);
    const nuevoEstado = !item.activo;

    // Actualiza la UI al instante (optimistic update)
    setDatos(prev => prev.map(d =>
      obtenerId(d) === id ? { ...d, activo: nuevoEstado } : d
    ));

    try {
      const token = csrfToken ?? (await axios.get(
        'https://api.tulima.site/api/csrf-token',
        { withCredentials: true }
      )).data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };

      if (!nuevoEstado) {
        // DESACTIVAR — usa DELETE (ya implementado en el backend)
        await axios.delete(`${seccionActual?.url}/${id}`, config);
      } else {
        // ACTIVAR — usa PUT con solo activo: true
        await axios.put(`${seccionActual?.url}/${id}`, { activo: true }, config);
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      // Revierte el cambio visual si falla
      setDatos(prev => prev.map(d =>
        obtenerId(d) === id ? { ...d, activo: !nuevoEstado } : d
      ));
      setToast({ mensaje: 'No se pudo cambiar el estado. Intenta de nuevo.', tipo: 'error' });
    }
  };

  useEffect(() => {
    if (!esDashboard) return;
  
    const cargarResumen = async () => {
      setIsLoadingDashboard(true);
      setDashboardStats(null);
      try {
        const claves = Object.keys(SECCIONES);
        const resultados = await Promise.allSettled(
          claves.map(key => axios.get(`${SECCIONES[key].url}/admin/todos`, { withCredentials: true }))
        );
    
        const stats = {};
        claves.forEach((key, i) => {
          const r = resultados[i];
          const lista = Array.isArray(r.value?.data) ? r.value.data : [];
          stats[key] = {
            total: lista.length,
            activos: lista.filter(d => d.activo === true).length,
            inactivos: lista.filter(d => d.activo !== true).length,
          };
        });
    
        setDashboardStats(stats);
      } catch (err) {
        console.error('Error al cargar resumen:', err);
        setDashboardStats({});
      } finally {
        setIsLoadingDashboard(false);
      }
    };
  
    cargarResumen();
  }, [seccionActiva]);

  const datosOrdenados = [...datos].sort((a, b) => obtenerId(b) - obtenerId(a));
  const totalPaginas = Math.ceil(datosOrdenados.length / PAGE_SIZE);
  const datosPagina = datosOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

 return (
    <>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}

      <div className="flex h-screen bg-slate-50 font-sans fixed inset-0">

            {sidebarAbierto && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarAbierto(false)}
          />
        )}

        {/* BARRA LATERAL */}
        <aside className={`
            fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-slate-200 flex flex-col
            transition-transform duration-300
            ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:z-10
          `}>
            <button
              className="lg:hidden absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarAbierto(false)}
            >
              <X className="w-5 h-5" />
            </button>
          <div className="p-6 flex items-center gap-2">
            <MapPin className="text-[#00a8ff] w-8 h-8" />
            <span className="text-2xl font-bold text-slate-800">Tulima</span>
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-md ml-2">Admin</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4 text-slate-600">
          <button
            onClick={() => { setSeccionActiva('dashboard'); setSidebarAbierto(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              esDashboard
                ? 'bg-[#00a8ff]/10 text-[#00a8ff]'
                : 'hover:bg-slate-50 hover:text-[#00a8ff] text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

            {Object.entries(SECCIONES).map(([key, config]) => {
              const Icono = config.icono;
              const activo = seccionActiva === key;
              return (
                <button
                  key={key}
                  onClick={() => setSeccionActiva(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activo
                      ? 'bg-[#00a8ff]/10 text-[#00a8ff]'
                      : 'hover:bg-slate-50 hover:text-[#00a8ff] text-slate-600'
                  }`}
                >
                  <Icono className="w-5 h-5" />
                  <span>{config.titulo}</span>
                </button>
              );
            })}
          </nav>
       <div className="p-4 border-t border-slate-100">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Salir al sitio principal
            </Link>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 overflow-y-auto relative">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-10">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <MapPin className="text-[#00a8ff] w-5 h-5" />
          <span className="font-bold text-slate-800">Tulima</span>
          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-md font-medium">Admin</span>
        </div>
         <div className="p-4 lg:p-8 max-w-6xl mx-auto">

            <header className="flex justify-between items-center mb-8">
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00a8ff] transition-colors mb-2"
                >
                  <Home className="w-4 h-4" />
                  Volver al inicio
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">
                  {esDashboard ? 'Dashboard' : seccionActual?.titulo}
                </h1>
                <p className="text-slate-500 mt-1">
                  {esDashboard
                    ? 'Resumen general del estado de la plataforma.'
                    : `Activa o desactiva ${seccionActual?.titulo?.toLowerCase()} en la plataforma.`}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2.5 rounded-full text-sm">
                <Settings className="w-4 h-4" />
                Modo moderación
              </div>
            </header>
            {esDashboard ? (
                isLoadingDashboard || (esDashboard && !dashboardStats) ? (
                  <div className="flex justify-center items-center py-20 text-slate-500">
                    Cargando resumen...
                  </div>
                ) : dashboardStats && Object.keys(dashboardStats).length === 0 ? (
                  <div className="flex justify-center items-center py-20 text-red-400">
                    No se pudo cargar el resumen. Verifica tu sesión e intenta de nuevo.
                  </div>
                ) : (
                  <DashboardResumen stats={dashboardStats} />
                              
                ) 
               ) : !seccionActual ? null : isLoading ? (
              <div className="flex justify-center items-center py-20 text-slate-500">
                Cargando {seccionActual?.titulo?.toLowerCase()}...
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                {error}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="lg:hidden divide-y divide-slate-100">
                  {datosPagina.map((item) => {
                    const id = obtenerId(item);
                    return (
                      <div key={id} className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">
                            {obtenerNombre(item)}
                          </p>
                          {item.nombreUsuario && (
                            <p className="text-xs text-slate-400">@{item.nombreUsuario}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {seccionActual?.columnas.col2.valor(item)}
                            </span>
                            <span className="text-xs text-slate-500">
                              {seccionActual?.columnas.col3.valor(item)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {item.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          <button
                            onClick={() => toggleActivo(item)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.activo ? 'bg-[#00a8ff]' : 'bg-slate-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              item.activo ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <table className="hidden lg:table w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
        <th className="px-6 py-4 font-medium">Nombre</th>
        <th className="px-6 py-4 font-medium">{seccionActual?.columnas.col2.label}</th>
        <th className="px-6 py-4 font-medium">{seccionActual?.columnas.col3.label}</th>
        <th className="px-6 py-4 font-medium text-right">Estado</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {datosPagina.map((item) => {
        const id = obtenerId(item);
        return (
          <tr key={id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-800">{obtenerNombre(item)}</div>
              {item.nombreUsuario && (
                <div className="text-xs text-slate-400 mt-0.5">@{item.nombreUsuario}</div>
              )}
            </td>
            <td className="px-6 py-4">
              <span className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                {seccionActual?.columnas.col2.valor(item)}
              </span>
            </td>
            <td className="px-6 py-4 text-slate-600">
              {seccionActual?.columnas.col3.valor(item)}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  item.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {item.activo ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={() => toggleActivo(item)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    item.activo ? 'bg-[#00a8ff]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    item.activo ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>

  {datosPagina.length === 0 && (
    <div className="text-center py-10 text-slate-500">
      No hay registros disponibles.
    </div>
  )}
  {datosPagina.length > 0 && (
    <div className="p-4 flex justify-center border-t border-slate-100">
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />
      </div>
                )}
              </div> 
            )}          
          </div>        
        </main>

      </div> 
    </>
  );
}