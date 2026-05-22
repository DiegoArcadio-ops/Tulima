import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { X, MapPin } from "lucide-react";
import colimaGeoData from "../data/colimaMunicipios.json"; 
import './InteractiveMap.css';
const URL="http://localhost:8000/municipios"

export default function InteractiveMap() {
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [municipiosData, setMunicipiosData] = useState([]);

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setMunicipiosData(data))
      .catch((err) => console.warn("Backend no listo, usando datos locales"));
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
        const info = municipiosData.find(m => m.name === nombreReal) || {
          name: nombreReal,
          description: `Descubre la magia de ${nombreReal} pronto...`,
          image: "https://images.unsplash.com/photo-1596324121712-5bbc14482174?w=400",
          highlights: ["Turismo", "Cultura"]
        };
        setSelectedMunicipio(info);
      }
    });
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
    </section>
  );
}