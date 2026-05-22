import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, X, Phone, Mail, Globe } from "lucide-react";
import './FeaturedDestinations.css';

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    fetch('/api/colima/destinos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los destinos desde el servidor');
        }
        return response.json();
      })
      .then((data) => {
        const mapped = data.map((d) => ({
          // Campos del card principal
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
          // Campos extra para el modal (todos los que vienen del backend)
          numeroCalle: d.numero_Calle ?? 'N/A',
          nombreCalle: d.nombre_Calle ?? 'N/A',
          codigoPostal: d.codifoPostal ?? 'N/A',
          estadoConvenio: d.estadoConvenio,
          resena: d.rese_a?.descripcion ?? 'Sin reseña',
          municipioCompleto: d.municipio?.nombre ?? 'Sin municipio',
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
              key={destination.id}
              className="destination-card group"
              onClick={() => setSelectedDestination(destination)}
              style={{ cursor: 'pointer' }}
            >
              <div className="destination-image-wrapper">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="destination-image"
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
                />
                <div className="destination-badge-wrapper">
                  <span className="destination-badge">{destination.category}</span>
                </div>
              </div>

              <div className="destination-content">
                <div className="destination-location">
                  <MapPin className="destination-icon-small" />
                  <span>{destination.location}</span>
                </div>
                <h3 className="destination-card-title">{destination.title}</h3>
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
          <button className="destinations-btn">Ver todos los destinos</button>
        </div>
      </div>

      {/* MODAL */}
      {selectedDestination && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDestination(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedDestination(null)}
            >
              <X size={20} />
            </button>

            <img
              src={selectedDestination.image}
              alt={selectedDestination.title}
              className="modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
            />

            <div className="modal-body">
              <span className="destination-badge">{selectedDestination.category}</span>
              <h2 className="modal-title">{selectedDestination.title}</h2>

              <div className="modal-details">
                <div className="modal-detail-row">
                  <MapPin size={16} />
                  <span><strong>Municipio:</strong> {selectedDestination.municipioCompleto}</span>
                </div>
                <div className="modal-detail-row">
                  <Clock size={16} />
                  <span><strong>Horario:</strong> {selectedDestination.duration}</span>
                </div>
                <div className="modal-detail-row">
                  <Star size={16} />
                  <span><strong>Calificación:</strong> {selectedDestination.rating}</span>
                </div>
                <div className="modal-detail-row">
                  <MapPin size={16} />
                  <span><strong>Dirección:</strong> {selectedDestination.numeroCalle} {selectedDestination.nombreCalle}, CP {selectedDestination.codigoPostal}</span>
                </div>
                <div className="modal-detail-row">
                  <span>
                    <strong>Convenio activo:</strong>{' '}
                    {selectedDestination.estadoConvenio ? ' Sí' : ' No'}
                  </span>
                </div>
                <div className="modal-detail-row">
                  <span><strong>Reseña:</strong> {selectedDestination.resena}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}