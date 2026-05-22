import React, { useState, useEffect } from 'react';
import './Restaurantes.css';
const URL = "http://127.0.0.1:8000/restaurantes";

function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);

  // Estados reseña
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar la lista de restaurantes');
        return response.json();
      })
      .then((data) => {
        setRestaurantes(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hubo un problema al cargar los restaurantes:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return "No disponible";
    return timeString.substring(11, 16);
  };

  const handleOpenModal = (restaurante) => {
    setSelectedRestaurante(restaurante);
    setStars(0);
    setHoverStar(0);
    setComentario('');
    setEnviado(false);
  };

  const handleCloseModal = () => {
    setSelectedRestaurante(null);
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
      //     id_restaurante: selectedRestaurante.id_restaurante,
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

  if (isLoading) return <div className="restaurantes-seccion"><h2>Cargando restaurantes...</h2></div>;
  if (error) return <div className="restaurantes-seccion"><h2>Error: {error}</h2></div>;

  return (
    <div className="restaurantes-seccion">
      <h2 className="restaurantes-titulo">Restaurantes Destacados</h2>

      <div className="restaurantes-grid">
        {restaurantes.map((restaurante) => (
          <div
            key={restaurante.id_restaurante}
            className="restaurante-card"
            onClick={() => handleOpenModal(restaurante)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-imagen-container">
              <span className="card-etiqueta">{restaurante.tipo}</span>
              <img src={restaurante.imagen} alt={restaurante.nombre} className="card-imagen" />
            </div>

            <div className="card-info">
              <div className="card-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {restaurante.municipio?.nombre}
              </div>

              <h3 className="card-titulo">{restaurante.nombre}</h3>

              <div className="card-footer">
                <div className="card-calificacion">
                  <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-estrella">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{restaurante.calificacion}</span>
                </div>
                <div className="card-horario">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{formatTime(restaurante.horarioAbierto)} - {formatTime(restaurante.horarioCerrado)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedRestaurante && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={handleCloseModal}>✕</button>

            <img
              src={selectedRestaurante.imagen}
              alt={selectedRestaurante.nombre}
              className="modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
            />

            <div className="modal-body">
              <span className="card-etiqueta">{selectedRestaurante.tipo}</span>
              <h2 className="modal-title">{selectedRestaurante.nombre}</h2>

              <div className="modal-details">
                <div className="modal-detail-row">
                  <span><strong>Municipio:</strong> {selectedRestaurante.municipio?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Dirección:</strong> {selectedRestaurante.numero_Calle} {selectedRestaurante.nombre_Calle}, CP {selectedRestaurante.codigoPostal}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Horario:</strong> {formatTime(selectedRestaurante.horarioAbierto)} - {formatTime(selectedRestaurante.horarioCerrado)}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Calificación:</strong> {selectedRestaurante.calificacion ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Teléfono:</strong> {selectedRestaurante.telefono?.toString() ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Email:</strong> {selectedRestaurante.email ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Disponibilidad:</strong> {selectedRestaurante.disponibilidad ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Convenio activo:</strong> {selectedRestaurante.estadoConvenio ? 'Sí' : 'No'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Reseña:</strong> {selectedRestaurante.rese_a?.descripcion ?? 'Sin reseña'}</span>
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

export default Restaurantes;