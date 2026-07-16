import { useState } from 'react';
import axios from 'axios';

const BASE = 'https://tulima-backend.vercel.app';

export default function CompletarPerfil({ onCompletado }) {
  const [form, setForm] = useState({ telefono: '', genero: '', edad: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      const { data: csrf } = await axios.get(`${BASE}/api/csrf-token`, { withCredentials: true });
      await axios.put(
        `${BASE}/usuario/completar-perfil`,
        {
          telefono: form.telefono || undefined,
          genero: form.genero || undefined,
          edad: form.edad ? Number(form.edad) : undefined,
        },
        {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrf.csrfToken }
        }
      );
      onCompletado(true);
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleOmitir = () => onCompletado(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Completa tu perfil</h2>
        <p className="text-sm text-gray-500 mb-6">
          Solo falta un poco más de información para personalizar tu experiencia.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              placeholder="Ej. 3121234567"
              value={form.telefono}
              onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select
              value={form.genero}
              onChange={e => setForm(p => ({ ...p, genero: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
            <input
              type="number"
              placeholder="Ej. 25"
              min="1"
              max="120"
              value={form.edad}
              onChange={e => setForm(p => ({ ...p, edad: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={handleOmitir}
              className="flex-1 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-md transition-colors"
            >
              Omitir por ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}