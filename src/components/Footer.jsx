import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import './Footer.css';

const quickLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#mapa", label: "Municipios" },
  { href: "#destinos", label: "Destinos" },
  { href: "#nosotros", label: "Sobre Colima" },
];

const municipios = ["Colima", "Manzanillo", "Comala", "Tecomán", "Villa de Álvarez"];

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
              Tu guía completa para explorar los tesoros del estado de Colima, México.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <Facebook className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <Instagram className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <Twitter className="footer-social-icon" />
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
            <h3 className="footer-heading">Municipios</h3>
            <ul className="footer-list">
              {municipios.map((municipio) => (
                <li key={municipio}>
                  <a href="#mapa" className="footer-link">
                    {municipio}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h3 className="footer-heading">Contacto</h3>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin className="footer-contact-icon footer-contact-icon--offset" />
                <span className="footer-link-text">Colima, Col., México</span>
              </li>
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <a href="mailto:info@descubrecolima.mx" className="footer-link">
                  info@descubrecolima.mx
                </a>
              </li>
              <li className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <a href="tel:+523121234567" className="footer-link">
                  +52 312 123 4567
                </a>
              </li>
              <li className="footer-contact-item">
                <a href="/ayuda" className="footer-link" style={{ fontWeight: '600', color: '#0ea5e9' }}>
                  Ayuda
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 Tulima. Todos los derechos reservados.</p>
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
