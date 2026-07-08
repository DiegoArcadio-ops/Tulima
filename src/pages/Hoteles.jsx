import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Phone, Mail, FileText, Star } from 'lucide-react';
import axios from 'axios';
import './Hoteles.css';
import '../components/filtros-paginacion.css';
import { useAuth } from '../context/AuthContext';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import Paginacion from '../components/Paginacion';
import { Toast } from '../components/Toast';
import MiniMap from '../components/MiniMap';
import { useSearchParams } from 'react-router-dom';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const URL = "https://tulima-backend.vercel.app/hoteles";
const PAGE_SIZE = 9;

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  useBodyScrollLock(!!selectedHotel);
  const { usuario } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const [favoritos, setFavoritos] = useState(new Set());
  const [toast, setToast] = useState(null);
const [searchParams, setSearchParams] = useSearchParams();

  // Filtros
const [busqueda, setBusqueda] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [pagina, setPagina] = useState(1);
  const [todosMunicipios, setTodosMunicipios] = useState([]);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/municipios')
      .then(({ data }) => setTodosMunicipios(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario) return;
    axios.get('https://tulima-backend.vercel.app/favoritos', { withCredentials: true })
      .then(res => setFavoritos(new Set(res.data.filter(f => f.id_hotel != null).map(f => f.id_hotel))))
      .catch(() => {});
  }, [usuario]);

