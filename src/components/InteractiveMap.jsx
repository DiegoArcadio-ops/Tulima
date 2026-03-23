import { useState } from "react";
import { X, MapPin } from "lucide-react";
import './InteractiveMap.css'; // <-- Importamos los estilos

const municipios = [
  {
    id: "colima",
    name: "Colima Capital",
    position: { x: 62, y: 40 }, 
    description: "La ciudad de las palmeras, capital del estado con hermosa arquitectura colonial.",
    highlights: ["Catedral Basílica", "Piedra Lisa", "Jardín Libertad"],
    image: "/colima-city-center-cathedral.jpg",
  },
  {
    id: "manzanillo",
    name: "Manzanillo",
    position: { x: 15, y: 65 },
    description: "La Capital Mundial del Pez Vela y el puerto comercial más importante.",
    highlights: ["Playa La Audiencia", "Centro Histórico", "El Iguanario"],
    image: "/manzanillo-beach-sunset.jpg",
  },
  {
    id: "comala",
    name: "Comala",
    position: { x: 60, y: 25 },
    description: "Pueblo Mágico Blanco de América, inspiración de Juan Rulfo.",
    highlights: ["Pan y Café", "Hacienda de Nogueras", "Los Portales"],
    image: "/comala-pueblo-magico-white-buildings.jpg",
  },
  {
    id: "tecoman",
    name: "Tecomán",
    position: { x: 55, y: 82 },
    description: "Capital mundial del limón, tierra caliente de grandes olas.",
    highlights: ["Boca de Pascuales", "El Real", "Gastronomía"],
    image: "/tecoman-colima-lime-fields.jpg",
  },
  {
    id: "minatitlan",
    name: "Minatitlán",
    position: { x: 15, y: 35 },
    description: "Entre montañas y minas, ideal para el ecoturismo y senderismo.",
    highlights: ["Cascada El Salto", "Ojo de Mar", "Parque Acuático"],
    image: "/minatitlan-colima-volcano.jpg",
  },
  {
    id: "villa-de-alvarez",
    name: "Villa de Álvarez",
    position: { x: 58, y: 45 },
    description: "Tradición y fiesta, hogar de la Petatera y los sopitos.",
    highlights: ["La Petatera", "Fiestas Charrotaurinas", "La Campana"],
    image: "/villa-de-alvarez-colima.jpg",
  },
  {
    id: "armeria",
    name: "Armería",
    position: { x: 42, y: 78 },
    description: "Playas de arena negra y el famoso tortugario.",
    highlights: ["Cuyutlán", "El Tortugario", "Museo de la Sal"],
    image: "/armeria-colima-cuyutlan-beach.jpg",
  },
  {
    id: "coquimatlan",
    name: "Coquimatlán",
    position: { x: 48, y: 50 },
    description: "El lugar donde se atrapan las redes, rico en agricultura.",
    highlights: ["Los Amiales", "Piedra Cohete", "Ríos"],
    image: "/coquimatlan-colima-rural-landscape.jpg",
  },
  {
    id: "cuauhtemoc",
    name: "Cuauhtémoc",
    position: { x: 75, y: 28 },
    description: "Clima fresco y puerta de entrada al nevado.",
    highlights: ["Quesadillas y Ron", "Aeropuerto", "Montaña"],
    image: "/cuauhtemoc-colima-archaeological.jpg",
  },
  {
    id: "ixtlahuacan",
    name: "Ixtlahuacán",
    position: { x: 70, y: 75 },
    description: "Tierra del melón y tradiciones antiguas como los Chayacates.",
    highlights: ["Grutas de San Gabriel", "La Tumba", "Tradiciones"],
    image: "/ixtlahuacan-colima-colonial-church.jpg",
  },
];

