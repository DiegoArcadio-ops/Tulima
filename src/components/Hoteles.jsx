import React from 'react';
import './Hoteles.css';

const hotelesData = [
  {
    id: 1,
    categoria: 'Resort',
    imagen: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=600&auto=format&fit=crop',
    municipio: 'Manzanillo',
    nombre: 'Hotel Las Hadas',
    calificacion: '4.8',
    precio: '$2,500 MXN / noche'
  },
  {
    id: 2,
    categoria: 'Boutique',
    imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
    municipio: 'Comala',
    nombre: 'Hacienda de San Antonio',
    calificacion: '4.9',
    precio: '$4,200 MXN / noche'
  },
  {
    id: 3,
    categoria: 'Centro Histórico',
    imagen: 'https://images.unsplash.com/photo-1551882547-ff40c0d1398c?q=80&w=600&auto=format&fit=crop',
    municipio: 'Colima',
    nombre: 'Concierge Plaza Colima',
    calificacion: '4.5',
    precio: '$1,200 MXN / noche'
  },
];

function Hoteles() {
  return (
    <div className="hoteles-seccion">
      <h2 className="hoteles-titulo">Hoteles y Alojamientos</h2>
      
      <div className="hoteles-grid">
        {hotelesData.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            
            <div className="hotel-imagen-container">
              <span className="hotel-etiqueta">{hotel.categoria}</span>
              <img src={hotel.imagen} alt={hotel.nombre} className="hotel-imagen" />
            </div>

            <div className="hotel-info">
              
              <div className="hotel-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {hotel.municipio}
              </div>

              <h3 className="hotel-titulo">{hotel.nombre}</h3>

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
    </div>
  );
}

export default Hoteles;