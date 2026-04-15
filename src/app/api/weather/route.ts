import { NextRequest, NextResponse } from 'next/server'

const cache = new Map<string, { data: unknown; expires: number }>()

export async function GET(req: NextRequest) {
  const stationId = req.nextUrl.searchParams.get('stationId')
  if (!stationId) return NextResponse.json({ error: 'Missing stationId' }, { status: 400 })

  const cached = cache.get(stationId)
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data)
  }

  try {
    const res = await fetch(
      `https://www.windguru.cz/int/iapi.php?q=forecast&id_spot=${stationId}&lang=fr`,
      { next: { revalidate: 1800 } }
    )
    if (!res.ok) return NextResponse.json({ error: 'Windguru unavailable' }, { status: 502 })
    const raw = await res.json()

    const fcst = raw.fcst || {}
    const data = {
      windSpeed: fcst.WINDSPD?.[0] ?? 0,
      windDirection: fcst.WINDDIR?.[0] ?? 0,
      windGust: fcst.GUST?.[0] ?? 0,
      waveHeight: fcst.HTSGW?.[0] ?? 0,
      temperature: fcst.TMP?.[0] ?? 0,
    }

    cache.set(stationId, { data, expires: Date.now() + 1800000 }) // 30 min
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
