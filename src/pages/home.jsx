import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import HeroSection from "../components/HeroSection"; 
import FeaturedDestinations from "../components/FeaturedDestinations";
import InteractiveMap from "../components/InteractiveMap";
import AboutColima from "../components/AboutColima";
import './home.css';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      // pequeño delay para que el DOM termine de montar
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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