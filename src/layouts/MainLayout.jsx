import React , {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import { useAuth } from '../context/AuthContext';
import CompletarPerfil from '../components/CompletarPerfil';
import './MainLayout.css'; 

const MainLayout = () => {

  const { usuario } = useAuth();
const [mostrarModal, setMostrarModal] = useState(false);
useEffect(() => {
  if (
    usuario &&
    usuario.googleId && //
    (!usuario.telefono || !usuario.genero || !usuario.edad)
  ) {
    setMostrarModal(true);
  }
  }, [usuario]);

  return (
    <div className="main-layout">
      <Header />
      
      <main className="main-content">
        <Outlet />
      </main>

      <Footer />

      {mostrarModal && (
        <CompletarPerfil onCompletado={() => setMostrarModal(false)} />
        )}
    </div>
  );
};

export default MainLayout;