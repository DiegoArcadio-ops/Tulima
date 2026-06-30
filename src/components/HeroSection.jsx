import { ChevronDown } from "lucide-react";
import './HeroSection.css';

export default function HeroSection() {
  const smoothScrollTo = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="hero-section">
      <div
        className="hero-bg-wrapper"
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/e2/e8/0a/e2e80aa676334691f5272df2ef622ac7.jpg')`,
        }}
      >
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <span className="hero-badge">
          Bienvenido al paraíso del Pacífico
        </span>

        <h1 className="hero-title">
          Descubre la magia de <span className="hero-title-accent">Colima</span>
        </h1>

        <p className="hero-description">
          Explora los 10 municipios del estado más pequeño de México, donde playas paradisíacas, volcanes majestuosos y
          tradiciones ancestrales te esperan.
        </p>

        <div className="hero-actions">
          {/* Botón Municipios → scroll al mapa en la misma página */}
          <a href="#mapa" onClick={(e) => smoothScrollTo(e, 'mapa')} className="hero-btn-primary">
            Explorar Municipios
          </a>
          <a href="#destinos" onClick={(e) => smoothScrollTo(e, 'destinos')} className="hero-btn-secondary">
            Ver Destinos
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <button onClick={(e) => smoothScrollTo(e, 'destinos')} aria-label="Scroll to next section" className="hero-scroll-link">
          <ChevronDown className="hero-scroll-icon" />
        </button>
      </div>
    </section>
  );
}
