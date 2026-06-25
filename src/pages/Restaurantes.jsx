import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react'; // Importamos el ícono de corazón
import './Restaurantes.css';
const URL = "https://tulima-backend.vercel.app/restaurantes";

function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);

  // Nuevo estado para favoritos
  const [favoritos, setFavoritos] = useState(new Set());
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
  };

  const handleCloseModal = () => {
    setSelectedRestaurante(null);
  };

  // Nueva función para manejar favoritos
  const toggleFavorito = (restauranteId, e) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el corazón
    const nuevosFavoritos = new Set(favoritos);
    if (nuevosFavoritos.has(restauranteId)) {
      nuevosFavoritos.delete(restauranteId);
    } else {
      nuevosFavoritos.add(restauranteId);
    }
    setFavoritos(nuevosFavoritos);
    // TODO: Aquí harías la llamada a tu API para guardar el favorito del usuario
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
                <div className="card-horario">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{formatTime(restaurante.horarioAbierto)} - {formatTime(restaurante.horarioCerrado)}</span>
                </div>
                <button 
                  className={`favorito-btn ${favoritos.has(restaurante.id_restaurante) ? 'activo' : ''}`}
                  onClick={(e) => toggleFavorito(restaurante.id_restaurante, e)}
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
                  <span><strong>Teléfono:</strong> {selectedRestaurante.telefono?.toString() ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Email:</strong> {selectedRestaurante.email ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Descripción:</strong>
                  <span>{selectedRestaurante.descripcion ?? 'Sin descripción'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Restaurantes;