import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, X, Heart } from "lucide-react";
import axios from 'axios';
import './FeaturedDestinations.css';
import '../components/filtros-paginacion.css';
import FiltrosBusqueda from './FiltrosBusqueda';
import Paginacion from './Paginacion';
import { useAuth } from '../context/AuthContext';
import { Toast } from './Toast';

const URL = "https://tulima-backend.vercel.app/destinos";
const PAGE_SIZE = 6;

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const { usuario } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const [favoritos, setFavoritos] = useState(new Set());
  const [toast, setToast] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario) return;
    axios.get('https://tulima-backend.vercel.app/favoritos', { withCredentials: true })
      .then(res => setFavoritos(new Set(res.data.filter(f => f.id_destino != null).map(f => f.id_destino))))
      .catch(() => {});
  }, [usuario]);

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error('Error al obtener los destinos'); return r.json(); })
      .then(data => { setDestinations(data); setIsLoading(false); })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  const handleOpenModal = (d) => setSelectedDestination(d);
  const handleCloseModal = () => setSelectedDestination(null);

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
      const data = { tipo: 'destino', id };
      if (esFavorito) await axios.delete('https://tulima-backend.vercel.app/favoritos', { ...config, data });
      else await axios.post('https://tulima-backend.vercel.app/favoritos', data, config);
    } catch {
      setFavoritos(favoritos);
      setToast({ mensaje: 'No se pudo actualizar el favorito.', tipo: 'error' });
    }
  };

  const formatTime = (t) => { if (!t) return "Horario no disponible"; return t.substring(11, 16); };

  // Filtros
  const municipios = [...new Set(destinations.map(d => d.municipio?.nombre).filter(Boolean))];
  const categorias = [...new Set(destinations.map(d => d.categoria?.nombre).filter(Boolean))];

  const filtrados = destinations.filter(d =>
    (d.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroMunicipio || d.municipio?.nombre === filtroMunicipio) &&
    (!filtroCategoria || d.categoria?.nombre === filtroCategoria)
  );

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const pagEnPantalla = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const limpiar = () => { setBusqueda(''); setFiltroMunicipio(''); setFiltroCategoria(''); setPagina(1); };

  if (isLoading) return <div className="destinations-section"><h2>Cargando destinos...</h2></div>;
  if (error) return <div className="destinations-section"><h2>Error: {error}</h2></div>;

  return (
    <section id="destinos" className="destinations-section">
      <div className="destinations-container">
        <div className="destinations-header">
          <span className="destinations-subtitle">Lugares Imperdibles</span>
          <h2 className="destinations-title">Destinos Destacados</h2>
          <p className="destinations-description">
            Los lugares más populares y hermosos que no puedes perderte en tu visita a Colima
          </p>
        </div>

        <FiltrosBusqueda
          busqueda={busqueda}
          setBusqueda={v => { setBusqueda(v); setPagina(1); }}
          filtros={[
            { key: 'municipio', value: filtroMunicipio, setValue: v => { setFiltroMunicipio(v); setPagina(1); }, opciones: municipios.map(m => ({ value: m, label: m })), placeholder: 'Municipio' },
            { key: 'categoria', value: filtroCategoria, setValue: v => { setFiltroCategoria(v); setPagina(1); }, opciones: categorias.map(c => ({ value: c, label: c })), placeholder: 'Categoría' },
          ]}
          total={filtrados.length}
          labelEntidad="destino"
          onLimpiar={limpiar}
        />

        <div className="destinations-grid">
          {pagEnPantalla.map(destination => (
            <div key={destination.id_destino} className="destination-card group"
              onClick={() => handleOpenModal(destination)} style={{ cursor: 'pointer' }}>
              <div className="destination-image-wrapper">
                <img src={destination.imagen} alt={destination.nombre} className="destination-image"
                  onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
                <div className="destination-badge-wrapper">
                  <span className="destination-badge">{destination.categoria?.nombre ?? 'Sin categoría'}</span>
                </div>
              </div>
              <div className="destination-content">
                <div className="destination-location">
                  <MapPin className="destination-icon-small" />
                  <span>{destination.municipio?.nombre ?? 'Sin municipio'}</span>
                </div>
                <h3 className="destination-card-title">{destination.nombre}</h3>
                <div className="destination-meta">
                  <div className="destination-duration">
                    <Clock className="destination-icon-small" />
                    <span>{formatTime(destination.horarioAbierto)} - {formatTime(destination.horarioCerrado)}</span>
                  </div>
                  <button className={`favorito-btn ${favoritos.has(destination.id_destino) ? 'activo' : ''}`}
                    onClick={e => toggleFavorito(destination.id_destino, e)} aria-label="Añadir a favoritos">
                    <Heart className="favorito-icono" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pagEnPantalla.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hay destinos con esos filtros.</p>
        )}

        <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />
      </div>

      {selectedDestination && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}><X size={20} /></button>
            <img src={selectedDestination.imagen} alt={selectedDestination.nombre} className="modal-image"
              onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            <div className="modal-body">
              <span className="destination-badge">{selectedDestination.categoria?.nombre ?? 'Sin categoría'}</span>
              <h2 className="modal-title">{selectedDestination.nombre}</h2>
              <div className="modal-details">
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Municipio:</strong> {selectedDestination.municipio?.nombre ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><Clock size={16} /><span><strong>Horario:</strong> {formatTime(selectedDestination.horarioAbierto)} - {formatTime(selectedDestination.horarioCerrado)}</span></div>
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Dirección:</strong> {selectedDestination.numero_Calle} {selectedDestination.nombre_Calle}, CP {selectedDestination.codifoPostal}</span></div>
              </div>
              <button className={`favorito-btn-grande ${favoritos.has(selectedDestination.id_destino) ? 'activo' : ''}`}
                onClick={e => toggleFavorito(selectedDestination.id_destino, e)}>
                <Heart className="favorito-icono" />
                {favoritos.has(selectedDestination.id_destino) ? 'En tus favoritos' : 'Añadir a favoritos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </section>
  );
}
