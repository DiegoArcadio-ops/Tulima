import React, { useEffect, useState } from 'react';
import './Tours.css';

const URL = "http://127.0.0.1:8000/tours";

function Tours() {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);

  // Estados reseña
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar la lista de experiencias y tours');
        return response.json();
      })
      .then((data) => {
        setTours(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hubo un problema al cargar los tours:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleOpenModal = (tour) => {
    setSelectedTour(tour);
    setStars(0);
    setHoverStar(0);
    setComentario('');
    setEnviado(false);
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
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
      // TODO: reemplazar cuando Alan tenga el endpoint listo
      // await fetch('/api/resenas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     id_provedor: selectedTour.id_provedor,
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

  if (isLoading) return <div className="tours-seccion"><h2>Cargando tours...</h2></div>;
  if (error) return <div className="tours-seccion"><h2>Error: {error}</h2></div>;

  return (
    <div className="tours-seccion">
      <h2 className="tours-titulo">Tours y Experiencias</h2>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div
            key={tour.id_provedor}
            className="tour-card"
            onClick={() => handleOpenModal(tour)}
            style={{ cursor: 'pointer' }}
          >
            <div className="tour-imagen-container">
              <span className="tour-etiqueta">{tour.tipoTour}</span>
              <img
                src={tour.imagen}
                alt={tour.nombre}
                className="tour-imagen"
                onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
              />
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
                <div className="tour-calificacion">
                  <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-estrella">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{tour.calificacion}</span>
                </div>
                <div className="tour-duracion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedTour && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={handleCloseModal}>✕</button>

            <img
              src={selectedTour.imagen}
              alt={selectedTour.nombre}
              className="modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
            />

            <div className="modal-body">
              <span className="tour-etiqueta">{selectedTour.tipoTour}</span>
              <h2 className="modal-title">{selectedTour.nombre}</h2>

              <div className="modal-details">
                <div className="modal-detail-row">
                  <strong>Municipio:</strong>
                  <span>{selectedTour.municipio?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Tipo de servicio:</strong>
                  <span>{selectedTour.tipoServicio ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Teléfono:</strong>
                  <span>{selectedTour.telefono?.toString() ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Calificación:</strong>
                  <span>{selectedTour.calificacion ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Reseña:</strong>
                  <span>{selectedTour.rese_a?.descripcion ?? 'Sin reseña'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Convenio activo:</strong>
                  <span>{selectedTour.estadoConvenio ? 'Sí' : 'No'}</span>
                </div>
              </div>

              {/* FORMULARIO RESEÑA */}
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
    </div>
  );
}

export default Tours;