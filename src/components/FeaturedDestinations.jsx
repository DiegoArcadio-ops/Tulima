import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock } from "lucide-react";
import './FeaturedDestinations.css';

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /* Aqui endpoint*/
    fetch('/api/colima/destinations') // Cambia URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los destinos desde el servidor');
        }
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
              
              <div className="destination-image-wrapper">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="destination-image"
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
                />
                <div className="destination-badge-wrapper">
                  <span className="destination-badge">
                    {destination.category}
                  </span>
                </div>
              </div>

              <div className="destination-content">

                <div className="destination-location">
                  <MapPin className="destination-icon-small" />
                  <span>{destination.location}</span>
                </div>


                <h3 className="destination-card-title">
                  {destination.title}
                </h3>

                <div className="destination-meta">
                  <div className="destination-rating">
                    <Star className="destination-icon-small rating-star" />
                    <span className="rating-value">{destination.rating}</span>
                  </div>
                  <div className="destination-duration">
                    <Clock className="destination-icon-small" />
                    <span>{destination.duration}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="destinations-footer">
          <button className="destinations-btn">
            Ver todos los destinos
          </button>
        </div>
        
      </div>
    </section>
  );
}