import React, { useState, useRef } from 'react';
import { MapPin, Calendar, Music, Utensils, Flame, Waves, TreePine, Star } from 'lucide-react';
import './sobrecolima.css';

const tradiciones = [
  {
    icon: <Music size={28} />,
    titulo: "La Danza de los Morenos",
    mes: "Febrero",
    descripcion:
      "Una de las danzas más representativas del estado. Hombres con trajes coloridos y máscaras desfilan entre música de banda, celebrando la mezcla de culturas que forman la identidad colimense.",
  },
  {
    icon: <Flame size={28} />,
    titulo: "Feria de Todos los Santos",
    mes: "Noviembre",
    descripcion:
      "La feria más importante de Colima. Se celebra en honor al Día de Muertos con altares monumentales, juegos mecánicos, artesanías, gastronomía típica y espectáculos culturales por toda la ciudad.",
  },
  {
    icon: <Calendar size={28} />,
    titulo: "Procesión del Señor del Perdón",
    mes: "Enero",
    descripcion:
      "Peregrinación religiosa multitudinaria que recorre las calles de la capital. Reúne a miles de devotos en una de las expresiones de fe más antiguas y sentidas del occidente de México.",
  },
  {
    icon: <Utensils size={28} />,
    titulo: "Festival Gastronómico",
    mes: "Marzo",
    descripcion:
      "Celebración anual donde chefs locales y visitantes presentan lo mejor de la cocina colimense: tatemado de puerco, pozole, sopa de mariscos y el inconfundible ponche de tamarindo.",
  },
];

const pilares = [
  {
    icon: <Waves size={22} />,
    titulo: "Playas de Manzanillo",
    texto: "Puerto más importante del Pacífico mexicano, con playas de aguas cálidas y un malecón lleno de vida.",
  },
  {
    icon: <Flame size={22} />,
    titulo: "Volcán de Fuego",
    texto: "Uno de los volcanes más activos de América Latina. Su silueta domina el horizonte y define la identidad del estado.",
  },
  {
    icon: <TreePine size={22} />,
    titulo: "Sierra Manantlán",
    texto: "Reserva de la Biosfera con una biodiversidad única, hogar del maíz silvestre y especies endémicas del trópico seco.",
  },
  {
    icon: <Star size={22} />,
    titulo: "Artesanía de palma",
    texto: "Técnica ancestral transmitida por generaciones. Los artesanos de Suchitlán elaboran sombreros, muebles y adornos de palma real.",
  },
];

const gastronomia = [
  { nombre: "Tatemado de puerco", emoji: "🍖", desc: "Cerdo cocido lentamente en chile ancho y especias. Platillo de fiesta por excelencia." },
  { nombre: "Pozole colimense", emoji: "🥣", desc: "Versión local del clásico mexicano, con maíz cacahuazintle y caldo de res o cerdo bien sazonado." },
  { nombre: "Sopa de mariscos", emoji: "🦐", desc: "Caldo rojo con camarón, almeja y pulpo recién salidos del Pacífico. Infaltable en Manzanillo." },
  { nombre: "Ponche de tamarindo", emoji: "🍹", desc: "Bebida artesanal de tamarindo colimense, dulce y refrescante, emblema del estado." },
  { nombre: "Dulce de leche quemada", emoji: "🍮", desc: "Postre tradicional elaborado con leche de vaca y azúcar morena, cocinado en cazuela de barro." },
  { nombre: "Enchiladas colimenses", emoji: "🌮", desc: "Tortillas bañadas en salsa de chile seco, rellenas de queso fresco local y cubiertas de crema." },
];

