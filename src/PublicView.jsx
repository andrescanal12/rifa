import { useState, useEffect } from 'react'
import { db } from './firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { Loader2, Eye } from 'lucide-react'
import Countdown from './Countdown'

// ─── Props: collection, title, subtitle, prize, date, contact, logo, priceLabel, organizer ───
export default function PublicView({
  collectionName,
  title,
  badgeText,
  prizeMain,
  prizeSub,
  date,
  targetDate, // Nueva prop para el cronómetro
  contact,
  logo,
  priceLabel,
  organizer,
  accentColor = 'var(--pink-dark)',
}) {
  const [soldMap, setSoldMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, collectionName), (snap) => {
      const data = {}
      snap.forEach(d => { data[Number(d.id)] = d.data() })
      setSoldMap(data)
      setLoading(false)
    })
    return () => unsub()
  }, [collectionName])

  const soldCount = Object.keys(soldMap).length
  const available = 100 - soldCount

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pink-bg)', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} style={{ color: accentColor, animation: 'spin 1s linear infinite' }} />
      <p style={{ color: accentColor, fontWeight: 600 }}>Cargando...</p>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pink-bg)', paddingBottom: 40 }}>

      {/* ── Banner "solo lectura" ── */}
      <div style={{
        background: accentColor,
        color: 'white',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}>
        <Eye size={14} />
        VISTA PÚBLICA · SOLO LECTURA · SE ACTUALIZA EN TIEMPO REAL
      </div>

      {/* ── Póster ── */}
      <div style={{
        maxWidth: 480,
        margin: '24px auto 0',
        background: 'linear-gradient(160deg, #fdf0f3 0%, #fce4ec 50%, #fdf0f3 100%)',
        borderRadius: 24,
        padding: '0 0 20px',
        boxShadow: '0 20px 60px rgba(196,79,111,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Flores */}
        <div style={{ position: 'relative', height: 100, pointerEvents: 'none', userSelect: 'none' }}>
          <span style={{ position: 'absolute', top: -14, left: -22, fontSize: 120, opacity: 0.45, lineHeight: 1, filter: 'hue-rotate(320deg) saturate(0.7)' }}>🌸</span>
          <span style={{ position: 'absolute', top: -14, right: -22, fontSize: 120, opacity: 0.45, lineHeight: 1, filter: 'hue-rotate(320deg) saturate(0.7)', transform: 'scaleX(-1)' }}>🌸</span>
        </div>
        <div style={{ padding: '0 20px' }}>

          {/* Título */}
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(62px, 17vw, 82px)',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#111',
            lineHeight: 1,
            marginBottom: 10,
            marginTop: -20,
          }}>
            {title}
          </h1>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <img
              src={logo}
              alt={badgeText}
              style={{ height: 80, objectFit: 'contain', display: 'inline-block', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
            />
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{
              background: 'white',
              border: `1.5px solid ${accentColor}30`,
              borderRadius: 10,
              padding: '7px 20px',
              fontWeight: 700,
              fontSize: 13,
              color: accentColor,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            }}>
              {badgeText}
            </div>
          </div>

          {/* Cronómetro de cuenta atrás */}
          <Countdown targetDate={targetDate} accentColor={accentColor} />

          {/* Detalles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 12, color: '#555', flexWrap: 'wrap' }}>
            <span style={{ padding: '0 8px' }}>📅 {date}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ padding: '0 8px' }}>🎲 2 últimos números</span>
          </div>

          {/* Premio */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center' }}>
              <div style={{ flex: 1, height: 1.5, background: `${accentColor}50`, maxWidth: 70 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: accentColor, letterSpacing: 5, textTransform: 'uppercase' }}>PREMIO</span>
              <div style={{ flex: 1, height: 1.5, background: `${accentColor}50`, maxWidth: 70 }} />
            </div>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(44px, 12vw, 64px)', color: accentColor, lineHeight: 1, textAlign: 'center', letterSpacing: 2, marginTop: 4 }}>
              {prizeMain}
            </p>
            {prizeSub && <p style={{ fontSize: 16, fontWeight: 800, color: '#777', letterSpacing: 1, marginTop: 2 }}>{prizeSub}</p>}
          </div>

          {/* ── Contador disponibles ── */}
          <div style={{
            background: 'white',
            borderRadius: 14,
            padding: '10px 16px',
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-around',
            border: `1px solid ${accentColor}20`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1 }}>Disponibles</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#2e7d32' }}>{available}</p>
            </div>
            <div style={{ width: 1, background: '#f0f0f0' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1 }}>Vendidos</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: accentColor }}>{soldCount}</p>
            </div>
            <div style={{ width: 1, background: '#f0f0f0' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1 }}>Total</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#333' }}>100</p>
            </div>
          </div>

          {/* Cuadrícula (solo lectura) */}
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
              const label = String(i).padStart(2, '0')
              const isSold = Boolean(soldMap[i])
              return (
                <div
                  key={i}
                  title={isSold ? 'Vendido' : `Número ${label} disponible`}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    background: isSold ? accentColor : 'white',
                    color: isSold ? 'white' : accentColor,
                    border: `1.5px solid ${isSold ? accentColor : accentColor + '30'}`,
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                >
                  {label}
                </div>
              )
            })}
          </div>

          {/* Leyenda */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: 'white', border: `1.5px solid ${accentColor}40`, display: 'inline-block' }} />
              Disponible
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: accentColor, display: 'inline-block' }} />
              Vendido
            </span>
          </div>

          {/* Info cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginBottom: 16,
            padding: '12px 8px',
            background: 'rgba(255,255,255,0.55)',
            borderRadius: 14,
            border: `1px solid ${accentColor}18`,
          }}>
            <MiniCard label="PRECIO" value={priceLabel} />
            <MiniCard label="SORTEO" value={date} />
            <MiniCard label="ORGANIZA" value={organizer} />
          </div>

          {/* Contacto */}
          <div style={{
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
            borderRadius: 14,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: 'white',
          }}>
            <span style={{ fontSize: 20 }}>📞</span>
            <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.85, letterSpacing: 1 }}>CONTACTO</span>
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>{contact}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 20, fontWeight: 600 }}>
        Los números se actualizan en tiempo real · Solo lectura
      </p>
    </div>
  )
}

function MiniCard({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#444', lineHeight: 1.3 }}>{value}</p>
    </div>
  )
}
