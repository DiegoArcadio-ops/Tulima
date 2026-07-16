import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import CompletarPerfil from '../components/CompletarPerfil';
import './MainLayout.css';

const MainLayout = () => {
  const { usuario, refrescarUsuario } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [omitido, setOmitido] = useState(false);

  useEffect(() => {
    if (
      usuario &&
      usuario.googleId &&
      (!usuario.telefono || !usuario.genero || !usuario.edad) &&
      !omitido
    ) {
      setMostrarModal(true);
    }
  }, [usuario, omitido]);

  const handleCompletado = async (guardo) => {
    if (guardo) {
      await refrescarUsuario();
    } else {
      setOmitido(true);
    }
    setMostrarModal(false);
  };

  return (
    <div className="main-layout">
      <Header />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />

      {mostrarModal && (
        <CompletarPerfil onCompletado={handleCompletado} />
      )}
    </div>
  );
};

export default MainLayout;