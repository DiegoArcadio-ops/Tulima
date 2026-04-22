import React from 'react';
import './Restaurantes.css'; 

const restaurantesData = [
  {
    id: 1,
    categoria: 'Mariscos',
    imagen: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop',
    municipio: 'Manzanillo',
    nombre: 'Mariscos El Bigotes',
    calificacion: '4.8',
    horario: '12:00 PM - 8:00 PM'
  },
  {
    id: 2,
    categoria: 'Tradicional',
    imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    municipio: 'Comala',
    nombre: 'Los Portales de Suchitlán',
    calificacion: '4.9',
    horario: '8:00 AM - 6:00 PM'
  },
  {
    id: 3,
    categoria: 'Cortes',
    imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
    municipio: 'Colima',
    nombre: 'Asador Campestre',
    calificacion: '4.7',
    horario: '1:00 PM - 11:00 PM'
  },
];

function Restaurantes() {
  return (
    <div className="restaurantes-seccion">
      <h2 className="restaurantes-titulo">Restaurantes Destacados</h2>
      
      <div className="restaurantes-grid">
        {restaurantesData.map((restaurante) => (
          <div key={restaurante.id} className="restaurante-card">
            
            
            <div className="card-imagen-container">
              <span className="card-etiqueta">{restaurante.categoria}</span>
              <img src={restaurante.imagen} alt={restaurante.nombre} className="card-imagen" />
            </div>

            <div className="card-info">
              
              <div className="card-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {restaurante.municipio}
              </div>

  
              <h3 className="card-titulo">{restaurante.nombre}</h3>
              <div className="card-footer">
                <div className="card-calificacion">
                  <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-estrella">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{restaurante.calificacion}</span>
                </div>
                <div className="card-horario">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {restaurante.horario}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurantes;