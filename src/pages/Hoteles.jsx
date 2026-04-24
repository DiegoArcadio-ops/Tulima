import React from 'react';
import './Hoteles.css';

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/hoteles') // Alaaaaaaan
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar la lista de hoteles');
        }
        return response.json();
      })
      .then((data) => {
        setHoteles(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hubo un problema al cargar los hoteles:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);
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