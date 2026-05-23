import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, LayoutDashboard, Map, Settings, Plus, Edit2, Trash2, MessageSquare, Utensils, Building2, Map as MapIcon, Compass, X } from 'lucide-react';

const SECCIONES = {
  destinos: { titulo: 'Destinos', url: 'http://localhost:8000/destinos', icono: Map, btn: 'Nuevo Destino' },
  hoteles: { 
    titulo: 'Hoteles', 
    url: 'http://localhost:8000/hoteles', 
    icono: Building2, 
    btn: 'Nuevo Hotel',
  
  campos:[
    {name:'nombre_hotel', label: 'Nombre del Hotel', type: 'text'},
    { name: 'nombre_Calle', label: 'Calle', type: 'text' },
    { name: 'numero_Calle', label: 'Número Exterior', type: 'number' },
    { name: 'codigoPostal', label: 'Código Postal', type: 'number' },
    { name: 'telefono', label: 'Teléfono', type: 'number' },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    {name: 'imagen', label: 'URL de la Imagen', type: 'text'},
    {name: 'calificacion', label: 'Calificación', type: 'text'},

      { 
        name: 'id_municipio', 
        label: 'Municipio', 
        type: 'select', 
        catalogo: 'municipios', // Dónde buscará la lista
        valueKey: 'id_municipio', // Lo que se guarda en la BD
        labelKey: 'nombre' // Lo que lee el usuario (ej. "Comala", "Manzanillo")
      },
      { 
        name: 'id_categoria', 
        label: 'Categoría', 
        type: 'select', 
        catalogo: 'categorias', 
        valueKey: 'id_categoria', 
        labelKey: 'nombre' 
      },
  ]},
  restaurantes: { titulo: 'Restaurantes', url: 'http://localhost:8000/restaurantes', icono: Utensils, btn: 'Nuevo Restaurante' },
  municipios: { titulo: 'Municipios', url: 'http://localhost:8000/municipios', icono: MapIcon, btn: 'Nuevo Municipio' },
  tours: { titulo: 'Tours', url: 'http://localhost:8000/tours', icono: Compass, btn: 'Nuevo Tour' },
};


// Función auxiliar para extraer el ID dinámicamente sin importar la tabla
const obtenerId = (item) => item.id_destino || item.id_hotel || item.id_restaurante || item.id_municipio || item.id_tour || item.id;

