import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import TuliA from "./TuliA"; 
import './Header.css'; // <-- Importamos tus nuevos estilos

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#mapa", label: "Municipios" },
  { href: "#destinos", label: "Destinos" },
  { href: "#nosotros", label: "Sobre Colima" },
  { href: "#contacto", label: "Contacto" },
  { href: "#Restaurantes", label: "Restaurantes" },
  { href: "#Hoteles", label: "Hoteles" },
  { href: "#Provedores", label: "Tours" },
  { href: "#ChatBot", label: "TuliA" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 

  return (
    <> 
      <header className="header-root">
        <div className="header-container">
          <div className="header-inner">
            
            {/* Logo */}
            <a href="/" className="header-logo">
              <MapPin className="header-logo-icon" />
              <span className="header-logo-text">
                Tulima<span></span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="header-desktop-nav">
              {navLinks.map((link) => (
                link.label === "TuliA" ? (
                  <button
                    key={link.href}
                    onClick={() => setIsChatOpen(true)}
                    className="header-nav-link"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="header-nav-link"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            {/* CTA Button (Desktop) */}
            <div className="header-cta-wrapper">
              <button className="header-btn-primary">
                Iniciar Sesion
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="header-mobile-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="header-icon" /> : <Menu className="header-icon" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="header-mobile-nav">
              <div className="header-mobile-nav-content">
                {navLinks.map((link) => (
                  link.label === "TuliA" ? (
                    <button
                      key={link.href}
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsMenuOpen(false); 
                      }}
                      className="header-mobile-link"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className="header-mobile-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  )
                ))}
                <button className="header-btn-primary header-btn-primary--full">
                  Planea tu viaje
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* TuliA Chatbot Component */}
      <TuliA isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}