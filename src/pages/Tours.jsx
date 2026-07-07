import React, { useEffect, useState } from 'react';
import { Heart, MapPin, Briefcase, Phone } from 'lucide-react';
import axios from 'axios';
import './Tours.css';
import '../components/filtros-paginacion.css';
import { useAuth } from '../context/AuthContext';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import Paginacion from '../components/Paginacion';
import { Toast } from '../components/Toast';
import MiniMap from '../components/MiniMap';
import { useSearchParams } from 'react-router-dom';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const URL = "https://tulima-backend.vercel.app/tours";
const PAGE_SIZE = 9;

function Tours() {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  useBodyScrollLock(!!selectedTour);
  const { usuario } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const [favoritos, setFavoritos] = useState(new Set());
  const [toast, setToast] = useState(null);
 const [searchParams, setSearchParams] = useSearchParams();

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
const [filtroTipo, setFiltroTipo] = useState('');
  const [pagina, setPagina] = useState(1);
  const [todosMunicipios, setTodosMunicipios] = useState([]);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken)).catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/municipios')
      .then(({ data }) => setTodosMunicipios(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario) return;
    axios.get('https://tulima-backend.vercel.app/favoritos', { withCredentials: true })
      .then(res => setFavoritos(new Set(res.data.filter(f => f.id_provedor_tour != null).map(f => f.id_provedor_tour))))
      .catch(() => {});
  }, [usuario]);

useEffect(() => {
  const id = searchParams.get('id');
  if (id && tours.length > 0) {
    const encontrado = tours.find(t => t.id_provedor === Number(id));
    if (encontrado) {
      setSelectedTour(encontrado);
      setSearchParams({}, { replace: true });
    }
  }
}, [searchParams, tours, setSearchParams]);

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error('Error al cargar tours'); return r.json(); })
      .then(data => { setTours(data); setIsLoading(false); })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  const toggleFavorito = async (id, e) => {
    e.stopPropagation();
    if (!usuario) {
  setToast({ mensaje: 'Debes iniciar sesión para añadir a favoritos.', tipo: 'warning' });
  return;
}
    const esFavorito = favoritos.has(id);
    const nuevo = new Set(favoritos);
    esFavorito ? nuevo.delete(id) : nuevo.add(id);
    setFavoritos(nuevo);
    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
      const data = { tipo: 'tour', id };
      if (esFavorito) await axios.delete('https://tulima-backend.vercel.app/favoritos', { ...config, data });
      else await axios.post('https://tulima-backend.vercel.app/favoritos', data, config);
    } catch {
  setFavoritos(favoritos);
  setToast({ mensaje: 'No se pudo actualizar el favorito.', tipo: 'error' });
}
};

 const municipios = todosMunicipios.length
    ? todosMunicipios.map(m => m.nombre).sort((a, b) => a.localeCompare(b))
    : [...new Set(tours.map(t => t.municipio?.nombre).filter(Boolean))];
  const tipos = [...new Set(tours.map(t => t.tipoTour).filter(Boolean))];

  const filtrados = tours.filter(t =>
    (t.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroMunicipio || t.municipio?.nombre === filtroMunicipio) &&
    (!filtroTipo || t.tipoTour === filtroTipo)
  );

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const pagEnPantalla = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const limpiar = () => { setBusqueda(''); setFiltroMunicipio(''); setFiltroTipo(''); setPagina(1); };

  if (isLoading) return <div className="tours-seccion"><h2>Cargando tours...</h2></div>;
  if (error) return <div className="tours-seccion"><h2>Error: {error}</h2></div>;

  return (
    <div className="tours-seccion">
      <h2 className="tours-titulo">Tours y Experiencias</h2>

      <FiltrosBusqueda
        busqueda={busqueda}
        setBusqueda={v => { setBusqueda(v); setPagina(1); }}
        filtros={[
          { key: 'municipio', value: filtroMunicipio, setValue: v => { setFiltroMunicipio(v); setPagina(1); }, opciones: municipios.map(m => ({ value: m, label: m })), placeholder: 'Municipio' },
          { key: 'tipo', value: filtroTipo, setValue: v => { setFiltroTipo(v); setPagina(1); }, opciones: tipos.map(t => ({ value: t, label: t })), placeholder: 'Tipo de tour' },
        ]}
        total={filtrados.length}
        labelEntidad="tour"
        onLimpiar={limpiar}
      />

      <div className="tours-grid">
        {pagEnPantalla.map(tour => (
          <div key={tour.id_provedor} className="tour-card" onClick={() => setSelectedTour(tour)} style={{ cursor: 'pointer' }}>
            <div className="tour-imagen-container">
              <span className="tour-etiqueta">{tour.tipoTour}</span>
              <img src={tour.imagen} alt={tour.nombre} className="tour-imagen"
                onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            </div>
            <div className="tour-info">
              <div className="tour-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {tour.municipio?.nombre}
              </div>
              <h3 className="tour-titulo">{tour.nombre}</h3>
              <div className="tour-footer">
                <span className="tour-servicio">{tour.tipoServicio}</span>
                <button className={`favorito-btn ${favoritos.has(tour.id_provedor) ? 'activo' : ''}`}
                  onClick={e => toggleFavorito(tour.id_provedor, e)} aria-label="Favorito">
                  <Heart className="favorito-icono" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagEnPantalla.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hay tours con esos filtros.</p>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />

      {selectedTour && (
        <div className="modal-overlay" onClick={() => setSelectedTour(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTour(null)}>✕</button>
            <img src={selectedTour.imagen} alt={selectedTour.nombre} className="modal-image"
              onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            <div className="modal-body">
              <span className="tour-etiqueta">{selectedTour.tipoTour}</span>
              <h2 className="modal-title">{selectedTour.nombre}</h2>
              <div className="modal-details">
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Municipio:</strong> {selectedTour.municipio?.nombre ?? 'N/A'}</span></div>

                <div className="modal-detail-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <MapPin size={16} />
                    <strong>Ubicación:</strong>
                  </span>
                  {selectedTour.latitud != null && selectedTour.longitud != null ? (
                    <MiniMap lat={selectedTour.latitud} lng={selectedTour.longitud} height={180} />
                  ) : (
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Este tour aún no tiene ubicación exacta registrada en el mapa.
                    </p>
                  )}
                </div>

                <div className="modal-detail-row"><Briefcase size={16} /><span><strong>Tipo de servicio:</strong> {selectedTour.tipoServicio ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><Phone size={16} /><span><strong>Teléfono:</strong> {selectedTour.telefono?.toString() ?? 'N/A'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Tours;