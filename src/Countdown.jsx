import { useState, useEffect } from 'react'

export default function Countdown({ targetDate, accentColor }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      }
    } else {
      timeLeft = { días: 0, horas: 0, minutos: 0, segundos: 0 }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: 16
    }}>
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'white',
          borderRadius: 8,
          minWidth: 50,
          padding: '6px 4px',
          border: `1px solid ${accentColor}20`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <span style={{
            fontSize: 18,
            fontWeight: 900,
            color: accentColor,
            lineHeight: 1
          }}>
            {String(value).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            color: '#bbb',
            textTransform: 'uppercase',
            marginTop: 2
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
