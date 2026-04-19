import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import TuliA from "./TuliA"; 
import './Header.css'; 


const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "#mapa", label: "Municipios" },
  { to: "#destinos", label: "Destinos" },
  { to: "#nosotros", label: "Sobre Colima" },
  { to: "#contacto", label: "Contacto" },
  { to: "/restaurantes", label: "Restaurantes" },
  { to: "/hoteles", label: "Hoteles" },
  { to: "/tours", label: "Tours" },
  // { to: "#ChatBot", label: "TuliA" },
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
                    key={link.to}
                    onClick={() => setIsChatOpen(true)}
                    className="header-nav-link"
                  >
                    {link.label}
                  </button>
                ) : link.to.startsWith("/") ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="header-nav-link"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.to}
                    href={link.to}
                    className="header-nav-link"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            {/* CTA Button (Desktop) */}
            <div className="header-cta-wrapper">
              <Link to="/login" className="header-btn-primary">
                Iniciar Sesion
              </Link>
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
                      key={link.to}
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsMenuOpen(false); 
                      }}
                      className="header-mobile-link"
                    >
                      {link.label}
                    </button>
                  ) : link.to.startsWith("/") ? (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="header-mobile-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.to}
                      href={link.to}
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

      {/* TuliA Chatbot*/}
      <TuliA isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}