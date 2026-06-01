import PublicView from './PublicView'

export default function VerEspana() {
  return (
    <PublicView
      collectionName="boletos"
      title="GRAN RIFA"
      badgeText="Cuponazo de la ONCE"
      prizeMain="500€"
      date="26 de junio"
      targetDate="2026-06-26T21:00:00"
      contact="623 523 515"
      whatsapp="34623523515"
      logo="/cuponazo.png"
      priceLabel="20€"
      organizer="Juliana"
      accentColor="#c4496f"
    />
  )
}
