import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, onSnapshot, doc, setDoc, query, orderBy } from 'firebase/firestore'
import { LayoutGrid, List, Info, CheckCircle2, Circle, DollarSign, Wallet, Users } from 'lucide-react'

// Configuración de Firebase (Extraída de la web original)
const firebaseConfig = {
  apiKey: "AIzaSyCQhdBVPyMJwlj2eKSX83PP2pKIJr9gWqU",
  authDomain: "gran-rifa-500.firebaseapp.com",
  projectId: "gran-rifa-500",
  storageBucket: "gran-rifa-500.firebasestorage.app",
  messagingSenderId: "408417055109",
  appId: "1:408417055109:web:775d73659f4f9e5daed4ec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [view, setView] = useState('grid'); // 'grid' o 'list'
  const [tickets, setTickets] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editName, setEditName] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // Escuchar cambios en Firestore
  useEffect(() => {
    const q = query(collection(db, "boletos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = {};
      querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
      setTickets(data);
    });
    return () => unsubscribe();
  }, []);

  const handleTicketClick = (num) => {
    const id = num.toString().padStart(2, '0');
    const existing = tickets[id] || { nombre: '', pagado: false };
    setSelectedTicket(id);
    setEditName(existing.nombre);
    setIsPaid(existing.pagado);
  };

  const handleSave = async () => {
    if (!selectedTicket) return;
    await setDoc(doc(db, "boletos", selectedTicket), {
      nombre: editName,
      pagado: isPaid,
      numero: selectedTicket
    });
    setSelectedTicket(null);
  };

  const soldCount = Object.keys(tickets).length;
  const paidCount = Object.values(tickets).filter(t => t.pagado).length;
  const pendingCount = soldCount - paidCount;

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-700 mb-2">Gran Rifa 500€</h1>
        <p className="text-pink-600 font-medium">Gestión de Boletos en Tiempo Real</p>
      </header>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-pink-400 flex flex-col items-center">
          <Users className="text-pink-500 mb-1" size={20} />
          <span className="text-xs text-gray-500 uppercase font-bold">Vendidos</span>
          <span className="text-2xl font-black text-pink-700">{soldCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-green-400 flex flex-col items-center">
          <Wallet className="text-green-500 mb-1" size={20} />
          <span className="text-xs text-gray-500 uppercase font-bold">Cobrado</span>
          <span className="text-2xl font-black text-green-700">{paidCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-orange-400 flex flex-col items-center">
          <DollarSign className="text-orange-500 mb-1" size={20} />
          <span className="text-xs text-gray-500 uppercase font-bold">Pendiente</span>
          <span className="text-2xl font-black text-orange-700">{pendingCount}</span>
        </div>
      </div>

      {/* Controles de Vista */}
      <div className="flex justify-center gap-2 mb-6">
        <button 
          onClick={() => setView('grid')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${view === 'grid' ? 'bg-pink-600 text-white shadow-md' : 'bg-white text-pink-600'}`}
        >
          <LayoutGrid size={18} /> Modo Póster
        </button>
        <button 
          onClick={() => setView('list')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${view === 'list' ? 'bg-pink-600 text-white shadow-md' : 'bg-white text-pink-600'}`}
        >
          <List size={18} /> Modo Lista
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl">
        {view === 'grid' ? (
          <div className="ticket-grid">
            {Array.from({ length: 100 }, (_, i) => {
              const numStr = i.toString().padStart(2, '0');
              const ticket = tickets[numStr];
              let statusClass = "ticket-available";
              if (ticket) {
                statusClass = ticket.pagado ? "ticket-paid" : "ticket-sold";
              }
              return (
                <div 
                  key={numStr}
                  onClick={() => handleTicketClick(i)}
                  className={`ticket-cell ${statusClass}`}
                >
                  {numStr}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-pink-100">
            <table className="w-full text-left">
              <thead className="bg-pink-50 text-pink-700">
                <tr>
                  <th className="p-3 font-bold">Nº</th>
                  <th className="p-3 font-bold">Nombre</th>
                  <th className="p-3 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {Object.keys(tickets).sort().map(id => (
                  <tr key={id} onClick={() => handleTicketClick(parseInt(id))} className="cursor-pointer hover:bg-pink-50/50">
                    <td className="p-3 font-mono font-bold">{id}</td>
                    <td className="p-3">{tickets[id].nombre}</td>
                    <td className="p-3">
                      {tickets[id].pagado ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-md">
                          <CheckCircle2 size={14} /> Pagado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 font-bold text-sm bg-orange-50 px-2 py-1 rounded-md">
                          <Circle size={14} /> Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {Object.keys(tickets).length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-400">No hay boletos vendidos aún</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-black text-pink-700 mb-6 flex items-center gap-2">
              <Info className="text-pink-500" /> Boleto #{selectedTicket}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-1 ml-1">Nombre del Comprador</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-500 outline-none transition font-medium"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-pink-50 cursor-pointer hover:bg-pink-50 transition">
                <input 
                  type="checkbox" 
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="font-bold text-gray-700">Ya está pagado</span>
              </label>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-black shadow-lg shadow-pink-200 hover:bg-pink-700 active:scale-95 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-pink-400 text-sm font-medium pb-8">
        &copy; 2024 Gran Rifa 500€ - Panel Administrativo
      </footer>
    </div>
  )
}

export default App
