import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventosNuevo.css';

const API_URL = 'https://tulima-backend.vercel.app';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');

  // Paginación
  const PAGE_SIZE = 9;
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const cargarEventos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // FIX PRINCIPAL: usar axios con withCredentials en lugar de fetch
        const res = await axios.get(`${API_URL}/eventos`, { withCredentials: true });
        setEventos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        setError(err.response?.data?.error || err.message || 'Error al cargar los eventos');
      } finally {
        setIsLoading(false);
      }
    };
    cargarEventos();
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Valores únicos para filtros
  const tipos = [...new Set(eventos.map(e => e.tipoEvento).filter(Boolean))];
  const municipios = [...new Set(eventos.map(e => e.destino_turistico?.municipio?.nombre).filter(Boolean))];

  // Filtrado
  const eventosFiltrados = eventos.filter(ev => {
    const nombre = (ev.nombre_Evento || '').toLowerCase();
    const matchBusqueda = nombre.includes(busqueda.toLowerCase());
    const matchTipo = !filtroTipo || ev.tipoEvento === filtroTipo;
    const matchMunicipio = !filtroMunicipio || ev.destino_turistico?.municipio?.nombre === filtroMunicipio;
    return matchBusqueda && matchTipo && matchMunicipio;
  });

  // Paginación
  const totalPaginas = Math.ceil(eventosFiltrados.length / PAGE_SIZE);
  const eventosPagina = eventosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('');
    setFiltroMunicipio('');
    setPagina(1);
  };

  if (isLoading) return (
    <div className="eventos-seccion">
      <div className="eventos-loading">
        <div className="eventos-spinner"></div>
        <p>Cargando eventos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="eventos-seccion">
      <div className="eventos-error">
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()} className="eventos-btn-retry">
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="eventos-seccion">
      <h2 className="eventos-titulo">Eventos en Colima</h2>

      {/* FILTROS */}
      <div className="eventos-filtros">
        <div className="filtro-grupo">
          <input
            type="text"
            placeholder="🔍 Buscar evento..."
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            className="filtro-input"
          />
        </div>
        <div className="filtro-grupo">
          <select
            value={filtroTipo}
            onChange={e => { setFiltroTipo(e.target.value); setPagina(1); }}
            className="filtro-select"
          >
            <option value="">Tipo de evento</option>
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="filtro-grupo">
          <select
            value={filtroMunicipio}
            onChange={e => { setFiltroMunicipio(e.target.value); setPagina(1); }}
            className="filtro-select"
          >
            <option value="">Municipio</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {(busqueda || filtroTipo || filtroMunicipio) && (
          <button onClick={limpiarFiltros} className="filtro-limpiar">✕ Limpiar</button>
        )}
      </div>

      <p className="eventos-contador">
        {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} encontrado{eventosFiltrados.length !== 1 ? 's' : ''}
      </p>

      {eventosPagina.length === 0 ? (
        <p className="eventos-vacio">No hay eventos que coincidan con los filtros.</p>
      ) : (
        <div className="eventos-grid">
          {eventosPagina.map((evento) => (
            <div
              key={evento.id_evento}
              className="evento-card"
              onClick={() => setSelectedEvento(evento)}
              style={{ cursor: 'pointer' }}
            >
              <div className="evento-header">
                <span className="evento-tipo">{evento.tipoEvento ?? 'Evento'}</span>
                <span className="evento-categoria">{evento.categoria?.nombre}</span>
              </div>

              <div className="evento-info">
                <h3 className="evento-nombre">{evento.nombre_Evento}</h3>

                <div className="evento-fechas">
                  <div className="evento-fecha-item">
                    <strong>Inicio:</strong> {formatFecha(evento.fechaInicio)}
                  </div>
                  <div className="evento-fecha-item">
                    <strong>Fin:</strong> {formatFecha(evento.fechaTermino)}
                  </div>
                </div>

                <div className="evento-ubicacion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pin">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {evento.destino_turistico?.municipio?.nombre ?? 'Colima'}
                </div>

                {evento.disponibilidad && (
                  <div className="evento-disponibilidad">
                    🎟️ {evento.disponibilidad}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            className="paginacion-btn"
            disabled={pagina === 1}
            onClick={() => setPagina(p => p - 1)}
          >
            ‹ Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`paginacion-btn ${pagina === n ? 'activa' : ''}`}
              onClick={() => setPagina(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="paginacion-btn"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(p => p + 1)}
          >
            Siguiente ›
          </button>
        </div>
      )}

      {/* MODAL */}
      {selectedEvento && (
        <div className="modal-overlay" onClick={() => setSelectedEvento(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvento(null)}>✕</button>
            <div className="modal-body">
              <span className="evento-tipo">{selectedEvento.tipoEvento ?? 'Evento'}</span>
              <h2 className="modal-title">{selectedEvento.nombre_Evento}</h2>
              <div className="modal-details">
                <div className="modal-detail-row">
                  <strong>Categoría:</strong>
                  <span>{selectedEvento.categoria?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Municipio:</strong>
                  <span>{selectedEvento.destino_turistico?.municipio?.nombre ?? 'N/A'}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Dirección:</strong>
                  <span>{selectedEvento.numero_Calle} {selectedEvento.nombre_Calle}, CP {selectedEvento.codigoPostal}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Fecha inicio:</strong>
                  <span>{formatFecha(selectedEvento.fechaInicio)}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Fecha fin:</strong>
                  <span>{formatFecha(selectedEvento.fechaTermino)}</span>
                </div>
                <div className="modal-detail-row">
                  <strong>Disponibilidad:</strong>
                  <span>{selectedEvento.disponibilidad ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Eventos;
