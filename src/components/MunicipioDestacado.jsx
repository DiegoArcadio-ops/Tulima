import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Building2, UtensilsCrossed, Compass, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MunicipioDestacado.css';

const PUEBLOS = ['Quesería', 'El Trapiche', 'Alcaraces', 'Buenavista', 'Minatitlán', 'Chiapa'];

const API_URL = 'https://tulima-backend.vercel.app';

const CATEGORIAS = [
  { key: 'todos', label: 'Todos' },
  { key: 'hoteles', label: 'Hoteles' },
  { key: 'restaurantes', label: 'Restaurantes' },
  { key: 'tours', label: 'Tours' },
  { key: 'eventos', label: 'Eventos' },
];

export default function MunicipioDestacado() {
  const navigate = useNavigate();
  const [puebloSeleccionado, setPuebloSeleccionado] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');

  const [hoteles, setHoteles] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [tours, setTours] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/hoteles`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/restaurantes`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/tours`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/eventos`).then(r => r.json()).catch(() => []),
    ]).then(([h, r, t, e]) => {
      setHoteles(Array.isArray(h) ? h : []);
      setRestaurantes(Array.isArray(r) ? r : []);
      setTours(Array.isArray(t) ? t : []);
      setEventos(Array.isArray(e) ? e : []);
      setCargando(false);
    });
  }, []);

  const hotelesFiltrados = hoteles.filter(h => h.pueblo === puebloSeleccionado);
  const restaurantesFiltrados = restaurantes.filter(r => r.pueblo === puebloSeleccionado);
  const toursFiltrados = tours.filter(t => t.pueblo === puebloSeleccionado);
  const eventosFiltrados = eventos.filter(e => e.pueblo === puebloSeleccionado);

  const hayResultados = (() => {
    if (categoriaSeleccionada === 'hoteles') return hotelesFiltrados.length > 0;
    if (categoriaSeleccionada === 'restaurantes') return restaurantesFiltrados.length > 0;
    if (categoriaSeleccionada === 'tours') return toursFiltrados.length > 0;
    if (categoriaSeleccionada === 'eventos') return eventosFiltrados.length > 0;
    return (
      hotelesFiltrados.length > 0 ||
      restaurantesFiltrados.length > 0 ||
      toursFiltrados.length > 0 ||
      eventosFiltrados.length > 0
    );
  })();

  return (
    <section id="municipio-destacado" className="md-section">
      <div className="md-container">

        <div className="md-card-header">
          <div className="md-icon">
            <MapPin size={28} />
          </div>

          <div className="md-header-content">
            <span className="md-eyebrow">Municipio Destacado</span>
            <h2 className="md-title">Cuauhtémoc</h2>
            <p className="md-desc">
              Al norte de Colima late Cuauhtémoc, tierra de campos verdes y
              campanarios centenarios, donde el aroma a caña de azúcar se mezcla
              con el eco de las fiestas patronales. Sus pueblos guardan historias
              de generaciones, tradiciones que se celebran con el corazón y una
              calidez que solo su gente sabe ofrecer. Ven, recorre sus
              localidades y descubre los rincones y negocios que hacen de este
              municipio un pedacito inolvidable de México.
            </p>
          </div>

          <div className="md-img-frame">
            <img
              src="https://es-academic.com/pictures/eswiki/69/Escudo_Cuauhtemoc.png"
              alt="Escudo de Cuauhtémoc"
              className="md-img"
            />
          </div>
        </div>

        <div className="md-selector-wrap">
          <label htmlFor="pueblo-select" className="md-selector-label">
            <MapPin size={16} />
            Selecciona un pueblo
          </label>

          <div className="md-select-container">
            <select
              id="pueblo-select"
              className="md-select"
              value={puebloSeleccionado}
              onChange={(e) => {
                setPuebloSeleccionado(e.target.value);
                setCategoriaSeleccionada('todos');
              }}
            >
              <option value="">Pueblo</option>
              {PUEBLOS.map((pueblo) => (
                <option key={pueblo} value={pueblo}>{pueblo}</option>
              ))}
            </select>
            <ChevronDown size={18} className="md-select-icon" />
          </div>
        </div>

        {puebloSeleccionado && (
          <div className="md-resultados">
            <div className="md-categorias">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.key}
                  className={`md-cat-btn ${categoriaSeleccionada === cat.key ? 'md-cat-btn--activo' : ''}`}
                  onClick={() => setCategoriaSeleccionada(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {cargando && <p className="md-estado-msg">Cargando negocios...</p>}

            {!cargando && !hayResultados && (
              <p className="md-estado-msg">
                Aún no hay negocios registrados en <strong>{puebloSeleccionado}</strong>.
              </p>
            )}

            {!cargando && (categoriaSeleccionada === 'todos' || categoriaSeleccionada === 'hoteles') && hotelesFiltrados.length > 0 && (
              <div className="md-grupo">
                <h3 className="md-grupo-titulo"><Building2 size={18} /> Hoteles</h3>
                <div className="md-grid">
                  {hotelesFiltrados.map(h => (
                    <div
                      key={`hotel-${h.id_hotel}`}
                      className="md-card"
                      onClick={() => navigate(`/hoteles?id=${h.id_hotel}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={h.imagen}
                        alt={h.nombre_hotel}
                        className="md-card-img"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x260?text=Sin+Imagen'; }}
                      />
                      <div className="md-card-body">
                        <span className="md-card-badge">Hotel</span>
                        <h4 className="md-card-title">{h.nombre_hotel}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cargando && (categoriaSeleccionada === 'todos' || categoriaSeleccionada === 'restaurantes') && restaurantesFiltrados.length > 0 && (
              <div className="md-grupo">
                <h3 className="md-grupo-titulo"><UtensilsCrossed size={18} /> Restaurantes</h3>
                <div className="md-grid">
                  {restaurantesFiltrados.map(r => (
                    <div
                      key={`rest-${r.id_restaurante}`}
                      className="md-card"
                      onClick={() => navigate(`/restaurantes?id=${r.id_restaurante}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={r.imagen}
                        alt={r.nombre}
                        className="md-card-img"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x260?text=Sin+Imagen'; }}
                      />
                      <div className="md-card-body">
                        <span className="md-card-badge">Restaurante</span>
                        <h4 className="md-card-title">{r.nombre}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cargando && (categoriaSeleccionada === 'todos' || categoriaSeleccionada === 'tours') && toursFiltrados.length > 0 && (
              <div className="md-grupo">
                <h3 className="md-grupo-titulo"><Compass size={18} /> Tours</h3>
                <div className="md-grid">
                  {toursFiltrados.map(t => (
                    <div
                      key={`tour-${t.id_provedor}`}
                      className="md-card"
                      onClick={() => navigate(`/tours?id=${t.id_provedor}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={t.imagen}
                        alt={t.nombre}
                        className="md-card-img"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x260?text=Sin+Imagen'; }}
                      />
                      <div className="md-card-body">
                        <span className="md-card-badge">Tour</span>
                        <h4 className="md-card-title">{t.nombre}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cargando && (categoriaSeleccionada === 'todos' || categoriaSeleccionada === 'eventos') && eventosFiltrados.length > 0 && (
              <div className="md-grupo">
                <h3 className="md-grupo-titulo"><CalendarDays size={18} /> Eventos</h3>
                <div className="md-grid">
                  {eventosFiltrados.map(e => (
                    <div
                      key={`evento-${e.id_evento}`}
                      className="md-card"
                      onClick={() => navigate(`/eventos?id=${e.id_evento}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={e.imagen}
                        alt={e.nombre_Evento}
                        className="md-card-img"
                        onError={(ev) => { ev.target.src = 'https://placehold.co/400x260?text=Sin+Imagen'; }}
                      />
                      <div className="md-card-body">
                        <span className="md-card-badge">Evento</span>
                        <h4 className="md-card-title">{e.nombre_Evento}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}