export default function InteractiveMap() {
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [hoveredMunicipio, setHoveredMunicipio] = useState(null);

  return (
    <section id="mapa" className="map-section">
      <div className="map-container">
        
        {/* Encabezado */}
        <div className="map-header">
          <span className="map-subtitle">Tu Guía Interactiva</span>
          <h2 className="map-title">Explora el Territorio</h2>
          <p className="map-desc">
            Selecciona un punto en el mapa para descubrir la magia de cada municipio.
          </p>
        </div>

        {/* Contenedor del Mapa */}
        <div className="map-svg-wrapper">
          <div className="map-svg-container">
            <svg 
              viewBox="0 0 100 100" 
              className="map-svg"
            >
              {/* SILUETA DE COLIMA */}
              <path
                d="M 55,5 
                   Q 65,15 75,20 
                   L 85,25 
                   Q 90,35 85,45 
                   L 90,55 
                   L 80,75 
                   Q 70,85 55,90 
                   L 40,92 
                   Q 25,90 15,75 
                   L 5,65 
                   Q 2,55 5,45 
                   L 15,35 
                   Q 25,25 40,20 
                   Z"
                fill="#f3f4f6"
                stroke="#2d7a6d"
                strokeWidth="0.8"
                className="map-path"
              />
              
              {/* Costa del Pacífico */}
              <path
                d="M 5,65 Q 15,75 25,90 L 40,92 Q 55,90 70,85"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeLinecap="round"
              />

              {/* PUNTOS DE LOS MUNICIPIOS */}
              {municipios.map((municipio) => (
                <g key={municipio.id}>
                  {/* Círculo pulsante (Efecto de radar) */}
                  <circle
                    cx={municipio.position.x}
                    cy={municipio.position.y}
                    r={hoveredMunicipio === municipio.id ? 3 : 0}
                    className="map-point-ping"
                  />
                  
                  {/* El punto interactivo real */}
                  <circle
                    cx={municipio.position.x}
                    cy={municipio.position.y}
                    r={hoveredMunicipio === municipio.id ? 2 : 1.5}
                    className={`map-point ${
                      selectedMunicipio?.id === municipio.id 
                        ? "map-point--selected" 
                        : ""
                    }`}
                    onClick={() => setSelectedMunicipio(municipio)}
                    onMouseEnter={() => setHoveredMunicipio(municipio.id)}
                    onMouseLeave={() => setHoveredMunicipio(null)}
                  />

                  {/* Etiqueta flotante */}
                  {hoveredMunicipio === municipio.id && (
                    <text
                      x={municipio.position.x}
                      y={municipio.position.y - 4}
                      textAnchor="middle"
                      className="map-point-label"
                    >
                      {municipio.name}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Leyenda */}
            <div className="map-legend">
              <div className="map-legend-item">
                <div className="map-legend-color map-legend-color--primary"></div>
                <span>Municipio</span>
              </div>
              <div className="map-legend-item">
                <div className="map-legend-color map-legend-color--coast"></div>
                <span>Costa Pacífico</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL DE INFORMACIÓN */}
        {selectedMunicipio && (
          <div className="map-modal-overlay">
            <div className="map-modal-card">
              
              {/* Encabezado del modal */}
              <div className="map-modal-hero">
                <img
                  src={selectedMunicipio.image}
                  alt={selectedMunicipio.name}
                  className="map-modal-img"
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Imagen+No+Disponible" }}
                />
                <div className="map-modal-gradient"></div>
                <h3 className="map-modal-title">
                  {selectedMunicipio.name}
                </h3>
                <button
                  onClick={() => setSelectedMunicipio(null)}
                  className="map-modal-close"
                >
                  <X className="map-modal-close-icon" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="map-modal-body">
                <div className="map-modal-desc-row">
                  <MapPin className="map-modal-icon" />
                  <p className="map-modal-desc-text">
                    {selectedMunicipio.description}
                  </p>
                </div>

                <div className="map-modal-tags-section">
                  <h4 className="map-modal-tags-title">
                    Lo que no te puedes perder
                  </h4>
                  <div className="map-modal-tags-container">
                    {selectedMunicipio.highlights.map((highlight) => (
                      <span key={highlight} className="map-modal-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="map-modal-btn"
                  onClick={() => setSelectedMunicipio(null)}
                >
                  Ver más detalles
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}