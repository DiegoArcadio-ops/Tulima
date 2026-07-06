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

  // Sección visible actualmente en pantalla ('mapa' | 'destinos' | 'contacto' | null)
  const [seccionActiva, setSeccionActiva] = useState(null);

  const cerrarSesion = () => {
    logout();
  };

  // Un link está activo si:
  // - tiene anchor y esa sección es la visible en pantalla (solo en '/')
  // - es "Inicio" y estamos en '/' y ninguna sección está activa (o sea, arriba del todo)
  // - o la ruta coincide normalmente
  const esActivo = (link) => {
    if (link.anchor) {
      return location.pathname === '/' && seccionActiva === link.anchor;
    }
    if (link.to === '/') {
      return location.pathname === '/' && !seccionActiva;
    }
    return location.pathname.startsWith(link.to);
  };

  // Mueve el indicador hacia cualquier elemento del DOM (hover o activo)
  const moverIndicador = (el) => {
    if (!el || !navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    setIndicador({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
    });
  };

  // Regresa el indicador al link realmente activo (o lo oculta si no hay ninguno)
  const resetIndicador = () => {
    if (!navRef.current) return;
    const linkActivo = navRef.current.querySelector('.header-nav-link--active');
    if (linkActivo) {
      moverIndicador(linkActivo);
    } else {
      setIndicador(prev => ({ ...prev, opacity: 0 }));
    }
  };

  // Reposiciona el indicador cuando cambia la ruta o la sección activa
  useEffect(() => {
    resetIndicador();
  }, [location.pathname, seccionActiva]);

  // Observa las secciones (#mapa, #destinos, #contacto) para saber cuál está visible
  useEffect(() => {
    if (location.pathname !== '/') {
      setSeccionActiva(null);
      return;
    }

    let observer;
    let intentos = 0;

    const iniciarObserver = () => {
      const ids = ['mapa', 'destinos', 'contacto'];
      const elementos = ids.map(id => document.getElementById(id)).filter(Boolean);

      if (elementos.length === 0) {
        if (intentos < 15) {
          intentos++;
          setTimeout(iniciarObserver, 150);
        }
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const visibles = entries.filter((e) => e.isIntersecting);
          if (visibles.length > 0) {
            const masVisible = visibles.reduce((a, b) =>
              b.intersectionRatio > a.intersectionRatio ? b : a
            );
            setSeccionActiva(masVisible.target.id);
          } else {
            const primera = elementos[0];
            if (primera && window.scrollY < primera.offsetTop - 150) {
              setSeccionActiva(null);
            }
          }
        },
        { rootMargin: '-100px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      elementos.forEach((el) => observer.observe(el));
    };

    iniciarObserver();

    return () => {
      if (observer) observer.disconnect();
    };
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
            <nav
              className="header-desktop-nav"
              ref={navRef}
              onMouseLeave={resetIndicador}
            >
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
                    onMouseEnter={(e) => moverIndicador(e.currentTarget)}
                    className="header-nav-link"
                  >
                    {link.label}
                  </button>
                ) : link.anchor ? (
                  <a
                    key={link.label}
                    href={`/#${link.anchor}`}
                    className={`header-nav-link ${esActivo(link) ? 'header-nav-link--active' : ''}`}
                    onClick={(e) => handleAnchorClick(e, link)}
                    onMouseEnter={(e) => moverIndicador(e.currentTarget)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`header-nav-link ${esActivo(link) ? 'header-nav-link--active' : ''}`}
                    onMouseEnter={(e) => moverIndicador(e.currentTarget)}
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
                      className={`header-mobile-link ${esActivo(link) ? 'header-mobile-link--active' : ''}`}
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