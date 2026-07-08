import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from "react-router-dom";
import { X, Info, Heart, MapPin, Clock, Phone, Star, Calendar } from "lucide-react";import colimaGeoData from "../data/colimaMunicipios.json";
import './InteractiveMap.css';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const BACKEND_URL = "https://tulima-backend.vercel.app";

// Íconos por tipo de servicio (emoji dentro de un pin de color)
const crearIcono = (emoji, color) => new L.DivIcon({
  html: `<div class="pin-servicio" style="background:${color}">${emoji}</div>`,
  className: 'icono-mapa-wrapper',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
});

const ICONOS_POR_TIPO = {
  hotel: crearIcono('🏨', '#00a8ff'),
  restaurante: crearIcono('🍽️', '#f97316'),
  tour: crearIcono('🚌', '#22c55e'),
  destino: crearIcono('🚩', '#a855f7'),
  evento: crearIcono('🎉', '#e11d48'),
};

const ETIQUETAS_TIPO = {
  hotel: 'Hotel',
  restaurante: 'Restaurante',
  tour: 'Tour',
  destino: 'Destino turístico',
  evento: 'Evento',
};

const formatHora = (t) => {
  if (!t) return null;
  return t.substring(11, 16);
};

const formatFecha = (f) => {
  if (!f) return null;
  return new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
};

export default function InteractiveMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useBodyScrollLock(isModalOpen);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [municipiosData, setMunicipiosData] = useState([]);
  const [topAmados, setTopAmados] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [puntosServicios, setPuntosServicios] = useState([]);

  // Referencia para guardar los datos sin perderlos en el evento del mapa
  const municipiosRef = useRef([]);
  const navigate = useNavigate();
