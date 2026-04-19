// src/pages/home.jsx
import React from 'react';

// Importamos los componentes
import HeroSection from "../components/HeroSection"; 
import FeaturedDestinations from "../components/FeaturedDestinations";
import InteractiveMap from "../components/InteractiveMap";
import AboutColima from "../components/AboutColima";

// Importamos los estilos puros
import './home.css';

export default function Home() {
  return (
    <div className="home-page-container">
      <HeroSection />
      <AboutColima />
      <FeaturedDestinations />
      <InteractiveMap />
    </div>
  );
}