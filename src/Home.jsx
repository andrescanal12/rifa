import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fdf0f3 0%, #fce4ec 50%, #fdf0f3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 32,
    }}>
      {/* Flores decorativas */}
      <div style={{ position: 'fixed', top: -30, left: -30, fontSize: 160, opacity: 0.3, pointerEvents: 'none', userSelect: 'none' }}>🌸</div>
      <div style={{ position: 'fixed', top: -30, right: -30, fontSize: 160, opacity: 0.3, transform: 'scaleX(-1)', pointerEvents: 'none', userSelect: 'none' }}>🌸</div>
      <div style={{ position: 'fixed', bottom: -30, left: '50%', transform: 'translateX(-50%)', fontSize: 160, opacity: 0.2, pointerEvents: 'none', userSelect: 'none' }}>🌸</div>

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(50px, 15vw, 80px)',
          letterSpacing: 6,
          color: '#111',
          lineHeight: 1,
          marginBottom: 8,
        }}>
          GRAN RIFA
        </h1>
        <p style={{ color: 'var(--pink-dark)', fontWeight: 600, fontSize: 16, letterSpacing: 1 }}>
          Selecciona la rifa que quieres gestionar
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        maxWidth: 420,
        zIndex: 1,
      }}>
        {/* Card España */}
        <button
          id="btn-espana"
          onClick={() => navigate('/espana')}
          style={{
            background: 'white',
            border: '2px solid rgba(196,79,111,0.15)',
            borderRadius: 20,
            padding: '20px 28px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(196,79,111,0.12)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(196,79,111,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(196,79,111,0.12)'
          }}
        >
          <img src="/cuponazo.png" alt="Cuponazo" style={{ width: 80, height: 60, objectFit: 'contain' }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>España</p>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'var(--pink-dark)', letterSpacing: 2, lineHeight: 1 }}>CUPONAZO ONCE</p>
            <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Premio: 500€ · 26 de junio</p>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--pink-dark)', fontSize: 22 }}>→</span>
        </button>

        {/* Card Colombia */}
        <button
          id="btn-colombia"
          onClick={() => navigate('/colombia')}
          style={{
            background: 'white',
            border: '2px solid rgba(0,128,0,0.15)',
            borderRadius: 20,
            padding: '20px 28px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(0,128,0,0.1)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,128,0,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,128,0,0.1)'
          }}
        >
          <img src="/risaralda.png" alt="Risaralda" style={{ width: 80, height: 60, objectFit: 'contain' }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Colombia</p>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: '#007a3d', letterSpacing: 2, lineHeight: 1 }}>LOTERÍA RISARALDA</p>
            <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Premio: 1 millón · 5 de junio</p>
          </div>
          <span style={{ marginLeft: 'auto', color: '#007a3d', fontSize: 22 }}>→</span>
        </button>
      </div>
    </div>
  )
}
