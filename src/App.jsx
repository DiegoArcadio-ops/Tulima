// src/App.jsx
import React from 'react';
import MainLayout from "./layouts/MainLayout"; // Layouts está en src/layouts
import Home from "./pages/home";               // Home está en src/pages/home.jsx

function App() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  )
}

export default App;