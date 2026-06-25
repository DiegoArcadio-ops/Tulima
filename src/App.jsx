import React from 'react';
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/home";
import Hoteles from "./pages/Hoteles";
import Restaurantes from "./pages/Restaurantes";
import Tours from "./pages/Tours";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Registro from "./pages/registro";
import DashboardProveedor from "./pages/DashboardProveedor";
import RutaProtegidaAdmin from "./components/RutaProtegidaAdmin";
import TulimaAdminPanel from "./pages/admin";

// 1. Importamos tu nuevo archivo de registro de proveedores
// (Asumiendo que lo guardaste en la carpeta 'pages' como los demás)
import RegistroProveedor from "./pages/registro_pro"; 

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import RutaProtegidaProveedor from "./components/RutaProtegidaProveedor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/hoteles" element={<MainLayout><Hoteles /></MainLayout>} />
        <Route path="/restaurantes" element={<MainLayout><Restaurantes /></MainLayout>} />
        <Route path="/tours" element={<MainLayout><Tours /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
    
        <Route path="/registro" element={<MainLayout><Registro /></MainLayout>} />
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
        
        <Route path="/registro" element={<MainLayout><Registro /></MainLayout>} />

      
        <Route path="/registro-proveedor" element={<MainLayout><RegistroProveedor /></MainLayout>} />
        
      </Routes>
    </BrowserRouter>
  )
      </Routes>
    </BrowserRouter>
  );
}

export default App;
