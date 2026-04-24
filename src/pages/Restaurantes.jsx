import React from 'react';
import './Restaurantes.css'; 

function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/restaurantes') // ALAAAAAN
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar la lista de restaurantes');
        }
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