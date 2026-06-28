/**
 * Componente reutilizable de paginación
 */
export default function Paginacion({ pagina, totalPaginas, onChange }) {
  if (totalPaginas <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPaginas; i++) pages.push(i);

  return (
    <div className="paginacion">
      <button className="paginacion-btn" disabled={pagina === 1} onClick={() => onChange(pagina - 1)}>
        ‹ Anterior
      </button>
      {pages.map(n => (
        <button
          key={n}
          className={`paginacion-btn ${pagina === n ? 'activa' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button className="paginacion-btn" disabled={pagina === totalPaginas} onClick={() => onChange(pagina + 1)}>
        Siguiente ›
      </button>
    </div>
  );
}
