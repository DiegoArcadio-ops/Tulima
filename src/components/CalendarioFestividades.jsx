import { useState } from 'react';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function CalendarioFestividades({ tradiciones }) {
  const [mesActivo, setMesActivo] = useState(new Date().getMonth());

  // Usa el campo meses[] directamente, sin parsear strings
  const eventosMes = tradiciones.filter(t => t.meses.includes(mesActivo));

  return (
    <div className="cal-root">
      <div className="cal-meses">
        {MESES.map((m, i) => {
          const tieneEventos = tradiciones.some(t => t.meses.includes(i));
          return (
            <button
              key={m}
              className={`cal-mes ${mesActivo === i ? 'cal-mes--active' : ''} ${tieneEventos ? 'cal-mes--con-eventos' : ''}`}
              onClick={() => setMesActivo(i)}
            >
              <span className="cal-mes__nombre">{m.slice(0, 3)}</span>
              {tieneEventos && <span className="cal-mes__dot" />}
            </button>
          );
        })}
      </div>

      <div className="cal-panel">
        <h3 className="cal-panel__titulo">{MESES[mesActivo]}</h3>
        {eventosMes.length === 0 ? (
          <div className="cal-panel__vacio">
            <span className="cal-panel__vacio-emoji">🗓️</span>
            <p>No hay festividades registradas en {MESES[mesActivo]}.</p>
          </div>
        ) : (
          <div className="cal-eventos">
            {eventosMes.map((t) => (
              <div key={t.titulo} className="cal-evento">
                <div className="cal-evento__icon">{t.icon}</div>
                <div className="cal-evento__body">
                  <div className="cal-evento__header">
                    <h4 className="cal-evento__titulo">{t.titulo}</h4>
                    <span className="cal-evento__lugar">📍 {t.lugar}</span>
                  </div>
                  <p className="cal-evento__desc">{t.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}