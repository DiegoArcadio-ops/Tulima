/**
 * Componente reutilizable de filtros de búsqueda
 * Props:
 *   busqueda, setBusqueda
 *   filtros: [{ key, value, setValue, opciones: [{value, label}], placeholder }]
 *   total: número de resultados
 *   labelEntidad: 'hotel', 'restaurante', etc.
 */
export default function FiltrosBusqueda({ busqueda, setBusqueda, filtros, total, labelEntidad, onLimpiar }) {
  const hayFiltros = busqueda || filtros.some(f => f.value);

  return (
    <div className="filtros-contenedor">
      <div className="filtros-fila">
        <div className="filtro-grupo filtro-busqueda">
          <input
            type="text"
            placeholder={`🔍 Buscar ${labelEntidad}...`}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="filtro-input"
          />
        </div>
        {filtros.map(f => (
          <div key={f.key} className="filtro-grupo">
            <select
              value={f.value}
              onChange={e => f.setValue(e.target.value)}
              className="filtro-select"
            >
              <option value="">{f.placeholder}</option>
              {f.opciones.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
        ))}
        {hayFiltros && (
          <button onClick={onLimpiar} className="filtro-limpiar">✕ Limpiar</button>
        )}
      </div>
      <p className="filtros-contador">
        {total} {labelEntidad}{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
