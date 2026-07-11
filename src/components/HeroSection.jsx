import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from '../assets/hero-background.jpg';
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
          backgroundImage: `url(${heroBg})`,
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
          {/* Destinos ahora es su propia página */}
          <Link to="/destinos" className="hero-btn-secondary">
            Ver Destinos
          </Link>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <button onClick={(e) => smoothScrollTo(e, 'nosotros')} aria-label="Scroll to next section" className="hero-scroll-link">
          <ChevronDown className="hero-scroll-icon" />
        </button>
      </div>
    </section>
  );
}
