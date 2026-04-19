import { MapPin, Star, Clock } from "lucide-react";
import './FeaturedDestinations.css';

const destinations = [
  {
    id: "1",
    title: "Playa La Audiencia",
    location: "Manzanillo",
    image: "destino1.jpg",
    rating: 4.9,
    duration: "Día completo",
    category: "Playas",
  },
  {
    id: "2",
    title: "Volcán de Colima",
    location: "Colima",
    image: "destino2.jpg",
    rating: 4.8,
    duration: "Medio día",
    category: "Aventura",
  },
  {
    id: "3",
    title: "Pueblo Mágico Comala",
    location: "Comala",
    image: "destino3.jpg",
    rating: 4.7,
    duration: "Medio día",
    category: "Cultura",
  },
  {
    id: "4",
    title: "Laguna de Cuyutlán",
    location: "Armería",
    image: "destino4.jpg",
    rating: 4.6,
    duration: "3-4 horas",
    category: "Naturaleza",
  },
  {
    id: "5",
    title: "Zona Arqueológica El Chanal",
    location: "Colima",
    image: "destino5.jpg",
    rating: 4.5,
    duration: "2-3 horas",
    category: "Historia",
  },
  {
    id: "6",
    title: "Centro Histórico de Colima",
    location: "Colima",
    image: "destino6.jpg",
    rating: 4.7,
    duration: "Medio día",
    category: "Cultura",
  },
];

export default function FeaturedDestinations() {
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