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
import Perfil from './pages/Perfil';
import MFASetup from './pages/mfa-setup';
import MFAVerify from './pages/mfa-verify';
import Suscripcion from './pages/Suscripcion';
import NotFound from './pages/NotFound';

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
            <Route path="registro" element={<Registro />} />
            <Route path="registro-proveedor" element={<RegistroProveedor />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="mfa-setup" element={<MFASetup />} />
            <Route path="mfa-verify" element={<MFAVerify />} />
            <Route path="suscripcion" element={<Suscripcion />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
