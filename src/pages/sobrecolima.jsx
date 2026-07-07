import React, { useState, useRef } from 'react';
import { MapPin, Calendar, Music, Utensils, Flame, Waves, TreePine, Star, Landmark, Ship, Coffee, BookOpen } from 'lucide-react';
import './sobrecolima.css';

const tradiciones = [
  {
    icon: <Music size={28} />,
    titulo: "La Danza de los Morenos",
    mes: "Febrero",
    descripcion:
      "Una de las danzas más representativas del estado. Hombres con trajes coloridos y máscaras desfilan entre música de banda, celebrando la mezcla de culturas que forman la identidad colimense. Su origen se remonta a la época colonial y sigue siendo uno de los espectáculos más esperados del carnaval.",
  },
  {
    icon: <Flame size={28} />,
    titulo: "Feria de Todos los Santos",
    mes: "Noviembre",
    descripcion:
      "La feria más importante de Colima, celebrada desde 1826. Se realiza en honor al Día de Muertos con altares monumentales, juegos mecánicos, artesanías, gastronomía típica y espectáculos culturales. Originalmente se llevaba a cabo en el Jardín Libertad (antigua Plaza de Armas) y hoy reúne a cientos de miles de visitantes.",
  },
  {
    icon: <Calendar size={28} />,
    titulo: "Procesión del Señor del Perdón",
    mes: "Enero",
    descripcion:
      "Peregrinación religiosa multitudinaria que recorre las calles de la capital cada 20 de enero, fecha que también conmemora la fundación de la ciudad en 1527. Reúne a miles de devotos en una de las expresiones de fe más antiguas y sentidas del occidente de México.",
  },
  {
    icon: <Coffee size={28} />,
    titulo: "Feria del Ponche, Pan y Café",
    mes: "Todo el año · Comala",
    descripcion:
      "En los portales de Comala, Pueblo Mágico, la tradición de las botanas gratuitas acompañadas de ponche de frutas con mezcal es una experiencia única. El ponche artesanal, el pan recién horneado y el café de altura de las laderas del volcán se combinan en una fiesta de sabores que ha convertido a Comala en destino obligado.",
  },
  {
    icon: <Utensils size={28} />,
    titulo: "Festival Gastronómico",
    mes: "Marzo",
    descripcion:
      "Celebración anual donde chefs locales y visitantes presentan lo mejor de la cocina colimense: tatemado de puerco, pozole, sopa de mariscos y el inconfundible ponche de tamarindo. Refleja el reconocimiento de la gastronomía colimense como patrimonio cultural del occidente de México.",
  },
  {
    icon: <BookOpen size={28} />,
    titulo: "Comala y Juan Rulfo",
    mes: "Patrimonio literario",
    descripcion:
      "Comala inspiró a Juan Rulfo para escribir 'Pedro Páramo', una de las novelas más importantes de la literatura latinoamericana. Hoy, una escultura de hierro del escritor sentado en una banca de la plaza central recibe a los visitantes. La conexión entre el pueblo real y el ficticio sigue atrayendo a lectores de todo el mundo.",
  },
];

const pilares = [
  {
    icon: <Waves size={22} />,
    titulo: "Manzanillo, capital mundial del pez vela",
    texto: "Puerto más importante del Pacífico mexicano y referente del deporte náutico. Su icónica escultura del pez vela en el malecón simboliza el campeonato mundial de pesca que lo hizo famoso. En expansión: para 2030 pasará de 452 a 2,300 hectáreas de zona portuaria.",
  },
  {
    icon: <Flame size={22} />,
    titulo: "Volcán de Fuego",
    texto: "A 3,860 metros sobre el nivel del mar, es uno de los volcanes más activos de América Latina con más de 40 erupciones registradas desde 1576. Comparte área natural protegida con el Nevado de Colima y define la identidad visual del estado.",
  },
  {
    icon: <TreePine size={22} />,
    titulo: "Sierra de Manantlán",
    texto: "Reserva de la Biosfera declarada por la UNESCO. Hogar del maíz silvestre (teocintle), especie ancestral de todos los maíces del mundo, y de cientos de especies endémicas del trópico seco mexicano.",
  },
  {
    icon: <Star size={22} />,
    titulo: "Artesanía de palma de Suchitlán",
    texto: "Técnica ancestral transmitida por generaciones en el pueblo de Suchitlán, Comala. Los artesanos elaboran sombreros, muebles, cestas y adornos de palma real que se exportan a todo el país.",
  },
  {
    icon: <Landmark size={22} />,
    titulo: "Centro histórico Barrio Mágico",
    texto: "La capital colimense tiene su centro histórico declarado Barrio Mágico. El Teatro Hidalgo (1879), el Mercado Porfiriano de estructura francesa, el Jardín Libertad con su quiosco traído de Bélgica en 1891 y las casonas coloniales conforman un conjunto arquitectónico único.",
  },
  {
    icon: <Ship size={22} />,
    titulo: "Cuyutlán y la Laguna Verde",
    texto: "El fenómeno de la ola verde de Cuyutlán, las salineras artesanales y el tortugario con recorridos ecológicos conforman una de las experiencias naturales más singulares del Pacífico mexicano.",
  },
];

