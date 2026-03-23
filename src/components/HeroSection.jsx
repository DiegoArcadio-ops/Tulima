import { ChevronDown } from "lucide-react";
import './HeroSection.css'; 


export default function HeroSection() {
  return (
    <section id="inicio" className="hero-section">
      <div
        className="hero-bg-wrapper"
        style={{
          backgroundImage: `url('/beautiful-beach-sunset-manzanillo-colima-mexico-pa.jpg')`,
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
          <a href="#mapa" className="hero-btn-primary">
            Explorar Municipios
          </a>
          <a href="#destinos" className="hero-btn-secondary">
            Ver Destinos
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <a href="#mapa" aria-label="Scroll to map" className="hero-scroll-link">
          <ChevronDown className="hero-scroll-icon" />
        </a>
      </div>
    </section>
  );
}