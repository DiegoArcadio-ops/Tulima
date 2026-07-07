import { useState } from 'react';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Mapea cada tradición a sus meses
const mesDeEvento = (mes) => {
  const m = mes.toLowerCase();
  return MESES.filter((_, i) => {
    const nombre = MESES[i].toLowerCase();
    return m.includes(nombre);
  }).map((_, i) => i);
};

export default function CalendarioFestividades({ tradiciones }) {
  const [mesActivo, setMesActivo] = useState(new Date().getMonth());

  const eventosMes = tradiciones.filter(t => {
    const indices = mesDeEvento(t.mes);
    return indices.includes(mesActivo);
  });

  return (
    <div className="cal-root">

      {/* Selector de meses */}
      <div className="cal-meses">
        {MESES.map((m, i) => {
          const tieneEventos = tradiciones.some(t => mesDeEvento(t.mes).includes(i));
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

      {/* Panel del mes seleccionado */}
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