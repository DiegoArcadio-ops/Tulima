import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from "./pages/home";
import Hoteles from "./pages/Hoteles";
import Restaurantes from "./pages/Restaurantes";
import Tours from "./pages/Tours";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Registro from "./pages/registro";
import DashboardProveedor from "./pages/DashboardProveedor";
import MainLayout from "./layouts/MainLayout";
import RutaProtegidaAdmin from "./components/RutaProtegidaAdmin";
import RegistroProveedor from "./pages/registro_pro"; 
import RutaProtegidaProveedor from "./components/RutaProtegidaProveedor";
import Ayuda from './pages/Ayuda';
import EventosNuevo from './pages/EventosNuevo';
import Perfil from './pages/Perfil';
import SeleccionRegistro from './pages/SeleccionRegistro';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="hoteles" element={<Hoteles />} />
            <Route path="restaurantes" element={<Restaurantes />} />
            <Route path="tours" element={<Tours />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<SeleccionRegistro />} />
            <Route path="registro/usuario" element={<Registro />} />
            <Route path="registro-proveedor" element={<RegistroProveedor />} />
            <Route path="ayuda" element={<Ayuda />} />
            <Route path="eventos" element={<EventosNuevo />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <Admin />
              </RutaProtegidaAdmin>
            }
          />
          <Route
            path="/dashboard-proveedor"
            element={
              <RutaProtegidaProveedor>
                <DashboardProveedor />
              </RutaProtegidaProveedor>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
