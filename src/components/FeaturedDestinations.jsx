import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, X, Heart } from "lucide-react";
import axios from 'axios';
import './FeaturedDestinations.css';
import '../components/filtros-paginacion.css';
import FiltrosBusqueda from './FiltrosBusqueda';
import Paginacion from './Paginacion';
import { useAuth } from '../context/AuthContext';
import { Toast } from './Toast';
import MiniMap from './MiniMap';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { useSearchParams } from 'react-router-dom';

const URL = "https://api.tulima.site/destinos";
const PAGE_SIZE = 6;

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  useBodyScrollLock(!!selectedDestination);
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
    axios.get('https://api.tulima.site/api/csrf-token', { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken)).catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('https://api.tulima.site/municipios')
      .then(({ data }) => setTodosMunicipios(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario) return;
    axios.get('https://api.tulima.site/favoritos', { withCredentials: true })
      .then(res => setFavoritos(new Set(res.data.filter(f => f.id_destino != null).map(f => f.id_destino))))
      .catch(() => {});
  }, [usuario]);

  useEffect(() => {
  const id = searchParams.get('id');
  if (id && destinations.length > 0) {
    const encontrado = destinations.find(d => d.id_destino === Number(id));
    if (encontrado) {
      setSelectedDestination(encontrado);
      setSearchParams({}, { replace: true });
      setTimeout(() => {
        document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}, [searchParams, destinations, setSearchParams]);

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
      const token = csrfToken ?? (await axios.get('https://api.tulima.site/api/csrf-token', { withCredentials: true })).data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
      const data = { tipo: 'destino', id };
      if (esFavorito) await axios.delete('https://api.tulima.site/favoritos', { ...config, data });
      else await axios.post('https://api.tulima.site/favoritos', data, config);
    } catch {
      setFavoritos(favoritos);
      setToast({ mensaje: 'No se pudo actualizar el favorito.', tipo: 'error' });
    }
  };

  const formatTime = (t) => { if (!t) return "Horario no disponible"; return t.substring(11, 16); };

  // Filtros
  const municipios = todosMunicipios.length
    ? todosMunicipios.map(m => m.nombre).sort((a, b) => a.localeCompare(b))
    : [...new Set(destinations.map(d => d.municipio?.nombre).filter(Boolean))];
  const tipos = [...new Set(destinations.map(d => d.tipo).filter(Boolean))];

  const filtrados = destinations.filter(d =>
    (d.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroMunicipio || d.municipio?.nombre === filtroMunicipio) &&
    (!filtroTipo || d.tipo === filtroTipo)
  );

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const pagEnPantalla = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const limpiar = () => { setBusqueda(''); setFiltroMunicipio(''); setFiltroTipo(''); setPagina(1); };

  if (isLoading) return <section id="destinos" className="destinations-section"><h2>Cargando destinos...</h2></section>;
  if (error) return <section id="destinos" className="destinations-section"><h2>Error: {error}</h2></section>;
 
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
            { key: 'tipo', value: filtroTipo, setValue: v => { setFiltroTipo(v); setPagina(1); }, opciones: tipos.map(c => ({ value: c, label: c })), placeholder: 'Tipo' },
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
                  <span className="destination-badge">{destination.tipo ?? 'Destino'}</span>
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
              <span className="destination-badge">{selectedDestination.tipo ?? 'Destino'}</span>
              <h2 className="modal-title">{selectedDestination.nombre}</h2>
              <div className="modal-details">
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Municipio:</strong> {selectedDestination.municipio?.nombre ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><Clock size={16} /><span><strong>Horario:</strong> {formatTime(selectedDestination.horarioAbierto)} - {formatTime(selectedDestination.horarioCerrado)}</span></div>

                <div className="modal-detail-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <MapPin size={16} />
                    <strong>Dirección:</strong> {selectedDestination.numero_Calle} {selectedDestination.nombre_Calle}, CP {selectedDestination.codigoPostal}
                  </span>
                  {selectedDestination.latitud != null && selectedDestination.longitud != null ? (
                    <MiniMap lat={selectedDestination.latitud} lng={selectedDestination.longitud} height={180} />
                  ) : (
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Este destino aún no tiene ubicación exacta registrada en el mapa.
                    </p>
                  )}

                  {selectedDestination.latitud != null && selectedDestination.longitud != null ? (
                    <a  
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDestination.latitud},${selectedDestination.longitud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '10px 14px', background: '#0ea5e9', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      <MapPin size={16} color="#fff" />
                      Cómo llegar
                    </a>
                  ) : (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedDestination.nombre_Calle}, ${selectedDestination.municipio?.nombre ?? ''}, Colima`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '10px 14px', background: '#0ea5e9', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      <MapPin size={16} color="#fff" />
                      Cómo llegar
                    </a>
                  )}
                </div>
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