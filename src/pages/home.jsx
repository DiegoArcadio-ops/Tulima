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
    // Lee desde sessionStorage en lugar de location.state
    const target = sessionStorage.getItem('scrollTo');
    if (!target) return;
  
    sessionStorage.removeItem('scrollTo'); // limpia para que no vuelva a ejecutarse
  
    let intentos = 0;
    const intentarScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (intentos < 20) {
        intentos++;
        setTimeout(intentarScroll, 150);
      }
    };
  
    setTimeout(intentarScroll, 300); // espera a que el DOM monte
  }, []); // solo al montar, no depende de location

  return (
    <div className="home-page-container">
      <HeroSection />
      <AboutColima />
      <FeaturedDestinations />
      <InteractiveMap />
    </div>
  );
}