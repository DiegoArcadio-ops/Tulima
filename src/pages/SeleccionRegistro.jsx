import { useNavigate } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';

export default function SeleccionRegistro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full">

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-500">
            ¿Cómo deseas registrarte en Tulima?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <button
            onClick={() => navigate('/registro/usuario')}
            className="group flex flex-col items-center gap-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-8 text-center transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-base">Usuario</p>
              <p className="text-sm text-gray-500 mt-1">
                Explora destinos, guarda favoritos y planea tu viaje
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/registro-proveedor')}
            className="group flex flex-col items-center gap-4 bg-white border-2 border-gray-200 hover:border-slate-700 rounded-xl p-8 text-center transition-all hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Briefcase className="w-7 h-7 text-slate-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-base">Proveedor</p>
              <p className="text-sm text-gray-500 mt-1">
                Registra hoteles, restaurantes, tours, destinos o eventos
              </p>
            </div>
          </button>

        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </a>
        </p>

      </div>
    </div>
  );
}