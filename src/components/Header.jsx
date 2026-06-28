import { useState, useEffect } from "react";
import { Menu, X, MapPin, UserCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import TuliA from "./TuliA";
import './Header.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const respuesta = await axios.get('https://tulima-backend.vercel.app/auth/me', {
          withCredentials: true
        });
        setUsuario(respuesta.data);
      } catch (error) { }
    };
    obtenerPerfil();
  }, []);

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const { data } = await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true });
        setCsrfToken(data.csrfToken);
      } catch (e) { console.warn('No se pudo obtener CSRF', e); }
    };
    fetchCsrf();
  }, []);

  const cerrarSesion = async () => {
    try {
      const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;
      await axios.post('https://tulima-backend.vercel.app/logout', {}, {
        headers: { 'X-CSRF-Token': token },
        withCredentials: true
      });
      localStorage.clear();
      setUsuario(null);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <header className="header-root">
        <div className="header-container">
          <div className="header-inner">

            {/* Usuario: izquierda del todo */}
            <div className="header-user-left">
              {usuario ? (
                <>
                  <div className="header-user-greeting">
                    <span className="header-greeting-text">Hola,</span>
                    <span className="header-greeting-name">{usuario.primerNombre} {usuario.apellidoPaterno}</span>
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

            {/* Logo: centro */}
            <a href="/" className="header-logo">
              <MapPin className="header-logo-icon" />
              <span className="header-logo-text">Tulima</span>
            </a>

            {/* Nav: derecha */}
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
                    onClick={link.label === "Municipios" ? (e) => {
                      e.preventDefault();
                      const el = document.getElementById('mapa');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } : undefined}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

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
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (link.label === "Municipios") {
                          e.preventDefault();
                          const el = document.getElementById('mapa');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
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