export default function TulimaAdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState('hoteles');
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    calificacion: '',
    // Nota: Agrega aquí otros campos que necesites (ej. descripcion, id_municipio, etc.)
  });

  const seccionActual = SECCIONES[seccionActiva];

  const [catalogos, setCatalogos] = useState({
    municipios: [],
    categorias: []
  });

  useEffect(() => {
    const cargarCatalogos = async () => {
      const [resMun, resCat] = await Promise.allSettled([
        axios.get('http://localhost:8000/municipios'),
        axios.get('http://localhost:8000/categorias') 
      ]);
      
      setCatalogos({
        municipios: resMun.status === 'fulfilled' ? resMun.value.data : [],
        categorias: resCat.status === 'fulfilled' ? resCat.value.data : []
      });

      if (resCat.status === 'rejected') {
        console.warn("Aviso: El catálogo de categorías no cargó (probablemente falta el endpoint).");
      }
    };
    
    cargarCatalogos();
  }, []);


  // Función para cargar los datos de la tabla
  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
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

  // Manejo del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdActual(null);
    const estadoInicial = {};
    seccionActual.campos.forEach(campo => {
      estadoInicial[campo.name] = campo.type === 'checkbox' ? false : '';
    });

    setFormData({estadoInicial});
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setModoEdicion(true);
    setIdActual(obtenerId(item));
    setFormData({
      nombre: item.nombre || '',
      calificacion: item.calificacion || '',
      imagen: item.imagen || '',
    });
    setModalAbierto(true);
  };

  const guardarRegistro = async (e) => {
    e.preventDefault();
    try {
      // Ajustamos el payload asegurando los tipos de datos correctos
      const payload = {
        ...formData,
        calificacion: formData.calificacion ? parseFloat(formData.calificacion) : null
      };

      if (modoEdicion) {
        // Petición PUT para modificar
        await axios.put(`${seccionActual.url}/${idActual}`, payload, { withCredentials: true });
      } else {
        // Petición POST para crear
        await axios.post(seccionActual.url, payload, { withCredentials: true });
      }
      
      setModalAbierto(false);
      cargarDatos(); // Recargamos la tabla para ver los cambios
    } catch (err) {
      console.error("Error al guardar:", err);
      alert(err.response?.data?.error || "Ocurrió un error al guardar el registro.");
    }
  };

  const eliminarRegistro = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;
    
    try {
      await axios.delete(`${seccionActual.url}/${id}`, { withCredentials: true });
      cargarDatos();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el registro.");
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
              <p className="text-slate-500 mt-1">Gestiona la información de {seccionActual.titulo.toLowerCase()} en la plataforma.</p>
            </div>
            
            {/* 🟢 BOTÓN NUEVO CONECTADO */}
            <button 
              onClick={abrirModalCrear}
              className="flex items-center gap-2 bg-[#00a8ff] hover:bg-[#0097e6] text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm shadow-[#00a8ff]/30"
            >
              <Plus className="w-5 h-5" />
              {seccionActual.btn}
            </button>
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
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {datos.map((item) => {
                    const id = obtenerId(item);
                    return (
                      <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{item.nombre || item.nombre_hotel}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                            {item.categoria?.nombre || 'N/A'}
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
                          <div className="flex justify-end gap-2">
                            {/* 🟢 BOTÓN EDITAR CONECTADO */}
                            <button 
                              onClick={() => abrirModalEditar(item)}
                              className="p-2 text-slate-400 hover:text-[#00a8ff] hover:bg-[#00a8ff]/10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {/* 🟢 BOTÓN ELIMINAR CONECTADO */}
                            <button 
                              onClick={() => eliminarRegistro(id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* 🟢 MODAL FLOTANTE (Formulario) */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800">
                {modoEdicion ? 'Modificar' : 'Crear'} {seccionActual.titulo.slice(0, -1)}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarRegistro} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
  
            {seccionActual.campos.map((campo) => {
              
              if (campo.type === 'checkbox') {
                return (
                  <div key={campo.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={campo.name}
                      id={campo.name}
                      checked={formData[campo.name] || false}
                      onChange={(e) => setFormData({ ...formData, [campo.name]: e.target.checked })}
                      className="w-4 h-4 text-[#00a8ff] rounded border-slate-300 focus:ring-[#00a8ff]"
                    />
                    <label htmlFor={campo.name} className="text-sm font-medium text-slate-700">
                      {campo.label}
                    </label>
                  </div>
                );
              }

              if (campo.type === 'textarea') {
                return (
                  <div key={campo.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{campo.label}</label>
                    <textarea
                      name={campo.name}
                      value={formData[campo.name] || ''}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50 focus:border-[#00a8ff] transition-all"
                    />
                  </div>
                );
              }
              if (campo.type === 'select') {
                // Extraemos la lista correspondiente del estado global de catálogos
                const opciones = catalogos[campo.catalogo] || []; 
                
                return (
                  <div key={campo.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{campo.label}</label>
                    <select
                      name={campo.name}
                      value={formData[campo.name] || ''}
                      // Prisma necesita que las llaves foráneas sean Enteros, por eso usamos parseInt
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [campo.name]: e.target.value ? parseInt(e.target.value) : '' 
                      })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50 focus:border-[#00a8ff] bg-white transition-all"
                      required
                    >
                      <option value="">Selecciona una opción...</option>
                      {opciones.map((opcion) => (
                        <option key={opcion[campo.valueKey]} value={opcion[campo.valueKey]}>
                          {opcion[campo.labelKey]}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={campo.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{campo.label}</label>
                  <input
                    type={campo.type}
                    name={campo.name}
                    value={formData[campo.name] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50 focus:border-[#00a8ff] transition-all"
                  />
                </div>
              );
            })}

            <div className="pt-4 flex gap-3 justify-end sticky bottom-0 bg-white border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00a8ff] hover:bg-[#0097e6] text-white font-medium rounded-xl transition-all shadow-sm shadow-[#00a8ff]/30"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear'}
              </button>
            </div>
          </form>
            
          </div>
        </div>
      )}

    </div>
  );
}