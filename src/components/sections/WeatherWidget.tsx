'use client'
import { useEffect, useState } from 'react'

type WeatherData = {
  windSpeed: number
  windDirection: number
  windGust: number
  waveHeight: number
  temperature: number
}

const WIND_DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

function degToCompass(deg: number): string {
  const i = Math.round(deg / 22.5) % 16
  return WIND_DIRECTIONS[i]
}

function msToKnots(ms: number): number {
  return Math.round(ms * 1.94384)
}

export default function WeatherWidget({ stationId }: { stationId?: string }) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!stationId) { setLoading(false); return }
    fetch(`/api/weather?stationId=${stationId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [stationId])

  if (!stationId) return null

  return (
    <div className="weather-widget">
      <div className="weather-widget-header">
        <span className="weather-icon">🌊</span>
        <h3>Météo marine</h3>
      </div>
      {loading ? (
        <div className="weather-loading">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ) : data ? (
        <div className="weather-grid">
          <div className="weather-item">
            <div className="weather-item-icon">💨</div>
            <div className="weather-item-value">{msToKnots(data.windSpeed)}<span>kts</span></div>
            <div className="weather-item-label">Vent {degToCompass(data.windDirection)}</div>
          </div>
          <div className="weather-item">
            <div className="weather-item-icon">🌊</div>
            <div className="weather-item-value">{data.waveHeight.toFixed(1)}<span>m</span></div>
            <div className="weather-item-label">Vagues</div>
          </div>
          <div className="weather-item">
            <div className="weather-item-icon">🌡️</div>
            <div className="weather-item-value">{Math.round(data.temperature)}<span>°C</span></div>
            <div className="weather-item-label">Température</div>
          </div>
          <div className="weather-item">
            <div className="weather-item-icon">💨</div>
            <div className="weather-item-value">{msToKnots(data.windGust)}<span>kts</span></div>
            <div className="weather-item-label">Rafales</div>
          </div>
        </div>
      ) : (
        <p className="weather-unavailable">Données météo indisponibles</p>
      )}
    </div>
  )
}
