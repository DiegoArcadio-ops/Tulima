import React, { useState, useEffect } from 'react';
import { TreePalm, Mountain, Coffee, Fish, HelpCircle } from "lucide-react";
import './AboutColima.css';


const iconMap = {
  Palmtree: TreePalm,   // la key queda igual para no romper los datos del backend
  Mountain: Mountain,
  Coffee: Coffee,
  Fish: Fish
};

export default function AboutColima() {
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   /* Aqui va el endpoint Alan*/
  //   fetch('/api/colima/features') // no se te olvide cambiar la URL
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Error de red al intentar obtener los datos');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setFeatures(data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Hubo un problema con el fetch:", error);
  //       setError(error.message);
  //       setIsLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    setFeatures([
      { icon: 'Palmtree', title: 'Playas', description: 'Kilómetros de costa en el Pacífico mexicano.' },
      { icon: 'Mountain', title: 'Volcán de Fuego', description: 'Uno de los volcanes más activos de América Latina.' },
      { icon: 'Coffee', title: 'Café de altura', description: 'Granos cultivados en las laderas de la sierra colimense.' },
      { icon: 'Fish', title: 'Gastronomía marina', description: 'Mariscos frescos del Pacífico en Manzanillo.' },
    ]);
    setIsLoading(false);
  }, []);

  return (
    <section
      id="nosotros"
      className="about-section"
      style={{ backgroundImage: `url('/about-background.jpg')` }}
    >
      <div className="about-overlay"></div>

      <div className="about-container">
        <div className="about-content-wrapper">
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
              {features.map((feature) => {
                // Mapeamos el string del ícono al componente correspondiente de lucide
                const IconComponent = iconMap[feature.icon] || HelpCircle;

                return (
                  <div key={feature.title} className="about-feature">
                    <div className="about-feature-icon-wrapper">
                      <IconComponent className="about-feature-icon" />
                    </div>
                    <div className="about-feature-text">
                      <h3 className="about-feature-title">{feature.title}</h3>
                      <p className="about-feature-desc">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contenedor del nuevo botón de Más información */}
            <div className="about-action">
              <a href="/sobre-colima" className="btn-more-info">
                Más información
              </a>
            </div>

          </div>

          <div className="about-gallery">

            <div className="about-gallery-col">
              <div className="about-gallery-item about-gallery-item--short">
                <img src="foto-grid-3.jpg" alt="Foto 1" className="about-gallery-img" />
              </div>
              <div className="about-gallery-item about-gallery-item--tall">
                <img src="foto-grid-4.jpg" alt="Foto 2" className="about-gallery-img" />
              </div>
            </div>

            <div className="about-gallery-col about-gallery-col--offset">
              <div className="about-gallery-item about-gallery-item--tall">
                <img src="foto-grid-2.jpg" alt="Foto 3" className="about-gallery-img" />
              </div>
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