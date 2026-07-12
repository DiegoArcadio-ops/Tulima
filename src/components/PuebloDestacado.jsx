import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import './PuebloDestacado.css';

export default function PuebloDestacado() {
  return (
    <section id="pueblo-destacado" className="pd-section">
      <div className="pd-container">
        <div className="pd-icon">
          <MapPin size={28} />
        </div>

        <div className="pd-content">
          <span className="pd-eyebrow">Pueblo Destacado</span>
          <h3 className="pd-title">El Trapiche</h3>
          <p className="pd-desc">
            El Trapiche es ese rincón de Cuauhtémoc donde el tiempo se saborea
            despacio: entre el dulce legado de sus antiguas haciendas
            azucareras y el fervor de una de las fiestas patronales más
            queridas de la región. Aquí la vida se celebra alrededor de su
            parroquia y su plaza principal, envuelta siempre en la calidez
            de una gente que recibe a cada visitante como si volviera a casa.
          </p>
          <a href="/el-trapiche" className="pd-btn">
            Conocer El Trapiche
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="pd-img-frame">
          <img
            src="https://i0.wp.com/lopezdoriga.com/wp-content/uploads/2016/07/escudo-colima-3.jpg?resize=640%2C853"
            alt="Escudo de Colima"
            className="pd-img"
          />
        </div>
      </div>
    </section>
  );
}