const gastronomia = [
  { nombre: "Tatemado de puerco", emoji: "🍖", desc: "Cerdo cocido lentamente en chile ancho y especias. Platillo de fiesta por excelencia, heredado de la cocina indígena colimense y presente en cada celebración familiar." },
  { nombre: "Pozole colimense", emoji: "🥣", desc: "Versión local del clásico mexicano con maíz cacahuazintle y caldo de res o cerdo. Se sirve con orégano, tostadas y limón en puestos que abren desde el amanecer." },
  { nombre: "Sopa de mariscos", emoji: "🦐", desc: "Caldo rojo con camarón, almeja y pulpo recién salidos del Pacífico. Infaltable en Manzanillo, donde los mariscos llegan directo del puerto a la mesa." },
  { nombre: "Ponche de tamarindo", emoji: "🍹", desc: "Bebida artesanal de tamarindo colimense, dulce y refrescante, emblema del estado. El tamarindo de Tecomán es reconocido como el mejor de México." },
  { nombre: "Dulce de leche quemada", emoji: "🍮", desc: "Postre tradicional elaborado con leche de vaca y azúcar morena, cocinado lentamente en cazuela de barro. Parte de la rica tradición dulcera de la capital." },
  { nombre: "Enchiladas colimenses", emoji: "🌮", desc: "Tortillas bañadas en salsa de chile seco, rellenas de queso fresco local y cubiertas de crema. Se distinguen de otras versiones por el uso del chile colimense seco." },
  { nombre: "Café de Comala", emoji: "☕", desc: "Granos cultivados en las laderas del volcán a más de 1,000 metros de altura. El café de Comala tiene denominación de origen y es considerado uno de los mejores de México." },
  { nombre: "Bate de Comala", emoji: "🥤", desc: "Atole frío de semillas de chan (chía silvestre) con miel de piloncillo. Bebida prehispánica que sigue sirviéndose en los portales de Comala como parte de la tradición botanera." },
];