export default function SobreColima() {
  const [tradicionActiva, setTradicionActiva] = useState(0);
  const gastronomiaRef = useRef(null);

  return (
    <main className="sc-page">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="sc-hero">
        <div className="sc-hero__overlay" />
        <div className="sc-hero__content">
          <span className="sc-hero__eyebrow">
            <MapPin size={14} /> Estado de México
          </span>
          <h1 className="sc-hero__title">
            Colima,<br />
            <span className="sc-hero__title--accent">pequeño en tierra,</span><br />
            infinito en alma
          </h1>
          <p className="sc-hero__sub">
            5,627 km² que concentran volcanes activos, playas del Pacífico, cocina
            de raíz y tradiciones que llevan siglos vivas.
          </p>
          <div className="sc-hero__stats">
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">10</span>
              <span className="sc-hero__stat-label">Municipios</span>
            </div>
            <div className="sc-hero__stat-div" />
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">800K</span>
              <span className="sc-hero__stat-label">Habitantes</span>
            </div>
            <div className="sc-hero__stat-div" />
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">4°</span>
              <span className="sc-hero__stat-label">Estado más pequeño</span>
            </div>
          </div>
        </div>
        <div className="sc-hero__scroll">
          <span />
        </div>
      </section>

      {/* ── QUÉ ES COLIMA ────────────────────────────────────────── */}
      <section className="sc-que">
        <div className="sc-container sc-que__inner">
          <div className="sc-que__text">
            <p className="sc-section-eyebrow">El Estado</p>
            <h2 className="sc-section-title">¿Qué es Colima?</h2>
            <p className="sc-que__body">
              Colima es el estado más occidental de la región centro-occidente de México, y aunque
              ocupa apenas el <strong>0.3 % del territorio nacional</strong>, no tiene nada de
              pequeño en carácter. Su capital lleva el mismo nombre y es reconocida como una de
              las ciudades con mayor calidad de vida del país: tranquila, arbolada y orgullosa de
              su arquitectura porfiriana.
            </p>
            <p className="sc-que__body">
              Al norte, la Sierra Madre Occidental y el imponente <strong>Volcán de Colima</strong>
              —también llamado Volcán de Fuego— marcan el límite con Jalisco. Al sur, el océano
              Pacífico baña kilómetros de costa que culminan en <strong>Manzanillo</strong>, el
              puerto más importante para el comercio exterior del país. Entre la montaña y el mar,
              cañones, bosques tropicales secos y campos de palma de coco forman un paisaje que
              cambia radicalmente en pocos kilómetros.
            </p>
            <p className="sc-que__body">
              Su gente —los colimenses— mezclan la calidez del occidente mexicano con el ritmo
              pausado de quien sabe que vive en uno de los lugares más agraciados del país.
            </p>
          </div>
          <div className="sc-que__pillars">
            {pilares.map((p) => (
              <div key={p.titulo} className="sc-pilar">
                <div className="sc-pilar__icon">{p.icon}</div>
                <div>
                  <h3 className="sc-pilar__title">{p.titulo}</h3>
                  <p className="sc-pilar__text">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRADICIONES ──────────────────────────────────────────── */}
      <section className="sc-tradiciones">
        <div className="sc-container">
          <p className="sc-section-eyebrow sc-section-eyebrow--light">Cultura viva</p>
          <h2 className="sc-section-title sc-section-title--light">Tradiciones y festividades</h2>
          <p className="sc-tradiciones__intro">
            Colima celebra durante todo el año. Cada festividad conecta con raíces
            indígenas, coloniales y mestizas que conviven sin contradicción.
          </p>

          <div className="sc-tradiciones__layout">
            {/* Tabs */}
            <div className="sc-tradiciones__tabs">
              {tradiciones.map((t, i) => (
                <button
                  key={t.titulo}
                  className={`sc-tab ${tradicionActiva === i ? 'sc-tab--active' : ''}`}
                  onClick={() => setTradicionActiva(i)}
                >
                  <span className="sc-tab__icon">{t.icon}</span>
                  <span className="sc-tab__label">{t.titulo}</span>
                  <span className="sc-tab__mes">{t.mes}</span>
                </button>
              ))}
            </div>
            {/* Panel */}
            <div className="sc-tradiciones__panel">
              <div className="sc-tradiciones__panel-icon">
                {tradiciones[tradicionActiva].icon}
              </div>
              <span className="sc-tradiciones__panel-mes">
                {tradiciones[tradicionActiva].mes}
              </span>
              <h3 className="sc-tradiciones__panel-title">
                {tradiciones[tradicionActiva].titulo}
              </h3>
              <p className="sc-tradiciones__panel-desc">
                {tradiciones[tradicionActiva].descripcion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GASTRONOMÍA ──────────────────────────────────────────── */}
      <section className="sc-gastro" ref={gastronomiaRef}>
        <div className="sc-container">
          <p className="sc-section-eyebrow">Sabores del estado</p>
          <h2 className="sc-section-title">Gastronomía colimense</h2>
          <p className="sc-gastro__intro">
            La cocina de Colima es el puente entre la sierra y el mar. Los chiles secos,
            el coco, el tamarindo y los mariscos del Pacífico se dan la mano en una
            tradición culinaria reconocida en toda México.
          </p>
          <div className="sc-gastro__grid">
            {gastronomia.map((p) => (
              <div key={p.nombre} className="sc-platillo">
                <span className="sc-platillo__emoji">{p.emoji}</span>
                <h3 className="sc-platillo__nombre">{p.nombre}</h3>
                <p className="sc-platillo__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CIERRE ───────────────────────────────────────────────── */}
      <section className="sc-cierre">
        <div className="sc-container sc-cierre__inner">
          <Flame className="sc-cierre__icon" />
          <h2 className="sc-cierre__title">Colima te espera</h2>
          <p className="sc-cierre__text">
            Desde las laderas del volcán hasta la arena del Pacífico, cada rincón de
            Colima tiene algo que contarte. Empieza a explorar con Tulima.
          </p>
          <a href="/" className="sc-cierre__btn">
            Explorar destinos
          </a>
        </div>
      </section>

    </main>
  );
}