useEffect(() => {
  const id = searchParams.get('id');
  if (id && hoteles.length > 0) {
    const encontrado = hoteles.find(h => h.id_hotel === Number(id));
    if (encontrado) {
      setSelectedHotel(encontrado);
      setSearchParams({}, { replace: true });
    }
  }
}, [searchParams, hoteles, setSearchParams]);

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error('Error al cargar hoteles'); return r.json(); })
      .then(data => { setHoteles(data); setIsLoading(false); })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  const toggleFavorito = async (hotelId, e) => {
  e.stopPropagation();
  if (!usuario) {
    setToast({ mensaje: 'Debes iniciar sesión para añadir a favoritos.', tipo: 'warning' });
    return;
  }
  const esFavorito = favoritos.has(hotelId);
  const nuevosFavoritos = new Set(favoritos);
  esFavorito ? nuevosFavoritos.delete(hotelId) : nuevosFavoritos.add(hotelId);
  setFavoritos(nuevosFavoritos);
  try {
    const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;
    const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
    const data = { tipo: 'hotel', id: hotelId };
    if (esFavorito) await axios.delete('https://tulima-backend.vercel.app/favoritos', { ...config, data });
    else await axios.post('https://tulima-backend.vercel.app/favoritos', data, config);
  } catch {
    setFavoritos(favoritos);
    setToast({ mensaje: 'No se pudo actualizar el favorito.', tipo: 'error' });
  }
};

 const municipios = todosMunicipios.length
    ? todosMunicipios.map(m => m.nombre).sort((a, b) => a.localeCompare(b))
    : [...new Set(hoteles.map(h => h.municipio?.nombre).filter(Boolean))];

  const hotelesFiltrados = hoteles.filter(h => {
    const nombre = (h.nombre_hotel || '').toLowerCase();
    return (
      nombre.includes(busqueda.toLowerCase()) &&
      (!filtroMunicipio || h.municipio?.nombre === filtroMunicipio)
    );
  });

  const totalPaginas = Math.ceil(hotelesFiltrados.length / PAGE_SIZE);
  const hotelesPagina = hotelesFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const limpiar = () => { setBusqueda(''); setFiltroMunicipio(''); setPagina(1); };

  if (isLoading) return <div className="hoteles-mensaje">Cargando hoteles...</div>;
  if (error) return <div className="hoteles-mensaje">Error: {error}</div>;

  return (
    <div className="hoteles-seccion">
      <h2 className="hoteles-titulo">Hoteles y Alojamientos</h2>

      <FiltrosBusqueda
        busqueda={busqueda}
        setBusqueda={v => { setBusqueda(v); setPagina(1); }}
        filtros={[
          { key: 'municipio', value: filtroMunicipio, setValue: v => { setFiltroMunicipio(v); setPagina(1); }, opciones: municipios.map(m => ({ value: m, label: m })), placeholder: 'Municipio' },
        ]}
        total={hotelesFiltrados.length}
        labelEntidad="hotel"
        onLimpiar={limpiar}
      />

      <div className="hoteles-grid">
        {hotelesPagina.map(hotel => (
          <div key={hotel.id_hotel} className="hotel-card" onClick={() => setSelectedHotel(hotel)} style={{ cursor: 'pointer' }}>
            <div className="card-imagen-container">
              <span className="card-etiqueta">{hotel.tipo}</span>
              <img src={hotel.imagen} alt={hotel.nombre_hotel} className="card-imagen"
                onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            </div>
            <div className="card-info">
              <div className="card-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {hotel.municipio?.nombre}
              </div>
              <h3 className="card-titulo">{hotel.nombre_hotel}</h3>
              <div className="card-footer">
                <div className="card-calificacion">
                  <Star className="icono-estrella" fill={hotel.estrellas > 0 ? 'currentColor' : 'none'} />
                  <span>{hotel.estrellas > 0 ? `${hotel.estrellas} estrellas` : 'Sin calificar'}</span>
                </div>
                <button className={`favorito-btn ${favoritos.has(hotel.id_hotel) ? 'activo' : ''}`}
                  onClick={e => toggleFavorito(hotel.id_hotel, e)} aria-label="Añadir a favoritos">
                  <Heart className="favorito-icono" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hotelesPagina.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hay hoteles con esos filtros.</p>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />

      {selectedHotel && (
        <div className="modal-overlay" onClick={() => setSelectedHotel(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedHotel(null)}>✕</button>
            <img src={selectedHotel.imagen} alt={selectedHotel.nombre_hotel} className="modal-image"
              onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            <div className="modal-body">
              {selectedHotel.estrellas > 0 && (
                <span className="card-etiqueta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {selectedHotel.estrellas} <Star size={14} fill="currentColor" />
                </span>
              )}
              <h2 className="modal-title">{selectedHotel.nombre_hotel}</h2>
              <div className="modal-details">
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Municipio:</strong> {selectedHotel.municipio?.nombre ?? 'N/A'}</span></div>

                <div className="modal-detail-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <MapPin size={16} />
                    <strong>Dirección:</strong> {selectedHotel.numero_Calle} {selectedHotel.nombre_Calle}, CP {selectedHotel.codigoPostal}
                  </span>
                  {selectedHotel.latitud != null && selectedHotel.longitud != null ? (
                    <MiniMap lat={selectedHotel.latitud} lng={selectedHotel.longitud} height={180} />
                  ) : (
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Este hotel aún no tiene ubicación exacta registrada en el mapa.
                    </p>
                  )}

                {selectedHotel.latitud != null && selectedHotel.longitud != null ? (
                  <a  
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHotel.latitud},${selectedHotel.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '10px 14px', background: '#0ea5e9', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                  >
                    <MapPin size={16} color="#fff" />
                    Cómo llegar
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedHotel.nombre_Calle}, ${selectedHotel.municipio?.nombre ?? ''}, Colima`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '10px 14px', background: '#0ea5e9', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                  >
                    <MapPin size={16} color="#fff" />
                    Cómo llegar
                  </a>
                )}
                </div>

                <div className="modal-detail-row"><Phone size={16} /><span><strong>Teléfono:</strong> {selectedHotel.telefono?.toString() ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><Mail size={16} /><span><strong>Email:</strong> {selectedHotel.email ?? 'N/A'}</span></div>
                {selectedHotel.descripcion && <div className="modal-detail-row"><FileText size={16} /><span><strong>Descripción:</strong> {selectedHotel.descripcion}</span></div>}
                {selectedHotel.estrellas > 0 && <div className="modal-detail-row"><Star size={16} /><span><strong>Categoría:</strong> {selectedHotel.estrellas} estrellas</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Hoteles;