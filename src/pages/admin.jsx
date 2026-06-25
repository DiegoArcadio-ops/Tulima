import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, LayoutDashboard, Map, Settings, Utensils, Building2, Map as MapIcon, Compass, X } from 'lucide-react';

const SECCIONES = {
  destinos: {
    titulo: 'Destinos',
    url: 'https://tulima-backend.vercel.app/destinos',
    icono: Map,
    campos: [
      { name: 'nombre', label: 'Nombre del Destino', type: 'text' },
      { name: 'nombre_Calle', label: 'Calle', type: 'text' },
      { name: 'numero_Calle', label: 'Número Exterior', type: 'number' },
      { name: 'codifoPostal', label: 'Código Postal', type: 'number' },
      { name: 'calificacion', label: 'Calificación', type: 'text' },
      { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
      { name: 'horarioAbierto', label: 'Horario de Apertura', type: 'time' },
      { name: 'horarioCerrado', label: 'Horario de Cierre', type: 'time' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
      { name: 'id_categoria', label: 'Categoría', type: 'select', catalogo: 'categorias', valueKey: 'id_categoria', labelKey: 'nombre' },
    ],
  },
  hoteles: {
    titulo: 'Hoteles',
    url: 'https://tulima-backend.vercel.app/hoteles',
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
      { name: 'calificacion', label: 'Calificación', type: 'text' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
      { name: 'id_categoria', label: 'Categoría', type: 'select', catalogo: 'categorias', valueKey: 'id_categoria', labelKey: 'nombre' },
    ],
  },
  restaurantes: {
    titulo: 'Restaurantes',
    url: 'https://tulima-backend.vercel.app/restaurantes',
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
      { name: 'calificacion', label: 'Calificación', type: 'text' },
      { name: 'horarioAbierto', label: 'Horario de Apertura', type: 'time' },
      { name: 'horarioCerrado', label: 'Horario de Cierre', type: 'time' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
      { name: 'id_categoria', label: 'Categoría', type: 'select', catalogo: 'categorias', valueKey: 'id_categoria', labelKey: 'nombre' },
    ],
  },
  municipios: {
    titulo: 'Municipios',
    url: 'https://tulima-backend.vercel.app/municipios',
    icono: MapIcon,
    campos: [
      { name: 'nombre', label: 'Nombre del Municipio', type: 'text' },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
      { name: 'url_imagen', label: 'URL de la Imagen', type: 'text' },
    ],
  },
  tours: {
    titulo: 'Tours',
    url: 'https://tulima-backend.vercel.app/tours',
    icono: Compass,
    campos: [
      { name: 'nombre', label: 'Nombre del Tour', type: 'text' },
      { name: 'tipoTour', label: 'Tipo de Tour', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'tipoServicio', label: 'Tipo de Servicio', type: 'text' },
      { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
      { name: 'calificacion', label: 'Calificación', type: 'text' },
      { name: 'id_municipio', label: 'Municipio', type: 'select', catalogo: 'municipios', valueKey: 'id_municipio', labelKey: 'nombre' },
    ],
  },
};

const obtenerId = (item) =>
  item.id_destino || item.id_hotel || item.id_restaurante || item.id_municipio || item.id_tour || item.id;

export default function TulimaAdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState('hoteles');
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [catalogos, setCatalogos] = useState({ municipios: [], categorias: [] });

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

  useEffect(() => {
    const cargarCatalogos = async () => {
      const [resMun, resCat] = await Promise.allSettled([
        axios.get('https://tulima-backend.vercel.app/municipios'),
        axios.get('https://tulima-backend.vercel.app/categorias'),
      ]);
      setCatalogos({
        municipios: resMun.status === 'fulfilled' ? resMun.value.data : [],
        categorias: resCat.status === 'fulfilled' ? resCat.value.data : [],
      });
    };
    cargarCatalogos();
  }, []);

  const seccionActual = SECCIONES[seccionActiva];

  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const urlAdmin = seccionActual.url + '/admin/todos';
      const respuesta = await axios.get(seccionActual.url, { withCredentials: true });
      setDatos(respuesta.data);
    } catch (err) {
      console.error(`Error al cargar ${seccionActiva}:`, err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
        'https://tulima-backend.vercel.app/api/csrf-token',
        { withCredentials: true }
      )).data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };

      if (!nuevoEstado) {
        // DESACTIVAR — usa DELETE (ya implementado en el backend)
        await axios.delete(`${seccionActual.url}/${id}`, config);
      } else {
        // ACTIVAR — usa PUT con solo activo: true
        await axios.put(`${seccionActual.url}/${id}`, { activo: true }, config);
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      // Revierte el cambio visual si falla
      setDatos(prev => prev.map(d =>
        obtenerId(d) === id ? { ...d, activo: !nuevoEstado } : d
      ));
      alert('No se pudo cambiar el estado. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">

      {/* BARRA LATERAL */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="p-6 flex items-center gap-2">
          <MapPin className="text-[#00a8ff] w-8 h-8" />
          <span className="text-2xl font-bold text-slate-800">Tulima</span>
          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-md ml-2">Admin</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 text-slate-600">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 hover:text-[#00a8ff] transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>

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
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8 max-w-6xl mx-auto">

          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{seccionActual.titulo}</h1>
              <p className="text-slate-500 mt-1">
                Activa o desactiva {seccionActual.titulo.toLowerCase()} en la plataforma.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2.5 rounded-full text-sm">
              <Settings className="w-4 h-4" />
              Modo moderación
            </div>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-slate-500">
              Cargando {seccionActual.titulo.toLowerCase()}...
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
              {error}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Categoría</th>
                    <th className="px-6 py-4 font-medium">Ubicación</th>
                    <th className="px-6 py-4 font-medium">Calificación</th>
                    <th className="px-6 py-4 font-medium text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {datos.map((item) => {
                    const id = obtenerId(item);
                    return (
                      <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {item.nombre || item.nombre_hotel}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                            {item.categoria?.nombre || item.tipo || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {item.municipio?.nombre || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-700 font-medium">
                            <span className="text-yellow-400">★</span> {item.calificacion || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-3">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                              item.activo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {item.activo ? 'Activo' : 'Inactivo'}
                            </span>
                            <button
                              onClick={() => toggleActivo(item)}
                              title={item.activo ? 'Desactivar' : 'Activar'}
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
              {datos.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  No hay registros disponibles.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}