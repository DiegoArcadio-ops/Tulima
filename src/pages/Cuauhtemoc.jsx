import React from 'react';
import { MapPin, Landmark, Church, Sparkles, Calendar, BookOpen } from 'lucide-react';
import './Cuauhtemoc.css';

export default function Cuauhtemoc() {
  return (
    <main className="cu-page">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="cu-hero">
        <div className="cu-hero__overlay" />
        <div className="cu-hero__content">
          <span className="cu-hero__eyebrow">
            <MapPin size={14} /> Municipio de Colima
          </span>
          <h1 className="cu-hero__title">
            Cuauhtémoc,<br />
            <span className="cu-hero__title--accent">raíces, fe</span><br />
            y tradición charra
          </h1>
          <p className="cu-hero__sub">
            Un municipio de campos verdes, campanarios centenarios y pueblos
            que guardan viva la historia de Colima a través de su gente,
            su fe y sus fiestas.
          </p>
        </div>
        <div className="cu-hero__scroll"><span /></div>
      </section>

      {/* ── RESUMEN ──────────────────────────────────────────────── */}
      <section className="cu-resumen">
        <div className="cu-container cu-resumen__inner">
          <div className="cu-resumen__text">
            <p className="cu-section-eyebrow">Resumen</p>
            <h2 className="cu-section-title">Un municipio de tradición agrícola y religiosa</h2>
            <p className="cu-resumen__body">
              Ubicado al norte del estado de Colima, Cuauhtémoc es un municipio
              cuya vida ha girado por generaciones en torno al campo, la fe y
              la convivencia comunitaria. Sus localidades, entre ellas
              Quesería, El Trapiche, Alcaraces, Buenavista, Minatitlán y
              Chiapa, conservan tradiciones que se transmiten de padres a
              hijos y que hoy siguen dando identidad a toda la región.
            </p>
            <p className="cu-resumen__body">
              El municipio es también reconocido por su gente cálida y
              hospitalaria, por sus parroquias que son el corazón social de
              cada pueblo, y por una agenda de fiestas patronales y eventos
              culturales que llenan de color el calendario cuauhtemense
              durante todo el año.
            </p>
          </div>

          <div className="cu-resumen__cards">
            <div className="cu-resumen__card">
              <Landmark size={22} className="cu-resumen__card-icon" />
              <h3>Tradición agrícola</h3>
              <p>El campo y la caña de azúcar marcaron la vida económica de sus pueblos desde la época colonial.</p>
            </div>
            <div className="cu-resumen__card">
              <Church size={22} className="cu-resumen__card-icon" />
              <h3>Vida comunitaria</h3>
              <p>Las parroquias y plazas principales son el punto de encuentro de cada localidad.</p>
            </div>
            <div className="cu-resumen__card">
              <Sparkles size={22} className="cu-resumen__card-icon" />
              <h3>Tradición viva</h3>
              <p>Fiestas patronales, jaripeos y charreadas que reúnen cada año a toda la comunidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HISTORIA ─────────────────────────────────────────────── */}
      <section className="cu-historia">
        <div className="cu-container">
          <p className="cu-section-eyebrow cu-section-eyebrow--light">Raíces</p>
          <h2 className="cu-section-title cu-section-title--light">Historia de Cuauhtémoc</h2>
          <div className="cu-historia__body">
            <p>
              El municipio de Cuauhtémoc, ubicado al norte del estado de
              Colima, debe su nombre al último emperador mexica, en homenaje
              a la resistencia indígena frente a la conquista. Durante la
              época colonial, la región formó parte de haciendas dedicadas
              principalmente al cultivo de la caña de azúcar, actividad que
              dio origen a varias de las localidades que hoy forman el
              municipio, entre ellas El Trapiche, cuyo nombre recuerda a los
              antiguos ingenios azucareros de la zona.
            </p>
            <p>
              Con el paso de los años, Cuauhtémoc se consolidó como un
              municipio de vocación agrícola y ganadera, donde la vida rural
              y la devoción religiosa moldearon la identidad de sus pueblos.
              La cercanía con la capital del estado y con Villa de Álvarez
              permitió que sus tradiciones se mantuvieran vivas mientras el
              municipio crecía poco a poco alrededor de sus parroquias y
              plazas principales.
            </p>
            <p>
              Hoy, Cuauhtémoc es reconocido dentro de Colima por conservar
              con orgullo su herencia rural, su fe y, de manera muy especial,
              por una de las tradiciones que más lo distingue en todo el
              estado: la fiesta charrotaurina que cada octubre convierte al
              municipio en punto de encuentro de la charrería colimense.
            </p>
          </div>
        </div>
      </section>

      {/* ── EVENTOS / CULTURA ────────────────────────────────────── */}
      <section className="cu-eventos">
        <div className="cu-container">
          <p className="cu-section-eyebrow">Cultura viva</p>
          <h2 className="cu-section-title">Fiestas y tradiciones del municipio</h2>
          <p className="cu-eventos__intro">
            La identidad de Cuauhtémoc se vive todo el año a través de sus
            fiestas patronales y, de manera muy especial, de su gran
            tradición charra.
          </p>

          <div className="cu-eventos__grid">
            <div className="cu-evento-card">
              <div className="cu-evento-card__mes">
                <Calendar size={18} />
                <span>Octubre</span>
              </div>
              <h3 className="cu-evento-card__titulo">Fiestas Charrotaurinas de Cuauhtémoc</h3>
              <p className="cu-evento-card__desc">
                Cada mes de octubre, el municipio se viste de gala con sus
                tradicionales fiestas charrotaurinas, uno de los eventos más
                esperados de la región. Charreadas, jaripeos, desfiles,
                música de banda y actividades familiares reúnen durante
                varios días a cuauhtemenses y visitantes de todo Colima,
                celebrando la charrería como parte fundamental de la
                identidad del municipio.
              </p>
            </div>

            <div className="cu-evento-card">
              <div className="cu-evento-card__mes">
                <Calendar size={18} />
                <span>Todo el año</span>
              </div>
              <h3 className="cu-evento-card__titulo">Fiestas patronales de sus localidades</h3>
              <p className="cu-evento-card__desc">
                Además de la fiesta charrotaurina, cada localidad del
                municipio —Quesería, El Trapiche, Alcaraces, Buenavista,
                Minatitlán y Chiapa— celebra su propia fiesta patronal a lo
                largo del año, con procesiones, cabalgatas y verbenas que
                mantienen unida a cada comunidad y fortalecen el sentido de
                pertenencia de su gente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CIERRE ───────────────────────────────────────────────── */}
      <section className="cu-cierre">
        <div className="cu-container cu-cierre__inner">
          <BookOpen className="cu-cierre__icon" />
          <h2 className="cu-cierre__title">Descubre Cuauhtémoc</h2>
          <p className="cu-cierre__text">
            Un municipio donde el campo, la fe y la charrería se entrelazan
            para dar vida a una de las tradiciones más queridas de Colima.
          </p>
          <a href="/" className="cu-cierre__btn">
            Explorar más destinos
          </a>
        </div>
      </section>

    </main>
  );
}