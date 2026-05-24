import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, X } from "lucide-react";
import './FeaturedDestinations.css';
const URL = "https://tulima-backend.vercel.app/destinos";

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

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener los destinos desde el servidor');
        return response.json();
      })
      .then((data) => {
        setDestinations(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Hubo un problema con el fetch de destinos:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleOpenModal = (destination) => {
    setSelectedDestination(destination);
    setStars(0);
    setHoverStar(0);
    setComentario('');
    setEnviado(false);
  };

  const handleCloseModal = () => {
    setSelectedDestination(null);
    setStars(0);
    setHoverStar(0);
    setComentario('');
    setEnviado(false);
  };

  const handleEnviarResena = async () => {
    if (stars === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    setEnviando(true);

    try {
      // TODO: reemplazar URL cuando Alan tenga el endpoint listo
      // await fetch(URL + '/resenas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     id_destino: selectedDestination.id,
      //     calificacion: stars,
      //     descripcion: comentario,
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));
      setEnviado(true);
    } catch (err) {
      alert('Error al enviar la reseña');
    } finally {
      setEnviando(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Horario no disponible";
    return timeStr.substring(11, 16);
  };

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

        <div className="destinations-grid">
          {destinations.map((destination) => (
            <div
              key={destination.id_destino}
              className="destination-card group"
              onClick={() => handleOpenModal(destination)}
              style={{ cursor: 'pointer' }}
            >
              <div className="destination-image-wrapper">
                <img
                  src={destination.imagen}
                  alt={destination.nombre}
                  className="destination-image"
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
                />
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

        <div className="destinations-footer">
          <button className="destinations-btn">Ver todos los destinos</button>
        </div>
      </div>

      {/* MODAL */}
      {selectedDestination && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={handleCloseModal}>
              <X size={20} />
            </button>

            <img
              src={selectedDestination.imagen}
              alt={selectedDestination.nombre}
              className="modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
            />

            <div className="modal-body">
              <span className="destination-badge">{selectedDestination.categoria?.nombre ?? 'Sin categoría'}</span>
              <h2 className="modal-title">{selectedDestination.nombre}</h2>

              <div className="modal-details">
                <div className="modal-detail-row">
                  <MapPin size={16} />
                  <span><strong>Municipio:</strong> {selectedDestination.municipio?.nombre ?? 'Sin municipio'}</span>
                </div>
                <div className="modal-detail-row">
                  <Clock size={16} />
                  <span><strong>Horario:</strong> {formatTime(selectedDestination.horarioAbierto)} - {formatTime(selectedDestination.horarioCerrado)}</span>
                </div>
                <div className="modal-detail-row">
                  <Star size={16} />
                  <span><strong>Calificación:</strong> {selectedDestination.calificacion}</span>
                </div>
                <div className="modal-detail-row">
                  <MapPin size={16} />
                  <span><strong>Dirección:</strong> {selectedDestination.numero_Calle} {selectedDestination.nombre_Calle}, CP {selectedDestination.codifoPostal}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Reseña:</strong> {selectedDestination.resena}</span>
                </div>
              </div>

              <div className="resena-seccion">
                <h3 className="resena-titulo">Deja tu reseña</h3>

                {enviado ? (
                  <p className="resena-exito">¡Gracias por tu reseña!</p>
                ) : (
                  <>
                    <div className="resena-estrellas">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`estrella ${n <= (hoverStar || stars) ? 'activa' : ''}`}
                          onClick={() => setStars(n)}
                          onMouseEnter={() => setHoverStar(n)}
                          onMouseLeave={() => setHoverStar(0)}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <textarea
                      className="resena-textarea"
                      placeholder="Escribe tu comentario..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={3}
                    />

                    <button
                      className="resena-btn"
                      onClick={handleEnviarResena}
                      disabled={enviando}
                    >
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