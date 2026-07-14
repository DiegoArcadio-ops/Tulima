import { useState, useEffect, useRef } from "react";
import { Menu, X, MapPin, UserCircle, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TuliA from "./TuliA";
import { useAuth } from "../context/AuthContext";
import './Header.css';

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/", label: "Cuauhtémoc",   anchor: "municipio-destacado" },
  { to: "/", label: "El Trapiche",  anchor: "pueblo-destacado" },
  { to: "/sobre-colima", label: "Sobre Colima", anchor: "nosotros" },
  { to: "/", label: "Municipios",   anchor: "mapa" },
  { to: "/destinos", label: "Destinos" },
  { to: "/restaurantes", label: "Restaurantes" },
  { to: "/hoteles", label: "Hoteles" },
  { to: "/tours", label: "Tours" },
  { to: "/eventos", label: "Eventos" },
  { to: "/", label: "Contacto",     anchor: "contacto" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [indicador, setIndicador] = useState({ left: 0, width: 0, opacity: 0 });

  // Sección visible actualmente en pantalla ('mapa' | 'contacto' | null)
  const [seccionActiva, setSeccionActiva] = useState(null);

const panelUsuario = (() => {
    if (!usuario) return null;
    if (usuario.rol === 'admin' || usuario.id_rol === 1) {
      return { to: '/admin', label: 'Panel Admin' };
    }
    if (usuario.rol === 'proveedor' || usuario.id_rol === 2) {
      return { to: '/dashboard-proveedor', label: 'Mi Panel' };
    }
    return null;
  })();

  // Un link está activo si:
  // - tiene anchor y esa sección es la visible en pantalla (solo en '/')
  // - es "Inicio" y estamos en '/' y ninguna sección está activa (o sea, arriba del todo)
  // - o la ruta coincide normalmente
  const esActivo = (link) => {
    if (link.anchor === 'contacto') {
      // El footer (#contacto) existe en todas las páginas.
      return seccionActiva === 'contacto';
    }
    if (link.anchor) {
      return location.pathname === '/' && seccionActiva === link.anchor;
    }
    if (link.to === '/') {
      return location.pathname === '/' && !seccionActiva;
    }
    return location.pathname.startsWith(link.to) && seccionActiva !== 'contacto';
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

  // Observa las secciones (#mapa en Inicio, #contacto en el footer de cualquier página)
  useEffect(() => {
    let raf = null;

    const detectarSeccion = () => {
      raf = null;
      const LINEA_REFERENCIA = 150; // debajo del header fijo

      // ¿Llegamos al fondo real de la página? -> Contacto (footer, presente en todas las páginas)
      const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (alFinal) {
        setSeccionActiva('contacto');
        return;
      }

      // El resto de las secciones ancladas (Municipios) solo existen en Inicio
      if (location.pathname !== '/') {
        setSeccionActiva(null);
        return;
      }

      const secciones = ['municipio-destacado', 'pueblo-destacado', 'mapa', 'nosotros']
        .map(id => document.getElementById(id))
        .filter(Boolean)
        .map(el => {
          const rect = el.getBoundingClientRect();
          return { id: el.id, top: rect.top, bottom: rect.bottom };
        });

      if (secciones.length === 0) return;

      // La sección cuya franja contiene la línea de referencia
      const activa = secciones.find(s => s.top <= LINEA_REFERENCIA && s.bottom > LINEA_REFERENCIA);

      if (activa) {
        setSeccionActiva(activa.id);
      } else if (window.scrollY < 200) {
        setSeccionActiva(null); // arriba del todo, en el Hero
      }
      // Si no hay coincidencia y no estamos arriba del todo, no tocamos el estado:
      // se mantiene la última sección activa hasta que otra la reemplace.
    };
  
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(detectarSeccion);
    };
  
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    detectarSeccion(); // estado inicial al montar
  
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);
  
  const handleAnchorClick = (e, link) => {
    e.preventDefault();
    if (link.anchor === 'contacto') {
      // El footer vive en todas las páginas: solo bajamos hasta ahí, sin navegar a inicio.
      const el = document.getElementById('contacto');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (link.anchor) {
      if (location.pathname === '/') {
        let intentos = 0;
        const intentarScroll = () => {
          const el = document.getElementById(link.anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            // Corrige la posición si el layout cambió mientras se animaba el scroll
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 400);
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 900);
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
                    href={link.anchor === 'contacto' ? '#contacto' : `/#${link.anchor}`}
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
                  {panelUsuario && (
                    <Link to={panelUsuario.to} className="header-btn-panel" title={panelUsuario.label}>
                      <LayoutDashboard size={16} />
                      {panelUsuario.label}
                    </Link>
                  )}
                  <Link to="/perfil" className="header-icon-btn" title="Mi perfil">
                    <UserCircle size={22} />
                  </Link>
                  <button onClick={() => logout()} className="header-icon-btn header-logout-btn" title="Cerrar sesión">
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
                {panelUsuario && (
                  <Link
                    to={panelUsuario.to}
                    className="header-mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} /> {panelUsuario.label}
                  </Link>
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
                      href={link.anchor === 'contacto' ? '#contacto' : `/#${link.anchor}`}
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
                  <button onClick={() => { setIsMenuOpen(false); logout(); }} className="header-mobile-link header-mobile-logout">
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