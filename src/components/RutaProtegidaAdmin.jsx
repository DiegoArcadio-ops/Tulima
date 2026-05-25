import { Navigate } from 'react-router-dom';

export default function RutaProtegidaAdmin({ children }) {
  const usuarioGuardado = localStorage.getItem('usuarioTulima');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  if (!usuario) {
    return <Navigate to="/login" replace />; 
  }

  if (usuario.rol !== 'admin' && usuario.id_rol !== 1) {
    return <Navigate to="/" replace />; 
  }

  return children;
}