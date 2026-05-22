import { useState , useEffect} from "react";
import { Menu, X, MapPin } from "lucide-react";
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
  // { to: "#ChatBot", label: "TuliA" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPerfil = async () => {
      try{
        const respuesta = await axios.get('http://localhost:8000/auth/me',{
          withCredentials: true
        });
        setUsuario(respuesta.data);
      }catch(error){

      }
    };
    obtenerPerfil();
  },[]);

  const cerrarSesion = async () => {
    try {
      await axios.post('http://localhost:8000/logout', {}, {
        withCredentials: true
      });
      
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
            
            <a href="/" className="header-logo">
              <MapPin className="header-logo-icon" />
              <span className="header-logo-text">
                Tulima<span></span>
              </span>
            </a>

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

            <div className="header-cta-wrapper">
              {usuario ? (
                <span className="header-user-name" style={{ fontWeight: 'bold', color: '#333' }}>
                  Hola, {usuario.primerNombre}  {usuario.apellidoPaterno}
                  <button 
                    onClick={cerrarSesion}
                    className="header-btn-secondary" 
                    style={{ background: 'transparent', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Salir
                  </button>
                </span>
                
              ) : (
                <Link to="/login" className="header-btn-primary">
                  Iniciar Sesion
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

      <TuliA isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}