const municipios = [
  { nombre: "Colima", desc: "Capital del estado. Centro histórico Barrio Mágico, Teatro Hidalgo y Jardín Libertad.", emoji: "🏛️" },
  { nombre: "Manzanillo", desc: "Puerto más importante del Pacífico. Playas, pez vela y proyección logística nacional.", emoji: "⚓" },
  { nombre: "Comala", desc: "Pueblo Mágico y Pueblo Blanco. Inspiración de Pedro Páramo y capital cafetalera.", emoji: "☕" },
  { nombre: "Tecomán", desc: "Capital mundial del limón. Produce el 30% del limón mexicano y exporta a 40 países.", emoji: "🍋" },
  { nombre: "Villa de Álvarez", desc: "Zona metropolitana de la capital con gran desarrollo comercial y residencial.", emoji: "🏘️" },
  { nombre: "Armería", desc: "Playas de Cuyutlán, salineras artesanales, tortugario y la famosa ola verde.", emoji: "🌊" },
  { nombre: "Cuauhtémoc", desc: "Municipio agrícola entre el volcán y la capital, con paisajes y colonias de migrantes.", emoji: "🌾" },
  { nombre: "Coquimatlán", desc: "Zona bananera y cañera. Grutas y paisajes del trópico seco colimense.", emoji: "🍌" },
  { nombre: "Ixtlahuacán", desc: "Las Grutas de San Gabriel y el turismo de aventura en sus serranías.", emoji: "🗻" },
  { nombre: "Minatitlán", desc: "El municipio más pequeño, enclavado en la Sierra Madre con bosques de pino-encino.", emoji: "🌲" },
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
            <MapPin size={14} /> Occidente de México
          </span>
          <h1 className="sc-hero__title">
            Colima,<br />
            <span className="sc-hero__title--accent">pequeño en tierra,</span><br />
            infinito en alma
          </h1>
          <p className="sc-hero__sub">
            5,627 km² que concentran volcanes activos, playas del Pacífico, cocina
            de raíz y tradiciones que llevan siglos vivas. En 2024 recibió más de
            1.5 millones de visitantes, su mejor año turístico en la historia.
          </p>
          <div className="sc-hero__stats">
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">10</span>
              <span className="sc-hero__stat-label">Municipios</span>
            </div>
            <div className="sc-hero__stat-div" />
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">731K</span>
              <span className="sc-hero__stat-label">Habitantes</span>
            </div>
            <div className="sc-hero__stat-div" />
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">1523</span>
              <span className="sc-hero__stat-label">Año de fundación</span>
            </div>
            <div className="sc-hero__stat-div" />
            <div className="sc-hero__stat">
              <span className="sc-hero__stat-num">2014</span>
              <span className="sc-hero__stat-label">Capital Americana de la Cultura</span>
            </div>
          </div>
        </div>
        <div className="sc-hero__scroll"><span /></div>
      </section>

      {/* ── QUÉ ES COLIMA ────────────────────────────────────────── */}
      <section className="sc-que">
        <div className="sc-container sc-que__inner">
          <div className="sc-que__text">
            <p className="sc-section-eyebrow">El Estado</p>
            <h2 className="sc-section-title">¿Qué es Colima?</h2>
            <p className="sc-que__body">
              Colima es el estado más occidental de la región centro-occidente de México y, aunque ocupa apenas el <strong>0.3% del territorio nacional</strong>, es el noveno más densamente poblado. Su capital —que lleva el mismo nombre— es la <strong>segunda ciudad más antigua de México</strong>, fundada el 20 de enero de 1527 por Gonzalo de Sandoval, quien en 1523 había establecido el primer ayuntamiento del occidente de la Nueva España.
            </p>
            <p className="sc-que__body">
              En 2014 la ciudad de Colima fue nombrada <strong>Capital Americana de la Cultura</strong>, reconocimiento a cinco siglos de folclore, gastronomía y tradiciones vivas. Al norte, el imponente <strong>Volcán de Fuego</strong> a 3,860 metros sobre el nivel del mar marca el límite con Jalisco. Al sur, el océano Pacífico culmina en <strong>Manzanillo</strong>, el puerto de contenedores más importante del país, con proyección de convertirse en el más grande de Latinoamérica para 2030.
            </p>
            <p className="sc-que__body">
              Entre la montaña y el mar conviven cañones, bosques tropicales secos, campos de palma de coco y plantaciones de limón que han hecho de Tecomán la <strong>capital mundial del limón</strong>. Colima produce el 30% del limón mexicano y lo exporta a más de 40 países.
            </p>
            <p className="sc-que__body">
              <strong>Comala</strong>, su Pueblo Mágico más conocido, inspiró a Juan Rulfo para escribir <em>Pedro Páramo</em> (1955), considerada una de las cien mejores novelas de la lengua española. Sus portales blancos, el ponche con mezcal y el café de altura han convertido a este pueblo en destino literario y gastronómico de primer nivel.
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

     {/* ── HISTORIA ─────────────────────────────────────────────── */}
      <section className="sc-historia">
        <div className="sc-container sc-historia__inner">
          <div className="sc-historia__content">
            <p className="sc-section-eyebrow">Raíces</p>
            <h2 className="sc-section-title">Cinco siglos de historia</h2>
            <div className="sc-historia__timeline">
              <div className="sc-historia__item">
                <span className="sc-historia__año">2000 a.C.</span>
                <div className="sc-historia__dot" />
                <p className="sc-historia__desc">Primeras culturas prehispánicas se asientan en el territorio. Se desarrollan tradiciones cerámicas únicas como las figuras de perros xoloitzcuintle que hoy son símbolo del estado.</p>
              </div>
              <div className="sc-historia__item">
                <span className="sc-historia__año">1523</span>
                <div className="sc-historia__dot" />
                <p className="sc-historia__desc">Gonzalo de Sandoval funda la Villa de Colima, estableciendo el primer ayuntamiento del occidente de la Nueva España. En 1527 la villa se traslada a su ubicación actual.</p>
              </div>
              <div className="sc-historia__item">
                <span className="sc-historia__año">1533</span>
                <div className="sc-historia__dot" />
                <p className="sc-historia__desc">Hernando de Grijalva descubre el Archipiélago de Revillagigedo desde las costas colimenses. El puerto de Manzanillo se consolida como centro comercial y de defensa durante la colonia.</p>
              </div>
              <div className="sc-historia__item">
                <span className="sc-historia__año">1857</span>
                <div className="sc-historia__dot" />
                <p className="sc-historia__desc">La Constitución eleva a Colima a la categoría de Estado Libre y Soberano. Comienza la época de modernización porfiriana: telégrafo (1869), teléfono (1883), luz eléctrica (1906) y ferrocarril Manzanillo-Colima (1889).</p>
              </div>
              <div className="sc-historia__item">
                <span className="sc-historia__año">1940s</span>
                <div className="sc-historia__dot" />
                <p className="sc-historia__desc">Se abren al cultivo nuevas tierras en el valle de Tecomán, iniciando el ciclo del limón y las agroindustrias que hoy hacen de Colima el principal exportador mundial de limón persa.</p>
              </div>
              <div className="sc-historia__item">
                <span className="sc-historia__año">2014</span>
                <div className="sc-historia__dot" />
                <p className="sc-historia__desc">La ciudad de Colima es nombrada Capital Americana de la Cultura. En 2024 el estado recibe más de 1.5 millones de visitantes y registra una derrama turística superior a los 5,375 millones de pesos.</p>
              </div>
            </div>
          </div>

          <div className="sc-historia__image">
            <img
              src="La-palma-colima-2.jpg"
              alt="Monumento a las palmeras con el Volcán de Fuego al fondo"
              className="sc-historia__img"
            />
          </div>
        </div>
      </section>

      {/* ── LOS 10 MUNICIPIOS ────────────────────────────────────── */}
      <section className="sc-municipios">
        <div className="sc-container">
          <p className="sc-section-eyebrow sc-section-eyebrow--light">Territorio</p>
          <h2 className="sc-section-title sc-section-title--light">Los 10 municipios</h2>
          <p className="sc-municipios__intro">
            Cada municipio de Colima tiene una personalidad propia: desde el bullicio portuario de Manzanillo hasta la quietud cafetalera de Comala.
          </p>
          <div className="sc-municipios__grid">
            {municipios.map((m) => (
              <div key={m.nombre} className="sc-municipio">
                <span className="sc-municipio__emoji">{m.emoji}</span>
                <h3 className="sc-municipio__nombre">{m.nombre}</h3>
                <p className="sc-municipio__desc">{m.desc}</p>
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
            tradición culinaria que mezcla herencia prehispánica, colonial y contemporánea.
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

      {/* ── DATOS CURIOSOS ───────────────────────────────────────── */}
      <section className="sc-datos">
        <div className="sc-container">
          <p className="sc-section-eyebrow sc-section-eyebrow--light">¿Sabías que...?</p>
          <h2 className="sc-section-title sc-section-title--light">Colima en cifras</h2>
          <div className="sc-datos__grid">
            <div className="sc-dato">
              <span className="sc-dato__num">+40</span>
              <p className="sc-dato__label">erupciones del Volcán de Fuego desde 1576</p>
            </div>
            <div className="sc-dato">
              <span className="sc-dato__num">30%</span>
              <p className="sc-dato__label">del limón mexicano viene de Tecomán</p>
            </div>
            <div className="sc-dato">
              <span className="sc-dato__num">1.5M</span>
              <p className="sc-dato__label">visitantes en 2024, récord histórico</p>
            </div>
            <div className="sc-dato">
              <span className="sc-dato__num">$5,375M</span>
              <p className="sc-dato__label">pesos de derrama turística en 2024</p>
            </div>
            <div className="sc-dato">
              <span className="sc-dato__num">2,300 ha</span>
              <p className="sc-dato__label">expansión del puerto de Manzanillo para 2030</p>
            </div>
            <div className="sc-dato">
              <span className="sc-dato__num">500+</span>
              <p className="sc-dato__label">años de historia documentada en el estado</p>
            </div>
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