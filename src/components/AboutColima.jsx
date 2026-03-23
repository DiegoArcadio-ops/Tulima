import { Palmtree, Mountain, Coffee, Fish } from "lucide-react";
import './AboutColima.css'; // <-- Importación de tus nuevos estilos

const features = [
  {
    icon: Palmtree,
    title: "Playas Paradisíacas",
    description: "Más de 150 km de costa con playas de arena dorada y aguas cristalinas del Pacífico.",
  },
  {
    icon: Mountain,
    title: "Volcanes Activos",
    description: "Hogar del Volcán de Fuego, uno de los más activos de México, con paisajes impresionantes.",
  },
  {
    icon: Coffee,
    title: "Tradición Cafetera",
    description: "Las haciendas de Comala producen café de altura reconocido internacionalmente.",
  },
  {
    icon: Fish,
    title: "Gastronomía Marina",
    description: "Capital del Pez Vela con deliciosos platillos como el ceviche y pescado zarandeado.",
  },
];

export default function AboutColima() {
  return (
    <section
      id="nosotros"
      className="about-section"
      style={{ backgroundImage: `url('/about-background.jpg')` }}
    >
      {/* Capa oscura para que se lea el texto */}
      <div className="about-overlay"></div>

      <div className="about-container">
        <div className="about-content-wrapper">
          
          {/* TEXTO (Lado Izquierdo) */}
          <div className="about-text-content">
            <span className="about-subtitle">Sobre el Estado</span>
            <h2 className="about-title">
              Colima, el estado más pequeño con la mayor diversidad
            </h2>
            <p className="about-description">
              Con solo 5,627 km², Colima es el cuarto estado más pequeño de México, pero su riqueza natural y cultural
              es inmensa. Desde las playas de Manzanillo hasta las faldas del Volcán de Fuego, cada rincón ofrece una
              experiencia única.
            </p>

            <div className="about-features-grid">
              {features.map((feature) => (
                <div key={feature.title} className="about-feature">
                  <div className="about-feature-icon-wrapper">
                    <feature.icon className="about-feature-icon" />
                  </div>
                  <div className="about-feature-text">
                    <h3 className="about-feature-title">{feature.title}</h3>
                    <p className="about-feature-desc">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOTOS (Lado Derecho - Cuadrícula) */}
          <div className="about-gallery">
            
            {/* Columna Izquierda de Fotos */}
            <div className="about-gallery-col">
              {/* FOTO 1 */}
              <div className="about-gallery-item about-gallery-item--short">
                <img src="foto-grid-3.jpg" alt="Foto 1" className="about-gallery-img" />
              </div>
              {/* FOTO 2 */}
              <div className="about-gallery-item about-gallery-item--tall">
                <img src="foto-grid-4.jpg" alt="Foto 2" className="about-gallery-img" />
              </div>
            </div>

            {/* Columna Derecha de Fotos (Desplazada hacia abajo) */}
            <div className="about-gallery-col about-gallery-col--offset">
              {/* FOTO 3 */}
              <div className="about-gallery-item about-gallery-item--tall">
                <img src="foto-grid-2.jpg" alt="Foto 3" className="about-gallery-img" />
              </div>
              {/* FOTO 4 */}
              <div className="about-gallery-item about-gallery-item--short">
                <img src="foto-grid-11.jpg" alt="Foto 4" className="about-gallery-img" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}