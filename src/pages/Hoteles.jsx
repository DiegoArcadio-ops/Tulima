import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react'; // Importamos el ícono de corazón
import './Hoteles.css';
const URL = "https://tulima-backend.vercel.app/hoteles";

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Nuevo estado para favoritos
  const [favoritos, setFavoritos] = useState(new Set());
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
  };

  const handleCloseModal = () => {
    setSelectedHotel(null);
  };

  // Nueva función para manejar favoritos
  const toggleFavorito = (hotelId, e) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el corazón
    const nuevosFavoritos = new Set(favoritos);
    if (nuevosFavoritos.has(hotelId)) {
      nuevosFavoritos.delete(hotelId);
    } else {
      nuevosFavoritos.add(hotelId);
    }
    setFavoritos(nuevosFavoritos);
    // TODO: Aquí harías la llamada a tu API para guardar el favorito del usuario
    // ej. await axios.post(`/api/usuarios/favoritos`, { hotelId });
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
                <div className="hotel-precio">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-precio">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  {hotel.precio}
                </div>
                <button 
                  className={`favorito-btn ${favoritos.has(hotel.id_hotel) ? 'activo' : ''}`}
                  onClick={(e) => toggleFavorito(hotel.id_hotel, e)}
                  aria-label="Añadir a favoritos"
                >
                  <Heart className="favorito-icono" />
                </button>
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
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hoteles;