import React from 'react';
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/home";    
import Hoteles from "./pages/Hoteles";
import Restaurantes from "./pages/Restaurantes";
import Tours from "./pages/Tours";
import Login from "./pages/login";
import Admin from "./pages/admin";
import { BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/hoteles" element={<MainLayout><Hoteles /></MainLayout>} />
        <Route path="/restaurantes" element={<MainLayout><Restaurantes /></MainLayout>} />
        <Route path="/tours" element={<MainLayout><Tours /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;