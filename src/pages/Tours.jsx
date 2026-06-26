import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react'; // Importamos el ícono de corazón
import axios from 'axios';
import './Tours.css';
import { useAuth } from '../context/AuthContext';

const URL = "https://tulima-backend.vercel.app/tours";

function Tours() {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);

  const { usuario } = useAuth();

  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const { data } = await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true });
        setCsrfToken(data.csrfToken);
      } catch (e) {
        console.warn('No se pudo obtener CSRF token', e);
      }
    };
    fetchCsrf();
  }, []);

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
            .filter(fav => fav.id_provedor_tour != null) // Nos quedamos solo con los tours
            .map(fav => fav.id_provedor_tour)
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
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
  };

  // Nueva función para manejar favoritos
  const toggleFavorito = async (tourId, e) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el corazón
    
    if (!usuario) {
      alert('Debes iniciar sesión para añadir a favoritos.');
      return;
    }

    const nuevosFavoritos = new Set(favoritos);
    const esFavorito = nuevosFavoritos.has(tourId);

    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;
      const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
      const data = { tipo: 'tour', id: tourId };

      if (esFavorito) {
        await axios.delete('https://tulima-backend.vercel.app/favoritos', { ...config, data });
        nuevosFavoritos.delete(tourId);
      } else {
        await axios.post('https://tulima-backend.vercel.app/favoritos', data, config);
        nuevosFavoritos.add(tourId);
      }
      setFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error.response?.data?.error || error.message);
      alert('No se pudo actualizar el favorito. Inténtalo de nuevo.');
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
                <div className="tour-duracion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <button 
                  className={`favorito-btn ${favoritos.has(tour.id_provedor) ? 'activo' : ''}`}
                  onClick={(e) => toggleFavorito(tour.id_provedor, e)}
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
                  <strong>Descripción:</strong>
                  <span>{selectedTour.descripcion ?? 'Sin descripción'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tours;