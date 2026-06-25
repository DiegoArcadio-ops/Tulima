import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { X, MapPin, Info } from "lucide-react";
import colimaGeoData from "../data/colimaMunicipios.json"; 
import './InteractiveMap.css';
const URL="https://tulima-backend.vercel.app/municipios"

export default function InteractiveMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [municipiosData, setMunicipiosData] = useState([]);

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setMunicipiosData(data))
      .catch((err) => console.warn("Backend no listo, usando datos locales", err));
  }, []);

  const colimaCenter = [19.15, -103.8];
  
  const colimaBounds = [
    [18.6, -104.8], // Esquina inferior izquierda (Suroeste)
    [19.6, -103.3]  // Esquina superior derecha (Noreste)
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
        // El backend usa 'nombre' y el fallback 'name'
        const info = municipiosData.find(m => m.nombre === nombreReal) || {
          nombre: nombreReal,
          descripcion: `Descubre la magia de ${nombreReal} pronto...`,
          url_imagen: "https://images.unsplash.com/photo-1596324121712-5bbc14482174?w=400",
          highlights: ["Turismo", "Cultura"]
        };
        setSelectedMunicipio(info);
        setIsModalOpen(true);
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Pequeño delay para la animación de salida antes de limpiar los datos
    setTimeout(() => setSelectedMunicipio(null), 200);
  };

  return (
    <section className="map-section">
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
          </MapContainer>
        </div>
      </div>

      {isModalOpen && selectedMunicipio && (
        <div className="map-modal-overlay" onClick={handleCloseModal}>
          <div className="map-modal-card" onClick={(e) => e.stopPropagation()}>
            
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
              <div className="map-modal-desc-row">
                <Info className="map-modal-icon" />
                <p className="map-modal-desc-text">
                  {selectedMunicipio.descripcion}
                </p>
              </div>

              {/* {selectedMunicipio.highlights && (
                <div className="map-modal-tags-section">
                  <h3 className="map-modal-tags-title">Destacado</h3>
                  <div className="map-modal-tags-container">
                    {selectedMunicipio.highlights.map(tag => (
                      <span key={tag} className="map-modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )} */}

              <button className="map-modal-btn">
                Explorar {selectedMunicipio.nombre}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="map-legend">
        <div className="map-legend-item">
          <div className="map-legend-color map-legend-color--primary"></div>
          <span>Municipios de Colima</span>
        </div>
      </div>
    </section>
  );
}