const handleVerMas = (item) => {
  if (item.ruta === undefined || item.ruta === null || !item.id) return;
  handleCloseModal();
  const destino = item.ruta === '' ? '/' : `/${item.ruta}`;
  navigate(`${destino}?id=${item.id}`);
};
  useEffect(() => {
    fetch(`${BACKEND_URL}/municipios`)
      .then((res) => res.json())
      .then((data) => {
        setMunicipiosData(data);
        municipiosRef.current = data; // Guardamos los datos en la referencia
      })
      .catch((err) => console.warn("Backend no listo, usando datos locales", err));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/mapa/servicios`)
      .then((res) => res.json())
      .then((data) => setPuntosServicios(Array.isArray(data) ? data : []))
      .catch((err) => console.warn("No se pudieron cargar los puntos del mapa", err));
  }, []);

  const colimaCenter = [19.15, -103.8];
  const colimaBounds = [
    [18.35, -105.1],
    [19.95, -102.95]
  ];

  const estiloMunicipio = {
    fillColor: "#3b82f6",
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5
  };

  const onEachFeature = (feature, layer) => {
    const nombreReal = feature.properties.NAME_2 || "Municipio";

    if (nombreReal) {
      layer.bindTooltip(nombreReal, {
        permanent: true,
        direction: "center",
        className: "label-municipio"
      });
    }

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 0.8, fillColor: "#2563eb" });
      },
      mouseout: (e) => {
        e.target.setStyle(estiloMunicipio);
      },
      click: () => {
        // Usamos municipiosRef.current en lugar de municipiosData
        const info = municipiosRef.current.find(m => 
          m.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() 
          === 
          nombreReal.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        ) || {
          nombre: nombreReal,
          descripcion: `Descubre la magia de ${nombreReal} pronto...`,
          url_imagen: "https://estacionpacifico.com/wp-content/uploads/2018/11/LETRERO-COLIMA-1024x546.jpg",
        };

        setSelectedMunicipio(info);
        setTopAmados([]);
        setIsModalOpen(true);

        // Si tenemos el id del municipio, traemos los top amados
        if (info.id_municipio || info.id) {
          const municipioId = info.id_municipio || info.id;
          setLoadingTop(true);
          fetch(`${BACKEND_URL}/municipios/${municipioId}/top-amados`)
            .then(res => res.json())
            .then(data => {
              setTopAmados(Array.isArray(data) ? data : []);
            })
            .catch(() => setTopAmados([]))
            .finally(() => setLoadingTop(false));
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMunicipio(null);
      setTopAmados([]);
    }, 200);
  };

  return (
    <section id="mapa" className="map-section">
      <div className="map-container">
        <div style={{ height: "550px", width: "100%", borderRadius: "15px", overflow: "hidden" }}>
          <MapContainer
            center={colimaCenter}
            zoom={9}
            minZoom={10}
            maxBounds={colimaBounds}
            maxBoundsViscosity={1.0}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={colimaGeoData}
              style={estiloMunicipio}
              onEachFeature={onEachFeature}
            />

            {puntosServicios.map(p => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={ICONOS_POR_TIPO[p.tipo] || ICONOS_POR_TIPO.destino}
              >
               <Popup minWidth={220} maxWidth={260}>
                  <div style={{ minWidth: 200 }}>
                    {p.imagen && (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}

                    <strong style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>{p.nombre}</strong>

                    <span style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>
                      {ETIQUETAS_TIPO[p.tipo] || 'Servicio'}{p.subtipo ? ` · ${p.subtipo}` : ''}
                    </span>

                    {p.tipo === 'hotel' && p.estrellas ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        {Array.from({ length: p.estrellas }).map((_, i) => (
                          <Star key={i} size={12} color="#f59e0b" fill="#f59e0b" />
                        ))}
                      </div>
                    ) : null}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#444' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={13} color="#666" />
                        <span>{p.municipio}{p.direccion ? ` · ${p.direccion}` : ''}</span>
                      </div>

                      {(p.horarioAbierto || p.horarioCerrado) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={13} color="#666" />
                          <span>{formatHora(p.horarioAbierto) || '¿?'} - {formatHora(p.horarioCerrado) || '¿?'}</span>
                        </div>
                      )}

                      {p.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Phone size={13} color="#666" />
                          <span>{p.telefono}</span>
                        </div>
                      )}

                      {(p.fechaInicio || p.fechaTermino) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Calendar size={13} color="#666" />
                          <span>{formatFecha(p.fechaInicio)} - {formatFecha(p.fechaTermino)}</span>
                        </div>
                      )}

                      {p.descripcion && (
                        <p style={{ margin: '4px 0 0', color: '#555' }}>
                          {p.descripcion.length > 90 ? `${p.descripcion.slice(0, 90)}...` : p.descripcion}
                        </p>
                      )}
                      <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        marginTop: 8,
                        padding: '7px 10px',
                        background: '#0ea5e9',
                        color: '#fff',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <MapPin size={13} color="#fff" />
                      Cómo llegar
                    </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {isModalOpen && selectedMunicipio && (
        <div className="map-modal-overlay" onClick={handleCloseModal}>
          <div className="map-modal-card" onClick={(e) => e.stopPropagation()}>

            {/* Hero con imagen del municipio */}
            <div className="map-modal-hero">
              <img
                src={selectedMunicipio.url_imagen}
                alt={`Imagen de ${selectedMunicipio.nombre}`}
                className="map-modal-img"
                onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Sin+Imagen" }}
              />
              <div className="map-modal-gradient"></div>
              <h2 className="map-modal-title">{selectedMunicipio.nombre}</h2>
              <button className="map-modal-close" onClick={handleCloseModal} aria-label="Cerrar modal">
                <X className="map-modal-close-icon" />
              </button>
            </div>

            <div className="map-modal-body">
              {/* Descripción */}
              <div className="map-modal-desc-row">
                <Info className="map-modal-icon" />
                <p className="map-modal-desc-text">
                  {selectedMunicipio.descripcion}
                </p>
              </div>

              {/* Sección de más amados */}
              <div className="map-modal-top-amados">
                <h3 className="map-modal-tags-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} color="#e11d48" fill="#e11d48" />
                  Más queridos en {selectedMunicipio.nombre}
                </h3>

                {loadingTop && (
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
                    Cargando los favoritos...
                  </p>
                )}

                {!loadingTop && topAmados.length === 0 && (
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
                    Aún no hay favoritos registrados en este municipio.
                  </p>
                )}

                {!loadingTop && topAmados.length > 0 && (
                  <div className="top-amados-lista">
                    {topAmados.map((item, idx) => (
                      <div key={idx} className="top-amados-item">
                        <img
                          src={item.imagen || "https://placehold.co/60x60?text=?"}
                          alt={item.nombre}
                          className="top-amados-img"
                          onError={(e) => { e.target.src = "https://placehold.co/60x60?text=?" }}
                        />
                        <div className="top-amados-info">
                          <span className="top-amados-tipo">{item.tipo}</span>
                          <div className="top-amados-nombre-row">
                            <span className="top-amados-nombre">{item.nombre}</span>
                            {item.ruta !== undefined && item.ruta !== null && item.id && (
                              <button
                                className="top-amados-vermas"
                                onClick={() => handleVerMas(item)}
                              >
                                Ver más
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="top-amados-corazones">
                          <Heart size={14} color="#e11d48" fill="#e11d48" />
                          <span>{item.corazones}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* <div className="map-legend">
        <div className="map-legend-item">
          <div className="map-legend-color map-legend-color--primary"></div>
          <span>Municipios de Colima</span>
        </div>
      </div> */}
    </section>
  );
}