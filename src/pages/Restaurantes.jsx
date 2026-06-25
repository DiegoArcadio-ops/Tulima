import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react'; // Importamos el ícono de corazón
import axios from 'axios';
import './Restaurantes.css';
import { useAuth } from '../context/AuthContext';
const URL = "https://tulima-backend.vercel.app/restaurantes";

function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);

  const { usuario } = useAuth();

  // Nuevo estado para favoritos
  const [favoritos, setFavoritos] = useState(new Set());

  // Efecto para cargar los favoritos del usuario al iniciar
  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!usuario) return; // Si no hay usuario, no hacemos nada

      try {
        const respuesta = await axios.get('https://tulima-backend.vercel.app/favoritos', { withCredentials: true });
        const idsFavoritos = new Set(
          respuesta.data
            .filter(fav => fav.id_restaurante != null) // Nos quedamos solo con los restaurantes
            .map(fav => fav.id_restaurante)
        );
        setFavoritos(idsFavoritos);
      } catch (error) {
        console.error("Error al cargar los favoritos:", error);
      }
    };
    cargarFavoritos();
  }, [usuario]);

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
  const toggleFavorito = async (restauranteId, e) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el corazón
    
    if (!usuario) {
      alert('Debes iniciar sesión para añadir a favoritos.');
      return;
    }

    const nuevosFavoritos = new Set(favoritos);
    const esFavorito = nuevosFavoritos.has(restauranteId);

    try {
      const config = { withCredentials: true };
      const data = { tipo: 'restaurante', id: restauranteId };

      if (esFavorito) {
        await axios.delete('https://tulima-backend.vercel.app/favoritos', { ...config, data });
        nuevosFavoritos.delete(restauranteId);
      } else {
        await axios.post('https://tulima-backend.vercel.app/favoritos', data, config);
        nuevosFavoritos.add(restauranteId);
      }
      setFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error.response?.data?.error || error.message);
      alert('No se pudo actualizar el favorito. Inténtalo de nuevo.');
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