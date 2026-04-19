import React from 'react';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import './MainLayout.css'; // Importamos su propio CSS

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      
      {/* 'main' ocupa el espacio restante para empujar el footer abajo */}
      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;