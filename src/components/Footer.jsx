import { MapPin, Mail, Facebook, Instagram } from "lucide-react";
import "./Footer.css";

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#mapa", label: "Municipios" },
  { href: "/#destinos", label: "Destinos" },
  { href: "/#nosotros", label: "Sobre Colima" },
];

const copiarCorreo = () => {
  navigator.clipboard.writeText("info@descubrecolima.mx");
};

export default function Footer() {
  return (
    <footer id="contacto" className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <a href="/" className="footer-logo-link">
              <MapPin className="footer-logo-icon" />
              <span className="footer-logo-text">
                Tulima<span></span>
              </span>
            </a>
            <p className="footer-brand-desc">
              Tu guía completa para explorar los tesoros del estado de Colima,
              México.
            </p>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/profile.php?id=61591669495040"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Facebook"
              >
                <Facebook className="footer-social-icon" />
              </a>
              <a
                href="https://www.instagram.com/tulimacolima/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <Instagram className="footer-social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h3 className="footer-heading">Enlaces Rápidos</h3>
            <ul className="footer-list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h3 className="footer-heading">Contacto</h3>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <a href="mailto:info@descubrecolima.mx" className="footer-link">
                  info@descubrecolima.mx
                </a>
                <button
                  onClick={copiarCorreo}
                  title="Copiar correo"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  📋
                </button>
              </li>
              <li className="footer-contact-item">
                <a
                  href="/ayuda"
                  className="footer-link"
                  style={{ fontWeight: "600", color: "#0ea5e9" }}
                >
                  ❔Ayuda
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 Tulima. Todos los derechos reservados.
          </p>
          <div className="footer-legal-links">
            <a href="#" className="footer-legal-link">
              Política de Privacidad
            </a>
            <a href="#" className="footer-legal-link">
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
