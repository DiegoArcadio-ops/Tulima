import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import './Hoteles.css';
import '../components/filtros-paginacion.css';
import { useAuth } from '../context/AuthContext';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import Paginacion from '../components/Paginacion';

const URL = "https://tulima-backend.vercel.app/hoteles";
const PAGE_SIZE = 9;

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const { usuario } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const [favoritos, setFavoritos] = useState(new Set());

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario) return;
    axios.get('https://tulima-backend.vercel.app/favoritos', { withCredentials: true })
      .then(res => setFavoritos(new Set(res.data.filter(f => f.id_hotel != null).map(f => f.id_hotel))))
      .catch(() => {});
  }, [usuario]);

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error('Error al cargar hoteles'); return r.json(); })
      .then(data => { setHoteles(data); setIsLoading(false); })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  const toggleFavorito = async (hotelId, e) => {
    e.stopPropagation();
    if (!usuario) { alert('Debes iniciar sesión para añadir a favoritos.'); return; }
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
    } catch { setFavoritos(favoritos); alert('No se pudo actualizar el favorito.'); }
  };

  // Filtrado
  const municipios = [...new Set(hoteles.map(h => h.municipio?.nombre).filter(Boolean))];
  const categorias = [...new Set(hoteles.map(h => h.categoria).filter(Boolean))];

  const hotelesFiltrados = hoteles.filter(h => {
    const nombre = (h.nombre_hotel || '').toLowerCase();
    return (
      nombre.includes(busqueda.toLowerCase()) &&
      (!filtroMunicipio || h.municipio?.nombre === filtroMunicipio) &&
      (!filtroCategoria || h.categoria === filtroCategoria)
    );
  });

  const totalPaginas = Math.ceil(hotelesFiltrados.length / PAGE_SIZE);
  const hotelesPagina = hotelesFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const limpiar = () => { setBusqueda(''); setFiltroMunicipio(''); setFiltroCategoria(''); setPagina(1); };

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
          { key: 'categoria', value: filtroCategoria, setValue: v => { setFiltroCategoria(v); setPagina(1); }, opciones: categorias.map(c => ({ value: c, label: c })), placeholder: 'Categoría' },
        ]}
        total={hotelesFiltrados.length}
        labelEntidad="hotel"
        onLimpiar={limpiar}
      />

      <div className="hoteles-grid">
        {hotelesPagina.map(hotel => (
          <div key={hotel.id_hotel} className="hotel-card" onClick={() => setSelectedHotel(hotel)} style={{ cursor: 'pointer' }}>
            <div className="hotel-imagen-container">
              <span className="hotel-etiqueta">{hotel.categoria}</span>
              <img src={hotel.imagen} alt={hotel.nombre_hotel} className="hotel-imagen"
                onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            </div>
            <div className="hotel-info">
              <div className="hotel-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {hotel.municipio?.nombre}
              </div>
              <h3 className="hotel-titulo">{hotel.nombre_hotel}</h3>
              <div className="hotel-footer">
                <div className="hotel-precio">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-precio">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  {hotel.precio}
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
              <span className="hotel-etiqueta">{selectedHotel.categoria}</span>
              <h2 className="modal-title">{selectedHotel.nombre_hotel}</h2>
              <div className="modal-details">
                <div className="modal-detail-row"><strong>Municipio:</strong><span>{selectedHotel.municipio?.nombre ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><strong>Dirección:</strong><span>{selectedHotel.numero_Calle} {selectedHotel.nombre_Calle}, CP {selectedHotel.codigoPostal}</span></div>
                <div className="modal-detail-row"><strong>Teléfono:</strong><span>{selectedHotel.telefono?.toString() ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><strong>Email:</strong><span>{selectedHotel.email ?? 'N/A'}</span></div>
                {selectedHotel.descripcion && <div className="modal-detail-row"><strong>Descripción:</strong><span>{selectedHotel.descripcion}</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hoteles;
