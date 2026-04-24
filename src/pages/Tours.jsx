import React from 'react';
import './Tours.css';

function Tours() {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/tours') // alaaaan
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar la lista de experiencias y tours');
        }
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