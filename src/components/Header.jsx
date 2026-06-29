import { useState, useEffect } from "react";
import { Menu, X, MapPin, UserCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import TuliA from "./TuliA";
import { useAuth } from "../context/AuthContext";
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
  { to: "/eventos", label: "Eventos" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { usuario, logout } = useAuth();

  const cerrarSesion = () => {
    // Ahora simplemente llamamos a la función logout del contexto
    logout();
  };

  const handleAnchorClick = (e, to) => {
    // Solo para enlaces de anclaje en la misma página
    if (to.startsWith('#')) {
      e.preventDefault();
      const targetId = to.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="header-root">
        <div className="header-container">
          <div className="header-inner">
            {/* Logo: izquierda */}
            <a href="/" className="header-logo">
              <MapPin className="header-logo-icon" />
              <span className="header-logo-text">Tulima</span>
            </a>

            {/* Nav: centro */}
            <nav className="header-desktop-nav">
              {navLinks.map((link) => (
                link.label === "TuliA" ? (
                  <button key={link.to} onClick={() => setIsChatOpen(true)} className="header-nav-link">
                    {link.label}
                  </button>
                ) : link.to.startsWith("/") ? (
                  <Link key={link.to} to={link.to} className="header-nav-link">{link.label}</Link>
                ) : (
                  <a
                    key={link.to}
                    href={link.to}
                    className="header-nav-link"
                    onClick={(e) => handleAnchorClick(e, link.to)}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            {/* Usuario: derecha del todo */}
            <div className="header-user-right">
              {usuario ? (
                <>
                  <div className="header-user-greeting">
                    <span className="header-greeting-text">Hola,</span>
                    <span className="header-greeting-name">{usuario.primerNombre}</span>
                  </div>
                  <Link to="/perfil" className="header-icon-btn" title="Mi perfil">
                    <UserCircle size={22} />
                  </Link>
                  <button onClick={cerrarSesion} className="header-icon-btn header-logout-btn" title="Cerrar sesión">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="header-btn-primary header-btn-login">
                  Iniciar Sesión
                </Link>
              )}
            </div>

            <button
              className="header-mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="header-icon" /> : <Menu className="header-icon" />}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="header-mobile-nav">
              <div className="header-mobile-nav-content">
                {usuario && (
                  <div className="header-mobile-user">
                    <div className="header-mobile-greeting">
                      <UserCircle size={20} />
                      <span>Hola, <strong>{usuario.primerNombre}</strong></span>
                    </div>
                  </div>
                )}
                {navLinks.map((link) => (
                  link.label === "TuliA" ? (
                    <button key={link.to} onClick={() => { setIsChatOpen(true); setIsMenuOpen(false); }} className="header-mobile-link">
                      {link.label}
                    </button>
                  ) : link.to.startsWith("/") ? (
                    <Link key={link.to} to={link.to} className="header-mobile-link" onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.to}
                      href={link.to}
                      className="header-mobile-link"
                      onClick={(e) => { setIsMenuOpen(false); handleAnchorClick(e, link.to); }}
                    >
                      {link.label}
                    </a>
                  )
                ))}
                {usuario ? (
                  <button onClick={cerrarSesion} className="header-mobile-link header-mobile-logout">
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                ) : (
                  <Link to="/login" className="header-btn-primary header-btn-primary--full" onClick={() => setIsMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <TuliA isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
