import React from 'react';
import './Tours.css';

const toursData = [
  {
    id: 1,
    categoria: 'Playas',
    imagen: 'https://images.unsplash.com/photo-1596324121712-5bbc14482174?q=80&w=600&auto=format&fit=crop',
    municipio: 'Manzanillo',
    nombre: 'Playa La Audiencia',
    calificacion: '4.9',
    duracion: 'Día completo'
  },
  {
    id: 2,
    categoria: 'Aventura',
    imagen: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    municipio: 'Colima',
    nombre: 'Volcán de Colima',
    calificacion: '4.8',
    duracion: 'Medio día'
  },
  {
    id: 3,
    categoria: 'Cultura',
    imagen: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=600&auto=format&fit=crop',
    municipio: 'Comala',
    nombre: 'Pueblo Mágico Comala',
    calificacion: '4.7',
    duracion: 'Medio día'
  },
];

function Tours() {
  return (
    <div className="tours-seccion">
      <h2 className="tours-titulo">Tours y Experiencias</h2>
      
      <div className="tours-grid">
        {toursData.map((tour) => (
          <div key={tour.id} className="tour-card">
            
            <div className="tour-imagen-container">
              <span className="tour-etiqueta">{tour.categoria}</span>
              <img src={tour.imagen} alt={tour.nombre} className="tour-imagen" />
            </div>

            <div className="tour-info">
              
              <div className="tour-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {tour.municipio}
              </div>

              <h3 className="tour-titulo">{tour.nombre}</h3>
              <div className="tour-footer">
                <div className="tour-calificacion">
                  <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-estrella">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{tour.calificacion}</span>
                </div>
                <div className="tour-duracion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {tour.duracion}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tours;