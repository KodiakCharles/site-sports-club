'use client'

type Props = {
  embedUrl?: string
  directionsUrl?: string
  clubName?: string
  address?: string
  lat?: number
  lng?: number
}

export default function GoogleMap({ embedUrl, directionsUrl, clubName, address, lat, lng }: Props) {
  if (!embedUrl && !lat) return null

  const mapSrc = embedUrl || (lat && lng ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed` : '')

  return (
    <div className="google-map-container">
      <div className="google-map-wrapper">
        <iframe
          src={mapSrc}
          width="100%"
          height="450"
          style={{ border: 0, borderRadius: '16px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Carte — ${clubName || 'Club de Voile'}`}
        />
      </div>
      <div className="google-map-info">
        {address && (
          <div className="map-info-item">
            <span className="map-info-icon">📍</span>
            <span>{address}</span>
          </div>
        )}
        {directionsUrl && (
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
            📍 Itinéraire
          </a>
        )}
      </div>
    </div>
  )
}
