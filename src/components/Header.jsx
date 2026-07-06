import { useState, useEffect, useRef } from "react";
import { Menu, X, MapPin, UserCircle, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TuliA from "./TuliA";
import { useAuth } from "../context/AuthContext";
import './Header.css';

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/", label: "Municipios",   anchor: "mapa" },
  { to: "/", label: "Destinos",     anchor: "destinos" },
  { to: "/sobre-colima", label: "Sobre Colima" },
  { to: "/", label: "Contacto",     anchor: "contacto" },
  { to: "/restaurantes", label: "Restaurantes" },
  { to: "/hoteles", label: "Hoteles" },
  { to: "/tours", label: "Tours" },
  { to: "/eventos", label: "Eventos" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [indicador, setIndicador] = useState({ left: 0, width: 0, opacity: 0 });


  const cerrarSesion = () => {
    logout();
  };

  const esActivo = (link) => {
    if (link.anchor) return false;
    if (link.to === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.to);
  };

  // Actualiza la posición del indicador cuando cambia la ruta
  useEffect(() => {
    if (!navRef.current) return;
    const linkActivo = navRef.current.querySelector('.header-nav-link--active');
    if (linkActivo) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = linkActivo.getBoundingClientRect();
      setIndicador({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    } else {
      setIndicador(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname]);

  const handleAnchorClick = (e, link) => {
    e.preventDefault();
    if (link.anchor) {
      if (location.pathname === '/') {
        let intentos = 0;
        const intentarScroll = () => {
          const el = document.getElementById(link.anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (intentos < 15) {
            intentos++;
            setTimeout(intentarScroll, 150);
          }
        };
        intentarScroll();
      } else {
        // Guarda el ancla en sessionStorage antes de navegar
        sessionStorage.setItem('scrollTo', link.anchor);
        navigate('/');
      }
    } else {
      navigate(link.to);
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
                {/* Indicador deslizante */}
              <span
                className="header-nav-indicator"
                style={{
                  left: indicador.left,
                  width: indicador.width,
                  opacity: indicador.opacity,
                }}
              />
              {navLinks.map((link) => (
                link.label === "TuliA" ? (
                  <button
                    key={link.label}
                    onClick={() => setIsChatOpen(true)}
                    className="header-nav-link"
                  >
                    {link.label}
                  </button>
                ) : link.anchor ? (
                  <a
                    key={link.label}
                    href={`/#${link.anchor}`}
                    className="header-nav-link"
                    onClick={(e) => handleAnchorClick(e, link)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`header-nav-link ${esActivo(link) ? 'header-nav-link--active' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Usuario: derecha */}
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
                    <button
                      key={link.label}
                      onClick={() => { setIsChatOpen(true); setIsMenuOpen(false); }}
                      className="header-mobile-link"
                    >
                      {link.label}
                    </button>
                  ) : link.anchor ? (
                    <a
                      key={link.label}
                      href={`/#${link.anchor}`}
                      className="header-mobile-link"
                      onClick={(e) => { setIsMenuOpen(false); handleAnchorClick(e, link); }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={`header-mobile-link ${esActivo(link) ? 'header-mobile-link--active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
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