import React from 'react';
import { MapPin, LayoutDashboard, Map, Settings, Plus, Edit2, Trash2, MessageSquare } from 'lucide-react';

export default function TulimaAdminPanel() {
  const [destinos, setDestinos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/admin/destinos') // URLLL alnaa
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar la lista de destinos');
        }
        return response.json();
      })
      .then((data) => {
        setDestinos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hubo un problema al cargar el panel de admin:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <MapPin className="text-[#00a8ff] w-8 h-8" />
          <span className="text-2xl font-bold text-slate-800">Tulima</span>
          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-md ml-2">Admin</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 text-slate-600">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 hover:text-[#00a8ff] transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#00a8ff]/10 text-[#00a8ff] font-medium transition-colors">
            <Map className="w-5 h-5" />
            <span>Destinos</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 hover:text-[#00a8ff] transition-colors">
            <MapPin className="w-5 h-5" />
            <span>Municipios</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 hover:text-[#00a8ff] transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Chatbot Vireo</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Configuración</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          
          {/* Encabezado */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Destinos Destacados</h1>
              <p className="text-slate-500 mt-1">Gestiona los lugares que aparecen en la página principal.</p>
            </div>
            <button className="flex items-center gap-2 bg-[#00a8ff] hover:bg-[#0097e6] text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm shadow-[#00a8ff]/30">
              <Plus className="w-5 h-5" />
              Nuevo Destino
            </button>
          </header>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="px-6 py-4 font-medium">Nombre del Destino</th>
                  <th className="px-6 py-4 font-medium">Categoría</th>
                  <th className="px-6 py-4 font-medium">Ubicación</th>
                  <th className="px-6 py-4 font-medium">Calificación</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinos.map((destino) => (
                  <tr key={destino.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{destino.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                        {destino.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {destino.municipio}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <span className="text-yellow-400">★</span> {destino.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-[#00a8ff] hover:bg-[#00a8ff]/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}