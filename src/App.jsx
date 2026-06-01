import { useState, useEffect } from 'react'
import {
  Ticket, CalendarDays, DollarSign, User, Phone,
  CheckCircle2, XCircle, List, Camera, X, Check,
  AlertCircle, Loader2, Share2, Search
} from 'lucide-react'
import { db } from './firebase'
import {
  collection, doc, onSnapshot,
  setDoc, deleteDoc
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

// ─── Colección Firestore ─────────────────────────────────────────
const BOLETOS_COL = 'boletos'

const PRICE_PER_TICKET = 20

// ─── Componente principal ────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('poster')
  const [soldMap, setSoldMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [buyerName, setBuyerName] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const navigate = useNavigate()

  // ── Cargar datos en tiempo real desde Firestore ───────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, BOLETOS_COL), (snap) => {
      const data = {}
      snap.forEach(d => { data[Number(d.id)] = d.data() })
      setSoldMap(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // ── Abrir modal ──────────────────────────────────────────────
  const openModal = (num) => {
    const existing = soldMap[num]
    setModal(num)
    setBuyerName(existing?.buyer ?? '')
    setIsPaid(existing?.paid ?? false)
  }

  // ── Cerrar modal ─────────────────────────────────────────────
  const closeModal = () => {
    setModal(null)
    setBuyerName('')
    setIsPaid(false)
  }

  // ── Guardar venta en Firestore ────────────────────────────────
  const handleSave = async () => {
    if (!buyerName.trim()) return
    const data = { buyer: buyerName.trim().toUpperCase(), paid: isPaid }
    await setDoc(doc(db, BOLETOS_COL, String(modal)), data)
    closeModal()
  }

  // ── Liberar número en Firestore ───────────────────────────────
  const handleRelease = async () => {
    await deleteDoc(doc(db, BOLETOS_COL, String(modal)))
    closeModal()
  }

  // ── Estadísticas ─────────────────────────────────────────────
  const soldCount = Object.keys(soldMap).length
  const paidCount = Object.values(soldMap).filter(v => v.paid).length
  const pendingCount = soldCount - paidCount
  const totalCollected = paidCount * PRICE_PER_TICKET
  const totalExpected = soldCount * PRICE_PER_TICKET

  // ── Loading spinner ───────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pink-bg)', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} style={{ color: 'var(--pink-dark)', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--pink-dark)', fontWeight: 600 }}>Cargando datos...</p>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pink-bg)' }}>

      {/* ── Barra de controles (no aparece en el póster limpio) ── */}
      <div className="no-print" style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(196,79,111,0.1)',
            border: 'none',
            borderRadius: 20,
            padding: '8px 16px',
            cursor: 'pointer',
            color: 'var(--pink-dark)',
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Colombia
        </button>
        <div className="view-toggle">
          <button
            id="btn-vista-poster"
            className={view === 'poster' ? 'active' : ''}
            onClick={() => setView('poster')}
          >
            <Camera size={16} />
            Modo Póster
          </button>
          <button
            id="btn-vista-lista"
            className={view === 'lista' ? 'active' : ''}
            onClick={() => setView('lista')}
          >
            <List size={16} />
            Modo Lista
          </button>
        </div>
        <button
          id="btn-compartir-espana"
          onClick={() => {
            const url = `${window.location.origin}/ver/espana`
            navigator.clipboard.writeText(url)
            alert(`✅ Enlace copiado:\n${url}`)
          }}
          style={{
            background: 'rgba(196,79,111,0.12)',
            border: '1.5px solid rgba(196,79,111,0.25)',
            borderRadius: 20,
            padding: '8px 18px',
            cursor: 'pointer',
            color: 'var(--pink-dark)',
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Share2 size={14} /> Compartir enlace
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*                    VISTA PÓSTER                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      {view === 'poster' && (
        <div
          id="poster"
          style={{
            maxWidth: 480,
            margin: '0 auto 32px',
            background: 'linear-gradient(160deg, #fdf0f3 0%, #fce4ec 50%, #fdf0f3 100%)',
            borderRadius: 24,
            padding: '0 0 20px',
            boxShadow: '0 20px 60px rgba(196,79,111,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* ── FLORES GRANDES ESQUINAS ── */}
          <div style={{ position: 'relative', height: 100, pointerEvents: 'none', userSelect: 'none' }}>
            <span style={{ position: 'absolute', top: -14, left: -22, fontSize: 120, opacity: 0.45, lineHeight: 1, filter: 'hue-rotate(320deg) saturate(0.7)' }}>🌸</span>
            <span style={{ position: 'absolute', top: -14, right: -22, fontSize: 120, opacity: 0.45, lineHeight: 1, filter: 'hue-rotate(320deg) saturate(0.7)', transform: 'scaleX(-1)' }}>🌸</span>
          </div>
          <div style={{ padding: '0 20px' }}>

            {/* ── TÍTULO ── */}
            <h1
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(62px, 17vw, 82px)',
                letterSpacing: 6,
                textAlign: 'center',
                color: '#111',
                lineHeight: 1,
                marginBottom: 10,
                marginTop: -20,
              }}
            >
              GRAN RIFA
            </h1>

            {/* ── LOGO CUPONAZO ── */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <img
                src="/cuponazo.png"
                alt="Cuponazo"
                style={{
                  height: 60,
                  objectFit: 'contain',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 2px 8px rgba(200,0,0,0.2))',
                }}
              />
            </div>

            {/* ── BADGE ONCE ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'white',
                border: '1.5px solid #ddd',
                borderRadius: 10,
                padding: '7px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}>
                <img
                  src="/once.png"
                  alt="ONCE"
                  style={{ height: 28, objectFit: 'contain', display: 'block' }}
                />
                <span style={{ color: '#222', fontWeight: 700, fontSize: 14 }}>Cuponazo de la ONCE</span>
              </div>
            </div>

            {/* ── FILA DE DETALLES ── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontSize: 12,
              color: '#555',
              flexWrap: 'wrap',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>📅 Viernes 26 de junio</span>
              <span style={{ color: '#ccc' }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>🕐 21:25h</span>
              <span style={{ color: '#ccc' }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>🎲 2 últimos números</span>
            </div>

            {/* ── PREMIO ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
              {/* Línea decorativa PREMIO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center' }}>
                <div style={{ flex: 1, height: 1.5, background: 'rgba(196,79,111,0.35)', maxWidth: 70 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pink-dark)', letterSpacing: 5, textTransform: 'uppercase' }}>PREMIO</span>
                <div style={{ flex: 1, height: 1.5, background: 'rgba(196,79,111,0.35)', maxWidth: 70 }} />
              </div>
              {/* 500€ grande */}
              <p style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(52px, 14vw, 72px)',
                color: 'var(--pink-dark)',
                lineHeight: 1,
                textAlign: 'center',
                letterSpacing: 2,
                marginTop: -4,
              }}>
                500€
              </p>
            </div>

            {/* ── CUADRÍCULA DE NÚMEROS ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: 4,
              marginBottom: 18,
              background: 'rgba(255,255,255,0.5)',
              padding: 10,
              borderRadius: 14,
              border: '1px solid rgba(196,79,111,0.12)',
            }}>
              {Array.from({ length: 100 }, (_, i) => {
                const num = i
                const label = String(num).padStart(2, '0')
                const isSold = Boolean(soldMap[num])
                return (
                  <button
                    key={num}
                    id={`num-${label}`}
                    className={`number-cell${isSold ? ' sold' : ''}`}
                    onClick={() => openModal(num)}
                    title={isSold ? `Vendido a: ${soldMap[num].buyer}` : `Número ${label} disponible`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* ── INDICADOR VENDIDOS (en la cuadrícula) ── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 16,
              fontSize: 12,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: 'white', border: '1.5px solid rgba(196,79,111,0.2)', display: 'inline-block' }} />
                Disponible
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--pink-dark)', display: 'inline-block' }} />
                Vendido ({soldCount}/100)
              </span>
            </div>

            {/* ── INFO CARDS ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 16,
              padding: '12px 8px',
              background: 'rgba(255,255,255,0.55)',
              borderRadius: 14,
              border: '1px solid rgba(196,79,111,0.1)',
            }}>
              <InfoCard icon={<Ticket size={20} />} label="PRECIO" value="20€" />
              <InfoCard icon={<CalendarDays size={20} />} label="SORTEO" value="26 de junio" />
              <InfoCard icon={<DollarSign size={20} />} label="PAGO" value="Bizum o efectivo" valueSmall />
              <InfoCard icon={<User size={20} />} label="ORGANIZA" value="Juliana" />
            </div>

            {/* ── BARRA DE CONTACTO ── */}
            <div className="contact-bar">
              <Phone size={20} fill="white" stroke="white" />
              <span style={{ letterSpacing: 1, fontSize: 13, opacity: 0.85 }}>CONTACTO</span>
              <span style={{ fontSize: 18, letterSpacing: 2 }}>623 523 515</span>
            </div>
          </div>{/* end padding wrapper */}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*                    VISTA LISTA                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {view === 'lista' && (
        <div style={{ maxWidth: 700, margin: '0 auto 32px', padding: '0 16px' }}>

          {/* ── Resumen ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
            <StatCard
              label="Vendidos"
              value={`${soldCount}/100`}
              sub={`${100 - soldCount} disponibles`}
              color="var(--pink-dark)"
              icon={<Ticket size={20} />}
            />
            <StatCard
              label="Cobrado"
              value={`${totalCollected}€`}
              sub={`${paidCount} pagados`}
              color="#2e7d32"
              icon={<CheckCircle2 size={20} />}
            />
            <StatCard
              label="Pendiente"
              value={`${totalExpected - totalCollected}€`}
              sub={`${pendingCount} sin pagar`}
              color="#e65100"
              icon={<AlertCircle size={20} />}
            />
          </div>

          {/* ── Tabla de vendidos ── */}
          {soldCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#aaa' }}>
              <Ticket size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 16, fontWeight: 500 }}>Ningún número vendido aún</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Ve al Modo Póster y toca un número para registrar una venta</p>
            </div>
          ) : (
            <>
              {/* ── Buscador y Filtros ── */}
              <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Input de búsqueda */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar por comprador o número..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 14,
                      border: '1.5px solid rgba(196,79,111,0.15)',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      boxSizing: 'border-box',
                      background: 'white',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--pink-dark)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196,79,111,0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(196,79,111,0.15)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Filtros de estado */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setStatusFilter('todos')}
                    style={{
                      background: statusFilter === 'todos' ? 'var(--pink-dark)' : 'white',
                      color: statusFilter === 'todos' ? 'white' : '#666',
                      border: statusFilter === 'todos' ? 'none' : '1px solid #ddd',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Todos ({soldCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pagados')}
                    style={{
                      background: statusFilter === 'pagados' ? '#2e7d32' : 'white',
                      color: statusFilter === 'pagados' ? 'white' : '#666',
                      border: statusFilter === 'pagados' ? 'none' : '1px solid #ddd',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Pagados ({paidCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pendientes')}
                    style={{
                      background: statusFilter === 'pendientes' ? '#e65100' : 'white',
                      color: statusFilter === 'pendientes' ? 'white' : '#666',
                      border: statusFilter === 'pendientes' ? 'none' : '1px solid #ddd',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Pendientes ({pendingCount})
                  </button>
                </div>
              </div>

              {(() => {
                const filteredEntries = Object.entries(soldMap)
                  .filter(([num, data]) => {
                    // Filtrar por estado de pago
                    if (statusFilter === 'pagados' && !data.paid) return false
                    if (statusFilter === 'pendientes' && data.paid) return false

                    // Filtrar por término de búsqueda
                    const search = searchTerm.toLowerCase().trim()
                    if (!search) return true
                    const numStr = String(num).padStart(2, '0')
                    const buyer = (data.buyer || '').toLowerCase()
                    return numStr.includes(search) || buyer.includes(search)
                  })
                  .sort((a, b) => Number(a[0]) - Number(b[0]))

                if (filteredEntries.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#aaa', background: 'white', borderRadius: 20, border: '1px solid rgba(196,79,111,0.1)' }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>No se encontraron resultados</p>
                    </div>
                  )
                }

                return (
                  <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(196,79,111,0.1)' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Nº</th>
                          <th>Comprador</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map(([num, data]) => (
                          <tr key={num}>
                            <td>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 36,
                                height: 36,
                                background: 'linear-gradient(135deg, var(--pink-dark), var(--pink-darker))',
                                color: 'white',
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: 14,
                              }}>
                                {String(num).padStart(2, '0')}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{data.buyer}</td>
                            <td>
                              {/* Toca para cambiar entre Pagado / Pendiente */}
                              <button
                                id={`estado-${String(num).padStart(2, '0')}`}
                                onClick={() => setDoc(doc(db, BOLETOS_COL, String(num)), { ...data, paid: !data.paid })}
                                title={data.paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                <span className={`badge-paid ${data.paid ? 'yes' : 'no'}`}
                                  style={{ userSelect: 'none', transition: 'all 0.2s ease' }}
                                >
                                  {data.paid
                                    ? <><Check size={12} /> Pagado</>
                                    : <><AlertCircle size={12} /> Pendiente</>
                                  }
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })()}
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*                      MODAL                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      {modal !== null && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-card">

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 2 }}>
                  {soldMap[modal] ? 'Editar número' : 'Registrar venta'}
                </p>
                <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 32, color: 'var(--pink-dark)', letterSpacing: 2 }}>
                  Nº {String(modal).padStart(2, '0')}
                </h2>
              </div>
              <button
                id="modal-close"
                onClick={closeModal}
                style={{
                  background: 'rgba(196,79,111,0.08)',
                  border: 'none',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pink-dark)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,79,111,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(196,79,111,0.08)'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Input nombre */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>
                Nombre del comprador
              </label>
              <input
                id="input-nombre"
                className="rifa-input"
                type="text"
                placeholder="Escribe el nombre..."
                value={buyerName}
                onChange={e => setBuyerName(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            </div>

            {/* Checkbox pago */}
            <label
              htmlFor="check-pago"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
                cursor: 'pointer',
                padding: '12px 16px',
                background: 'rgba(252,228,236,0.4)',
                borderRadius: 12,
                border: '1.5px solid rgba(196,79,111,0.15)',
                transition: 'background 0.2s ease',
              }}
            >
              <input
                id="check-pago"
                type="checkbox"
                className="rifa-checkbox"
                checked={isPaid}
                onChange={e => setIsPaid(e.target.checked)}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>El pago ya está recibido</p>
                <p style={{ fontSize: 12, color: '#999', marginTop: 1 }}>
                  {isPaid ? '✅ Marcado como pagado' : 'Sin marcar aún'}
                </p>
              </div>
            </label>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                id="btn-guardar"
                className="btn-primary"
                onClick={handleSave}
                disabled={!buyerName.trim()}
                style={{ opacity: buyerName.trim() ? 1 : 0.5, cursor: buyerName.trim() ? 'pointer' : 'not-allowed' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Check size={18} /> Guardar Venta
                </span>
              </button>

              {soldMap[modal] && (
                <button
                  id="btn-liberar"
                  className="btn-danger"
                  onClick={handleRelease}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <XCircle size={16} /> Liberar Nº {String(modal).padStart(2, '0')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────

function InfoCard({ icon, label, value, valueSmall }) {
  return (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>
        {label}
      </p>
      <p style={{
        fontSize: valueSmall ? 10 : 12,
        fontWeight: 700,
        color: 'var(--text-main)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {value}
      </p>
    </div>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color: color, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>{sub}</p>
    </div>
  )
}
