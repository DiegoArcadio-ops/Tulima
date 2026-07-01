import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { X, Info, Heart } from "lucide-react";
import colimaGeoData from "../data/colimaMunicipios.json";
import './InteractiveMap.css';

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
  tour: crearIcono('🧭', '#22c55e'),
  destino: crearIcono('📍', '#a855f7'),
  evento: crearIcono('🎉', '#e11d48'),
};

const ETIQUETAS_TIPO = {
  hotel: 'Hotel',
  restaurante: 'Restaurante',
  tour: 'Tour',
  destino: 'Destino turístico',
  evento: 'Evento',
};

export default function InteractiveMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [municipiosData, setMunicipiosData] = useState([]);
  const [topAmados, setTopAmados] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [puntosServicios, setPuntosServicios] = useState([]);

  // Referencia para guardar los datos sin perderlos en el evento del mapa
  const municipiosRef = useRef([]);

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
    [18.6, -104.8],
    [19.6, -103.3]
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
                <Popup>
                  <div style={{ minWidth: 140 }}>
                    {p.imagen && (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <strong style={{ display: 'block', fontSize: 13 }}>{p.nombre}</strong>
                    <span style={{ fontSize: 12, color: '#888' }}>
                      {ETIQUETAS_TIPO[p.tipo] || 'Servicio'} · {p.municipio}
                    </span>
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
                          <span className="top-amados-nombre">{item.nombre}</span>
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

              <button className="map-modal-btn">
                Explorar {selectedMunicipio.nombre}
              </button>
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