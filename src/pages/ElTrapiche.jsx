import React from 'react';
import { MapPin, Landmark, BookOpen, Church, Calendar, Sparkles } from 'lucide-react';
import './ElTrapiche.css';

export default function ElTrapiche() {
  return (
    <main className="et-page">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="et-hero">
        <div className="et-hero__overlay" />
        <div className="et-hero__content">
          <span className="et-hero__eyebrow">
            <MapPin size={14} /> Municipio de Cuauhtémoc, Colima
          </span>
          <h1 className="et-hero__title">
            El Trapiche,<br />
            <span className="et-hero__title--accent">tradición, fe</span><br />
            y comunidad
          </h1>
          <p className="et-hero__sub">
            Una pequeña localidad colimense donde la historia de las antiguas
            haciendas azucareras convive con una de las fiestas patronales
            más queridas de la región.
          </p>
        </div>
        <div className="et-hero__scroll"><span /></div>
      </section>

      {/* ── RESUMEN ──────────────────────────────────────────────── */}
      <section className="et-resumen">
        <div className="et-container et-resumen__inner">
          <div className="et-resumen__text">
            <p className="et-section-eyebrow">Resumen</p>
            <h2 className="et-section-title">Un pueblo con identidad propia</h2>
            <p className="et-resumen__body">
              El Trapiche es una localidad perteneciente al municipio de
              Cuauhtémoc, en el estado de Colima. Su nombre hace honor a los
              antiguos trapiches: los molinos con los que, desde la época
              colonial, se extraía el jugo de la caña para producir azúcar y
              piloncillo, actividad que marcó por generaciones la vida
              económica de la región.
            </p>
            <p className="et-resumen__body">
              Hoy en día El Trapiche conserva ese espíritu de pueblo trabajador
              y unido, donde la vida gira en torno a la parroquia local, la
              plaza principal y las celebraciones que reúnen cada año a
              vecinos y visitantes de comunidades cercanas como Villa de
              Álvarez y la capital del estado.
            </p>
          </div>

          <div className="et-resumen__cards">
            <div className="et-resumen__card">
              <Landmark size={22} className="et-resumen__card-icon" />
              <h3>Origen</h3>
              <p>Su nombre proviene de los antiguos molinos de caña de azúcar de la época colonial.</p>
            </div>
            <div className="et-resumen__card">
              <Church size={22} className="et-resumen__card-icon" />
              <h3>Vida comunitaria</h3>
              <p>La parroquia y el jardín principal son el corazón social del pueblo.</p>
            </div>
            <div className="et-resumen__card">
              <Sparkles size={22} className="et-resumen__card-icon" />
              <h3>Tradición viva</h3>
              <p>Dos fiestas anuales mantienen unida a la comunidad y atraen visitantes de la región.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HISTORIA ─────────────────────────────────────────────── */}
      <section className="et-historia">
        <div className="et-container">
          <p className="et-section-eyebrow et-section-eyebrow--light">Raíces</p>
          <h2 className="et-section-title et-section-title--light">Historia de El Trapiche</h2>
          <div className="et-historia__body">
            <p>
              Durante la época colonial, la región de Cuauhtémoc formó parte de
              haciendas dedicadas al cultivo de la caña de azúcar. En estas
              propiedades se instalaban los trapiches: ingenios artesanales
              movidos por tracción animal o hidráulica que molían la caña para
              obtener su jugo, base del azúcar y el piloncillo que se
              comerciaban en toda la región. Con el paso del tiempo, el
              asentamiento de trabajadores y familias alrededor de estos
              ingenios dio origen al pueblo que hoy conocemos, y que conservó
              el nombre del oficio que le dio vida.
            </p>
            <p>
              Con el paso de las décadas, El Trapiche creció como una
              comunidad rural ligada al campo y a la vida parroquial. La
              devoción religiosa se convirtió en uno de los pilares de la
              identidad del pueblo, dando origen a celebraciones que se
              transmiten de generación en generación y que, hasta la
              actualidad, siguen marcando el calendario anual de la localidad.
            </p>
            <p>
              Actualmente, El Trapiche es reconocido dentro del municipio de
              Cuauhtémoc por la calidez de su gente y por conservar vivas sus
              tradiciones religiosas y populares, que cada año convocan a
              cabalgatas, música de banda, jaripeos y a la comunidad completa
              en torno a su parroquia.
            </p>
          </div>
        </div>
      </section>

      {/* ── EVENTOS ──────────────────────────────────────────────── */}
      <section className="et-eventos">
        <div className="et-container">
          <p className="et-section-eyebrow">Cultura viva</p>
          <h2 className="et-section-title">Las dos grandes fiestas del año</h2>
          <p className="et-eventos__intro">
            Cada año, El Trapiche vive dos celebraciones que reúnen a toda la
            comunidad y a visitantes de los municipios vecinos.
          </p>

          <div className="et-eventos__grid">
            <div className="et-evento-card">
              <div className="et-evento-card__mes">
                <Calendar size={18} />
                <span>Enero</span>
              </div>
              <h3 className="et-evento-card__titulo">Fiestas Patronales de la Virgen</h3>
              <p className="et-evento-card__desc">
                Cada mes de enero, El Trapiche celebra sus fiestas patronales
                en honor a la Virgen. La festividad incluye la tradicional
                entrada de la música, cabalgatas, jaripeos, música de banda y
                actividades religiosas que congregan a la comunidad y a
                visitantes de localidades cercanas durante varios días de
                fiesta.
              </p>
            </div>

            <div className="et-evento-card">
              <div className="et-evento-card__mes">
                <Calendar size={18} />
                <span>Mayo</span>
              </div>
              <h3 className="et-evento-card__titulo">Fiesta de la Hermita</h3>
              <p className="et-evento-card__desc">
                En mayo, el pueblo se reúne alrededor de la tradicional Fiesta
                de la Hermita, una celebración comunitaria que refuerza los
                lazos de fe y convivencia entre los habitantes de El Trapiche,
                combinando actividades religiosas con música y fiesta popular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CIERRE ───────────────────────────────────────────────── */}
      <section className="et-cierre">
        <div className="et-container et-cierre__inner">
          <BookOpen className="et-cierre__icon" />
          <h2 className="et-cierre__title">Descubre El Trapiche</h2>
          <p className="et-cierre__text">
            Un pueblo pequeño con una identidad grande, donde la historia de
            las antiguas haciendas azucareras sigue viva en cada fiesta
            patronal.
          </p>
          <a href="/" className="et-cierre__btn">
            Explorar más destinos
          </a>
        </div>
      </section>

    </main>
  );
}