import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock } from "lucide-react";
import './FeaturedDestinations.css';

const URL = "http://127.0.0.1:8000/destinos";

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los destinos desde el servidor');
        }
        return response.json();
      })
      .then((data) => {
        // Mapeo de campos del modelo Prisma al componente
        const mapped = data.map((d) => ({
          id: d.id_destino,
          image: d.imagen,
          title: d.nombre,
          category: d.categoria?.nombre ?? 'Sin categoría',
          location: d.municipio?.nombre ?? 'Sin municipio',
          rating: d.rese_a?.calificacion ?? 'N/A',
          duration:
            d.horarioAbierto && d.horarioCerrado
              ? `${d.horarioAbierto.substring(0, 5)} - ${d.horarioCerrado.substring(0, 5)}`
              : 'Sin horario',
        }));
        setDestinations(mapped);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Hubo un problema con el fetch de destinos:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Cargando destinos...</p>;
  if (error) return <p>Error: {error}</p>;
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
            <div key={destination.id} className="destination-card group">
            <div key={destination.id_destino} className="destination-card group">
              
              <div className="destination-image-wrapper">
                <img
                  src={destination.imagen}
                  alt={destination.nombre}
                  className="destination-image"
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
                />
                <div className="destination-badge-wrapper">
                  <span className="destination-badge">{destination.category}</span>
                  <span className="destination-badge">
                    {destination.categoria}
                  </span>
                </div>
              </div>

              <div className="destination-content">
                <div className="destination-location">
                  <MapPin className="destination-icon-small" />
                  <span>{destination.location || destination.municipio?.nombre}</span>
                </div>
                <h3 className="destination-card-title">{destination.title}</h3>


                <h3 className="destination-card-title">
                  {destination.nombre}
                </h3>

                <div className="destination-meta">
                  <div className="destination-rating">
                    <Star className="destination-icon-small rating-star" />
                    <span className="rating-value">{destination.rating || 4}</span>
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
    </section>
  );
}