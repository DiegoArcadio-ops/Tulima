import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from "../components/HeroSection";
import InteractiveMap from "../components/InteractiveMap";
import AboutColima from "../components/AboutColima";
import './home.css';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const target = sessionStorage.getItem('scrollTo');
    if (!target) return;
  
    sessionStorage.removeItem('scrollTo');
  
    let intentos = 0;
    const intentarScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Correcciones: el layout puede seguir cambiando (imágenes,
        // mapa de Leaflet)
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 400);
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 900);
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 1500);
      } else if (intentos < 20) {
        intentos++;
        setTimeout(intentarScroll, 150);
      }
    };
  
    setTimeout(intentarScroll, 300);
  }, []);
  
  return (
    <div className="home-page-container">
      <HeroSection />
      <AboutColima />
      <InteractiveMap />
    </div>
  );
}