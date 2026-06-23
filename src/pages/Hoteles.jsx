import React, { useState, useEffect } from 'react';
import './Hoteles.css';
const URL = "https://tulima-backend.vercel.app/hoteles";

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Estados reseña
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar la lista de hoteles');
        return response.json();
      })
      .then((data) => {
        setHoteles(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hubo un problema al cargar los hoteles:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleOpenModal = (hotel) => {
    setSelectedHotel(hotel);
    setStars(0);
    setHoverStar(0);
    setComentario('');
    setEnviado(false);
  };

  const handleCloseModal = () => {
    setSelectedHotel(null);
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
      //     id_hotel: selectedHotel.id_hotel,
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

  if (isLoading) return <div className="hoteles-mensaje">Cargando hoteles...</div>;
  if (error) return <div className="hoteles-mensaje">Error: {error}</div>;

  return (
    <div className="hoteles-seccion">
      <h2 className="hoteles-titulo">Hoteles y Alojamientos</h2>

      <div className="hoteles-grid">
        {hoteles.map((hotel) => (
          <div
            key={hotel.id_hotel}
            className="hotel-card"
            onClick={() => handleOpenModal(hotel)}
            style={{ cursor: 'pointer' }}
          >
            <div className="hotel-imagen-container">
              <span className="hotel-etiqueta">{hotel.categoria}</span>
              <img
                src={hotel.imagen}
                alt={hotel.nombre_hotel}
                className="hotel-imagen"
                onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
              />
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
                <div className="hotel-calificacion">
                  <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-estrella">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{hotel.calificacion}</span>
                </div>
                <div className="hotel-precio">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-precio">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  {hotel.precio}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedHotel && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={handleCloseModal}>✕</button>

            <img
              src={selectedHotel.imagen}
              alt={selectedHotel.nombre_hotel}
              className="modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
            />

            <div className="modal-body">
              <span className="hotel-etiqueta">{selectedHotel.categoria}</span>
              <h2 className="modal-title">{selectedHotel.nombre_hotel}</h2>

              <div className="modal-details">
                <div className="modal-detail-row">
                  <strong>Municipio:</strong>
                  <span>{selectedHotel.municipio?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Dirección:</strong>
                  <span>{selectedHotel.numero_Calle} {selectedHotel.nombre_Calle}, CP {selectedHotel.codigoPostal}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Teléfono:</strong>
                  <span>{selectedHotel.telefono?.toString() ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Email:</strong>
                  <span>{selectedHotel.email ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Calificación:</strong>
                  <span>{selectedHotel.calificacion ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Descripción:</strong>
                  <span>{selectedHotel.descripcion ?? 'Sin descripción'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Reseña:</strong>
                  <span>{selectedHotel.rese_a?.descripcion ?? 'Sin reseña'}</span>
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
    </div>
  );
}

export default Hoteles;