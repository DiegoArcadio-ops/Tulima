import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, X } from "lucide-react";
import './FeaturedDestinations.css';
import '../components/filtros-paginacion.css';
import FiltrosBusqueda from './FiltrosBusqueda';
import Paginacion from './Paginacion';

const URL = "https://tulima-backend.vercel.app/destinos";
const PAGE_SIZE = 6;

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error('Error al obtener los destinos'); return r.json(); })
      .then(data => { setDestinations(data); setIsLoading(false); })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  const handleOpenModal = (d) => {
    setSelectedDestination(d); setStars(0); setHoverStar(0); setComentario(''); setEnviado(false);
  };

  const handleCloseModal = () => {
    setSelectedDestination(null); setStars(0); setHoverStar(0); setComentario(''); setEnviado(false);
  };

  const handleEnviarResena = async () => {
    if (stars === 0) { alert('Por favor selecciona una calificación'); return; }
    setEnviando(true);
    await new Promise(r => setTimeout(r, 800));
    setEnviado(true);
    setEnviando(false);
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
                  <div className="destination-rating">
                    <Star className="destination-icon-small rating-star" />
                    <span className="rating-value">{destination.rating}</span>
                  </div>
                  <div className="destination-duration">
                    <Clock className="destination-icon-small" />
                    <span>{formatTime(destination.horarioAbierto)} - {formatTime(destination.horarioCerrado)}</span>
                  </div>
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
                <div className="modal-detail-row"><Star size={16} /><span><strong>Calificación:</strong> {selectedDestination.calificacion}</span></div>
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Dirección:</strong> {selectedDestination.numero_Calle} {selectedDestination.nombre_Calle}, CP {selectedDestination.codifoPostal}</span></div>
              </div>
              <div className="resena-seccion">
                <h3 className="resena-titulo">Deja tu reseña</h3>
                {enviado ? (
                  <p className="resena-exito">¡Gracias por tu reseña!</p>
                ) : (
                  <>
                    <div className="resena-estrellas">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={`estrella ${n <= (hoverStar || stars) ? 'activa' : ''}`}
                          onClick={() => setStars(n)} onMouseEnter={() => setHoverStar(n)} onMouseLeave={() => setHoverStar(0)}>★</span>
                      ))}
                    </div>
                    <textarea className="resena-textarea" placeholder="Escribe tu comentario..."
                      value={comentario} onChange={e => setComentario(e.target.value)} rows={3} />
                    <button className="resena-btn" onClick={handleEnviarResena} disabled={enviando}>
                      {enviando ? 'Enviando...' : 'Enviar reseña'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
