import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from "../components/HeroSection";
import FeaturedDestinations from "../components/FeaturedDestinations";
import InteractiveMap from "../components/InteractiveMap";
import AboutColima from "../components/AboutColima";
import './home.css';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = location.state.scrollTo;

      // Intenta hacer scroll con reintentos hasta encontrar el elemento
      let intentos = 0;
      const maxIntentos = 20;

      const intentarScroll = () => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (intentos < maxIntentos) {
          intentos++;
          setTimeout(intentarScroll, 150);
        }
      };

      setTimeout(intentarScroll, 150);
    }
  }, [location]);

  return (
    <div className="home-page-container">
      <HeroSection />
      <AboutColima />
      <FeaturedDestinations />
      <InteractiveMap />
    </div>
  );
}