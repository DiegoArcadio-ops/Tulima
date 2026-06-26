import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventosNuevo.css';

const URL = "https://tulima-backend.vercel.app/eventos";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar los eventos');
        return response.json();
      })
      .then((data) => {
        setEventos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (isLoading) return <div className="eventos-seccion"><h2>Cargando eventos...</h2></div>;
  if (error) return <div className="eventos-seccion"><h2>Error: {error}</h2></div>;

  return (
    <div className="eventos-seccion">
      <h2 className="eventos-titulo">Eventos</h2>

      {eventos.length === 0 ? (
        <p className="eventos-vacio">No hay eventos disponibles por el momento.</p>
      ) : (
        <div className="eventos-grid">
          {eventos.map((evento) => (
            <div
              key={evento.id_evento}
              className="evento-card"
              onClick={() => setSelectedEvento(evento)}
              style={{ cursor: 'pointer' }}
            >
              <div className="evento-header">
                <span className="evento-tipo">{evento.tipoEvento ?? 'Evento'}</span>
                <span className="evento-categoria">{evento.categoria?.nombre}</span>
              </div>

              <div className="evento-info">
                <h3 className="evento-nombre">{evento.nombre_Evento}</h3>

                <div className="evento-fechas">
                  <div className="evento-fecha-item">
                    <strong>Inicio:</strong> {formatFecha(evento.fechaInicio)}
                  </div>
                  <div className="evento-fecha-item">
                    <strong>Fin:</strong> {formatFecha(evento.fechaTermino)}
                  </div>
                </div>

                <div className="evento-ubicacion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {evento.destino_turistico?.municipio?.nombre ?? 'Colima'}
                </div>

                {evento.disponibilidad && (
                  <div className="evento-disponibilidad">
                    🎟️ {evento.disponibilidad}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedEvento && (
        <div className="modal-overlay" onClick={() => setSelectedEvento(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvento(null)}>✕</button>

            <div className="modal-body">
              <span className="evento-tipo">{selectedEvento.tipoEvento ?? 'Evento'}</span>
              <h2 className="modal-title">{selectedEvento.nombre_Evento}</h2>

              <div className="modal-details">
                <div className="modal-detail-row">
                  <strong>Categoría:</strong>
                  <span>{selectedEvento.categoria?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Municipio:</strong>
                  <span>{selectedEvento.destino_turistico?.municipio?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Dirección:</strong>
                  <span>{selectedEvento.numero_Calle} {selectedEvento.nombre_Calle}, CP {selectedEvento.codigoPostal}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Fecha inicio:</strong>
                  <span>{formatFecha(selectedEvento.fechaInicio)}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Fecha fin:</strong>
                  <span>{formatFecha(selectedEvento.fechaTermino)}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Disponibilidad:</strong>
                  <span>{selectedEvento.disponibilidad ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Eventos;