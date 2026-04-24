import React from 'react';
import HeroSection from "../components/HeroSection"; 
import FeaturedDestinations from "../components/FeaturedDestinations";
import InteractiveMap from "../components/InteractiveMap";
import AboutColima from "../components/AboutColima";
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