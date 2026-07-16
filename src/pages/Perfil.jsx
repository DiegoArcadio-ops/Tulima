import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Lock, Heart, Shield, Edit3, Hotel, UtensilsCrossed, Bike, MapPin, Eye, EyeOff, CheckCircle, AlertCircle, Search } from 'lucide-react';import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Perfil.css';

const API = 'https://tulima-backend.vercel.app';

const TABS = [
  { id: 'datos',     label: 'Mis datos',      icon: User },
  { id: 'editar',    label: 'Editar perfil',   icon: Edit3 },
  { id: 'favoritos', label: 'Mis favoritos',   icon: Heart },
  { id: 'seguridad', label: 'Seguridad',       icon: Shield },
];

const FILTROS_FAV = [
  { id: 'todos',       label: 'Todos' },
  { id: 'hotel',       label: 'Hoteles',      icon: Hotel },
  { id: 'restaurante', label: 'Restaurantes', icon: UtensilsCrossed },
  { id: 'tour',        label: 'Tours',        icon: Bike },
  { id: 'destino',     label: 'Destinos',     icon: MapPin },
  { id: 'evento',      label: 'Eventos',      icon: Calendar },
];

export default function Perfil() {
  const navigate = useNavigate();

  const [tabActiva, setTabActiva] = useState('datos');
  const [perfil, setPerfil]       = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [csrfToken, setCsrfToken] = useState(null);
  const [cargando, setCargando]   = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito]         = useState('');
  const [error, setError]         = useState('');
  const { usuario, isLoading: authCargando } = useAuth();

  // Filtros favoritos
  const [filtroTipo, setFiltroTipo]   = useState('todos');
  const [filtroBusq, setFiltroBusq]   = useState('');

  // Form editar
  const [form, setForm] = useState({
    nombreUsuario: '', telefono: '', edad: '',
    contraseñaActual: '', contraseña: '', confirmarContraseña: ''
  });
  const [verPass, setVerPass] = useState(false);

  useEffect(() => {
    if (authCargando) return; // esperar a que AuthContext confirme la sesión
    if (!usuario) { navigate('/login'); return; }
    cargarDatos();
  }, [usuario, authCargando]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [perfilRes, favRes, csrfRes] = await Promise.all([
        axios.get(`${API}/usuarios/${usuario.id_usuario}`, { withCredentials: true }),
        axios.get(`${API}/favoritos`, { withCredentials: true }),
        axios.get(`${API}/api/csrf-token`, { withCredentials: true }),
      ]);
      setPerfil(perfilRes.data);
      setFavoritos(favRes.data);
      setCsrfToken(csrfRes.data.csrfToken);
      setForm(prev => ({
        ...prev,
        nombreUsuario: perfilRes.data.nombreUsuario || '',
        telefono:      perfilRes.data.telefono      || '',
        edad:          perfilRes.data.edad          || '',
      }));
    } catch {
      setError('No se pudo cargar el perfil.');
    } finally {
      setCargando(false);
    }
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (form.contraseña && !form.contraseñaActual) {
      setError('Debes ingresar tu contraseña actual para cambiarla.'); return;
    }
    if (form.contraseña && form.contraseña !== form.confirmarContraseña) {
      setError('Las contraseñas nuevas no coinciden.'); return;
    }
    setGuardando(true); setError(''); setExito('');
    try {
      const token = csrfToken
        ?? (await axios.get(`${API}/api/csrf-token`, { withCredentials: true })).data.csrfToken;
      const payload = {
        nombreUsuario: form.nombreUsuario,
        telefono:      form.telefono || undefined,
        edad:          form.edad ? parseInt(form.edad) : undefined,
      };
      if (form.contraseña) {
        payload.contraseñaActual = form.contraseñaActual;
        payload.contraseña = form.contraseña;
      }

      await axios.put(`${API}/usuarios/${usuario.id_usuario}`, payload, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': token },
      });
      setExito('¡Perfil actualizado correctamente!');
      setForm(prev => ({ ...prev, contraseñaActual: '', contraseña: '', confirmarContraseña: '' }));
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  // Cálculos
  const iniciales = perfil
    ? `${perfil.primerNombre?.[0] || ''}${perfil.apellidoPaterno?.[0] || ''}`.toUpperCase()
    : '?';

  const nombreCompleto = perfil
    ? [perfil.primerNombre, perfil.segundoNombre, perfil.apellidoPaterno, perfil.apellidoMaterno]
        .filter(Boolean).join(' ')
    : '';

    const conteoFav = {
      hoteles:      favoritos.filter(f => f.id_hotel).length,
      restaurantes: favoritos.filter(f => f.id_restaurante).length,
      tours:        favoritos.filter(f => f.id_provedor_tour).length,
      destinos:     favoritos.filter(f => f.id_destino).length,
      eventos:      favoritos.filter(f => f.id_evento).length,
    };

  const favoritosFiltrados = favoritos.filter(fav => {
    const tipo = fav.id_hotel ? 'hotel'
               : fav.id_restaurante ? 'restaurante'
               : fav.id_provedor_tour ? 'tour'
               : fav.id_evento ? 'evento'
               : 'destino';
    if (filtroTipo !== 'todos' && tipo !== filtroTipo) return false;
    if (filtroBusq.trim()) {
      const mun = (
        fav.hotel?.municipio?.nombre || fav.restaurante?.municipio?.nombre ||
        fav.provedor_tour?.municipio?.nombre || fav.destino_turistico?.municipio?.nombre || fav.evento?.municipio?.nombre || ''
      ).toLowerCase();
      const nombre = (
        fav.hotel?.nombre_hotel || fav.restaurante?.nombre ||
        fav.provedor_tour?.nombre || fav.destino_turistico?.nombre || fav.evento?.nombre_Evento || ''
      ).toLowerCase();
      const q = filtroBusq.toLowerCase();
      if (!mun.includes(q) && !nombre.includes(q)) return false;
    }
    return true;
  });

  if (cargando) {
    return (
      <div className="perfil-loading">
        <div className="perfil-spinner" />
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      {/* ── BANNER HERO ── */}
      <div className="perfil-banner">
        <div className="perfil-banner-inner">
          <div className="perfil-avatar">{iniciales}</div>
          <div className="perfil-hero-info">
            <h1 className="perfil-hero-nombre">{nombreCompleto || 'Usuario'}</h1>
            <p className="perfil-hero-usuario">@{perfil?.nombreUsuario}</p>
            <span className={`perfil-badge ${perfil?.rol === 'admin' ? 'admin' : ''}`}>
              {perfil?.rol === 'admin' ? '⚡ Administrador' : '🌴 Viajero'}
            </span>
          </div>
          <div className="perfil-stats">
            <div className="perfil-stat">
              <span className="perfil-stat-num">{conteoFav.hoteles}</span>
              <span className="perfil-stat-label">Hoteles</span>
            </div>
            <div className="perfil-stat-divider" />
            <div className="perfil-stat">
              <span className="perfil-stat-num">{conteoFav.restaurantes}</span>
              <span className="perfil-stat-label">Restaurantes</span>
            </div>
            <div className="perfil-stat-divider" />
            <div className="perfil-stat">
              <span className="perfil-stat-num">{conteoFav.tours}</span>
              <span className="perfil-stat-label">Tours</span>
            </div>
            <div className="perfil-stat-divider" />
            <div className="perfil-stat">
              <span className="perfil-stat-num">{conteoFav.destinos}</span>
              <span className="perfil-stat-label">Destinos</span>
            </div>
            <div className="perfil-stat-divider" />
            <div className="perfil-stat">
              <span className="perfil-stat-num">{conteoFav.eventos}</span>
              <span className="perfil-stat-label">Eventos</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="perfil-tabs-wrapper">
        <div className="perfil-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`perfil-tab ${tabActiva === id ? 'activa' : ''}`}
              onClick={() => { setTabActiva(id); setExito(''); setError(''); }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="perfil-contenido">

        {/* ─── TAB: DATOS ─── */}
        {tabActiva === 'datos' && perfil && (
          <div className="perfil-card">
            <h2 className="perfil-card-titulo">Datos personales</h2>
            <div className="perfil-datos-grid">
              <DatoItem icon={User}     label="Nombre completo" valor={nombreCompleto || '—'} />
              <DatoItem icon={User}     label="Nombre de usuario" valor={`@${perfil.nombreUsuario}`} />
              <DatoItem icon={Phone}    label="Teléfono"  valor={perfil.telefono || 'No registrado'} />
              <DatoItem icon={Calendar} label="Edad"      valor={perfil.edad ? `${perfil.edad} años` : 'No registrada'} />
              <DatoItem icon={Mail}     label="Correo"    valor={perfil.correo || 'Vinculado con Google'} />
            </div>
          </div>
        )}

        {/* ─── TAB: EDITAR ─── */}
        {tabActiva === 'editar' && (
          <div className="perfil-card">
            <h2 className="perfil-card-titulo">Editar perfil</h2>

            {exito && <Alerta tipo="exito"  texto={exito} />}
            {error && <Alerta tipo="error"  texto={error} />}

            <form className="perfil-form" onSubmit={guardarCambios}>
              <div className="perfil-form-seccion">
                <h3 className="perfil-form-sub">Información de cuenta</h3>
                <Campo
                  label="Nombre de usuario"
                  icon={User}
                  type="text"
                  value={form.nombreUsuario}
                  onChange={v => setForm(p => ({ ...p, nombreUsuario: v }))}
                  maxLength={15}
                  hint="Máximo 15 caracteres, sin espacios"
                />
                <Campo
                  label="Teléfono"
                  icon={Phone}
                  type="tel"
                  value={form.telefono}
                  onChange={v => setForm(p => ({ ...p, telefono: v }))}
                  hint="Se guarda cifrado de forma segura"
                />
                <Campo
                  label="Edad"
                  icon={Calendar}
                  type="number"
                  value={form.edad}
                  onChange={v => setForm(p => ({ ...p, edad: v }))}
                  min={1} max={120}
                />
              </div>

              <div className="perfil-form-seccion">
                <h3 className="perfil-form-sub">Cambiar contraseña</h3>
                <p className="perfil-form-nota">Deja en blanco si no quieres cambiar tu contraseña.</p>
                <Campo
                  label="Contraseña actual"
                  icon={Lock}
                  type={verPass ? 'text' : 'password'}
                  value={form.contraseñaActual}
                  onChange={v => setForm(p => ({ ...p, contraseñaActual: v }))}
                  hint="Requerida solo si vas a cambiar tu contraseña"
                />
                <div className="perfil-campo-pass">
                  <Campo
                    label="Nueva contraseña"
                    icon={Lock}
                    type={verPass ? 'text' : 'password'}
                    value={form.contraseña}
                    onChange={v => setForm(p => ({ ...p, contraseña: v }))}
                    minLength={6}
                  />
                  <button type="button" className="perfil-pass-toggle" onClick={() => setVerPass(p => !p)}>
                    {verPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Campo
                  label="Confirmar contraseña"
                  icon={Lock}
                  type={verPass ? 'text' : 'password'}
                  value={form.confirmarContraseña}
                  onChange={v => setForm(p => ({ ...p, confirmarContraseña: v }))}
                />
              </div>

              <button type="submit" className="perfil-btn-guardar" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        )}

        {/* ─── TAB: FAVORITOS ─── */}
        {tabActiva === 'favoritos' && (
          <div className="perfil-card">
            <h2 className="perfil-card-titulo">Mis favoritos</h2>

            {/* Filtros */}
            <div className="perfil-fav-filtros">
              <div className="perfil-fav-tipos">
                {FILTROS_FAV.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className={`perfil-fav-chip ${filtroTipo === id ? 'activo' : ''}`}
                    onClick={() => setFiltroTipo(id)}
                  >
                    {Icon && <Icon size={14} />}
                    {label}
                  </button>
                ))}
              </div>
              <div className="perfil-fav-busqueda">
                <Search size={16} className="perfil-fav-busqueda-icon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o municipio..."
                  value={filtroBusq}
                  onChange={e => setFiltroBusq(e.target.value)}
                />
              </div>
            </div>

            {/* Grid de favoritos */}
            {favoritosFiltrados.length === 0 ? (
              <div className="perfil-fav-vacio">
                <Heart size={40} strokeWidth={1.5} />
                <p>No hay favoritos que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="perfil-fav-grid">
                {favoritosFiltrados.map(fav => <TarjetaFavorito key={fav.id_favorito} fav={fav} />)}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: SEGURIDAD ─── */}
        {tabActiva === 'seguridad' && perfil && (
          <div className="perfil-card">
            <h2 className="perfil-card-titulo">Seguridad y privacidad</h2>
            <div className="perfil-seg-grid">
              <ItemSeguridad
                icon={Shield}
                titulo="Autenticación en dos pasos (MFA)"
                desc={perfil.mfaEnabled ? 'Activa — tu cuenta tiene protección extra.' : 'Inactiva — te recomendamos activarla.'}
                estado={perfil.mfaEnabled ? 'activo' : 'inactivo'}
              />
              <ItemSeguridad
                icon={User}
                titulo="Cuenta vinculada con Google"
                desc={perfil.googleId ? 'Tu cuenta está vinculada con Google OAuth.' : 'Cuenta con contraseña local.'}
                estado={perfil.googleId ? 'activo' : 'neutral'}
              />
              <ItemSeguridad
                icon={Lock}
                titulo="Contraseña"
                desc={perfil.googleId && !perfil.contrase_a ? 'Accedes mediante Google, sin contraseña local.' : 'Protegida con cifrado bcrypt.'}
                estado="activo"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Subcomponentes ── */

function DatoItem({ icon: Icon, label, valor }) {
  return (
    <div className="perfil-dato">
      <div className="perfil-dato-icono"><Icon size={18} /></div>
      <div>
        <span className="perfil-dato-label">{label}</span>
        <span className="perfil-dato-valor">{valor}</span>
      </div>
    </div>
  );
}

function Campo({ label, icon: Icon, type, value, onChange, hint, ...rest }) {
  return (
    <div className="perfil-campo">
      <label className="perfil-campo-label">{label}</label>
      <div className="perfil-campo-input-wrap">
        <Icon size={16} className="perfil-campo-icon" />
        <input
          className="perfil-campo-input"
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          {...rest}
        />
      </div>
      {hint && <p className="perfil-campo-hint">{hint}</p>}
    </div>
  );
}

function Alerta({ tipo, texto }) {
  return (
    <div className={`perfil-alerta ${tipo}`}>
      {tipo === 'exito' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {texto}
    </div>
  );
}

function TarjetaFavorito({ fav }) {
  const esHotel  = !!fav.hotel;
  const esRest   = !!fav.restaurante;
  const esTour   = !!fav.provedor_tour;
  const esEvento = !!fav.evento;

  const nombre = fav.hotel?.nombre_hotel
    || fav.restaurante?.nombre
    || fav.provedor_tour?.nombre
    || fav.evento?.nombre_Evento
    || fav.destino_turistico?.nombre || '—';

  const municipio = fav.hotel?.municipio?.nombre
    || fav.restaurante?.municipio?.nombre
    || fav.provedor_tour?.municipio?.nombre
    || fav.evento?.municipio?.nombre
    || fav.destino_turistico?.municipio?.nombre || '';

  const imagen = fav.hotel?.imagen
    || fav.restaurante?.imagen
    || fav.provedor_tour?.imagen
    || fav.evento?.imagen
    || fav.destino_turistico?.imagen || null;

  const tipo = esHotel ? 'Hotel' : esRest ? 'Restaurante' : esTour ? 'Tour' : esEvento ? 'Evento' : 'Destino';
  const TipoIcon = esHotel ? Hotel : esRest ? UtensilsCrossed : esTour ? Bike : esEvento ? Calendar : MapPin;

  return (
    <div className="perfil-fav-card">
      <div className="perfil-fav-card-img">
        {imagen
          ? <img src={imagen} alt={nombre} />
          : <div className="perfil-fav-card-img-placeholder"><Heart size={28} /></div>
        }
        <span className="perfil-fav-card-tipo">
          {TipoIcon && <TipoIcon size={12} />} {tipo}
        </span>
      </div>
      <div className="perfil-fav-card-body">
        <p className="perfil-fav-card-nombre">{nombre}</p>
        {municipio && (
          <p className="perfil-fav-card-mun">
            <MapPin size={13} /> {municipio}
          </p>
        )}
      </div>
    </div>
  );
}

function ItemSeguridad({ icon: Icon, titulo, desc, estado }) {
  return (
    <div className="perfil-seg-item">
      <div className={`perfil-seg-icono ${estado}`}><Icon size={20} /></div>
      <div className="perfil-seg-info">
        <p className="perfil-seg-titulo">{titulo}</p>
        <p className="perfil-seg-desc">{desc}</p>
      </div>
      <span className={`perfil-seg-badge ${estado}`}>
        {estado === 'activo' ? '✓ Activo' : estado === 'inactivo' ? '✗ Inactivo' : 'Info'}
      </span>
    </div>
  );
}
