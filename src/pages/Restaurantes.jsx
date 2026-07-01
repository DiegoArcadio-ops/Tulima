import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import './Restaurantes.css';
import '../components/filtros-paginacion.css';
import { useAuth } from '../context/AuthContext';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import Paginacion from '../components/Paginacion';
import { Toast } from '../components/Toast';
import MiniMap from '../components/MiniMap';

const URL = "https://tulima-backend.vercel.app/restaurantes";
const PAGE_SIZE = 9;

function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);
  const { usuario } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const [favoritos, setFavoritos] = useState(new Set());
  const [toast, setToast] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })
      .then(({ data }) => setCsrfToken(data.csrfToken)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario) return;
    axios.get('https://tulima-backend.vercel.app/favoritos', { withCredentials: true })
      .then(res => setFavoritos(new Set(res.data.filter(f => f.id_restaurante != null).map(f => f.id_restaurante))))
      .catch(() => {});
  }, [usuario]);

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error('Error al cargar restaurantes'); return r.json(); })
      .then(data => { setRestaurantes(data); setIsLoading(false); })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  const formatTime = (t) => { if (!t) return "No disponible"; return t.substring(11, 16); };

const toggleFavorito = async (id, e) => {
  e.stopPropagation();
  if (!usuario) {
    setToast({ mensaje: 'Debes iniciar sesión para añadir a favoritos.', tipo: 'warning' });
    return;
  }
  const esFavorito = favoritos.has(id);
  const nuevo = new Set(favoritos);
  esFavorito ? nuevo.delete(id) : nuevo.add(id);
  setFavoritos(nuevo);
  try {
    const token = csrfToken ?? (await axios.get('https://tulima-backend.vercel.app/api/csrf-token', { withCredentials: true })).data.csrfToken;
    const config = { withCredentials: true, headers: { 'X-CSRF-Token': token } };
    const data = { tipo: 'restaurante', id };
    if (esFavorito) await axios.delete('https://tulima-backend.vercel.app/favoritos', { ...config, data });
    else await axios.post('https://tulima-backend.vercel.app/favoritos', data, config);
  } catch {
    setFavoritos(favoritos);
    setToast({ mensaje: 'No se pudo actualizar el favorito.', tipo: 'error' });
  }
};

  const municipios = [...new Set(restaurantes.map(r => r.municipio?.nombre).filter(Boolean))];
  const tipos = [...new Set(restaurantes.map(r => r.tipo).filter(Boolean))];

  const filtrados = restaurantes.filter(r =>
    (r.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroMunicipio || r.municipio?.nombre === filtroMunicipio) &&
    (!filtroTipo || r.tipo === filtroTipo)
  );

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const pagEnPantalla = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const limpiar = () => { setBusqueda(''); setFiltroMunicipio(''); setFiltroTipo(''); setPagina(1); };

  if (isLoading) return <div className="restaurantes-seccion"><h2>Cargando restaurantes...</h2></div>;
  if (error) return <div className="restaurantes-seccion"><h2>Error: {error}</h2></div>;

  return (
    <div className="restaurantes-seccion">
      <h2 className="restaurantes-titulo">Restaurantes Destacados</h2>

      <FiltrosBusqueda
        busqueda={busqueda}
        setBusqueda={v => { setBusqueda(v); setPagina(1); }}
        filtros={[
          { key: 'municipio', value: filtroMunicipio, setValue: v => { setFiltroMunicipio(v); setPagina(1); }, opciones: municipios.map(m => ({ value: m, label: m })), placeholder: 'Municipio' },
          { key: 'tipo', value: filtroTipo, setValue: v => { setFiltroTipo(v); setPagina(1); }, opciones: tipos.map(t => ({ value: t, label: t })), placeholder: 'Tipo de cocina' },
        ]}
        total={filtrados.length}
        labelEntidad="restaurante"
        onLimpiar={limpiar}
      />

      <div className="restaurantes-grid">
        {pagEnPantalla.map(r => (
          <div key={r.id_restaurante} className="restaurante-card" onClick={() => setSelectedRestaurante(r)} style={{ cursor: 'pointer' }}>
            <div className="card-imagen-container">
              <span className="card-etiqueta">{r.tipo}</span>
              <img src={r.imagen} alt={r.nombre} className="card-imagen"
                onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            </div>
            <div className="card-info">
              <div className="card-ubicacion">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {r.municipio?.nombre}
              </div>
              <h3 className="card-titulo">{r.nombre}</h3>
              <div className="card-footer">
                <div className="card-horario">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-reloj">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{formatTime(r.horarioAbierto)} - {formatTime(r.horarioCerrado)}</span>
                </div>
                <button className={`favorito-btn ${favoritos.has(r.id_restaurante) ? 'activo' : ''}`}
                  onClick={e => toggleFavorito(r.id_restaurante, e)} aria-label="Favorito">
                  <Heart className="favorito-icono" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagEnPantalla.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hay restaurantes con esos filtros.</p>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />

      {selectedRestaurante && (
        <div className="modal-overlay" onClick={() => setSelectedRestaurante(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRestaurante(null)}>✕</button>
            <img src={selectedRestaurante.imagen} alt={selectedRestaurante.nombre} className="modal-image"
              onError={e => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }} />
            <div className="modal-body">
              <span className="card-etiqueta">{selectedRestaurante.tipo}</span>
              <h2 className="modal-title">{selectedRestaurante.nombre}</h2>
              <div className="modal-details">
                <div className="modal-detail-row"><MapPin size={16} /><span><strong>Municipio:</strong> {selectedRestaurante.municipio?.nombre ?? 'N/A'}</span></div>

                <div className="modal-detail-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <MapPin size={16} />
                    <strong>Dirección:</strong> {selectedRestaurante.numero_Calle} {selectedRestaurante.nombre_Calle}, CP {selectedRestaurante.codigoPostal}
                  </span>
                  {selectedRestaurante.latitud != null && selectedRestaurante.longitud != null ? (
                    <MiniMap lat={selectedRestaurante.latitud} lng={selectedRestaurante.longitud} height={180} />
                  ) : (
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Este restaurante aún no tiene ubicación exacta registrada en el mapa.
                    </p>
                  )}
                </div>

                <div className="modal-detail-row"><Clock size={16} /><span><strong>Horario:</strong> {formatTime(selectedRestaurante.horarioAbierto)} - {formatTime(selectedRestaurante.horarioCerrado)}</span></div>
                <div className="modal-detail-row"><Phone size={16} /><span><strong>Teléfono:</strong> {selectedRestaurante.telefono?.toString() ?? 'N/A'}</span></div>
                <div className="modal-detail-row"><Mail size={16} /><span><strong>Email:</strong> {selectedRestaurante.email ?? 'N/A'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Restaurantes;