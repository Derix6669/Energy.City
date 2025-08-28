"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Script from "next/script"
import plantsJson from "@/data/plants.json"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlantItem {
  id: string
  name: string
  location: string
  status: string
  coordinates: { lat: number; lng: number }
  power?: number
  maxPower?: number
  efficiency?: number
  batteryLevel?: number
  alerts?: number
}

type PaletteId = "default" | "ocean" | "sunset" | "mono"

const PALETTES: Record<PaletteId, { online: string; maintenance: string; offline: string; mapStyles?: any[] }> = {
  default: {
    online: "#22c55e",
    maintenance: "#f59e0b",
    offline: "#ef4444",
    mapStyles: [],
  },
  ocean: {
    online: "#2dd4bf",
    maintenance: "#38bdf8",
    offline: "#2563eb",
    mapStyles: [
      { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#0b1220" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#0ea5e9" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#064e3b" }] },
    ],
  },
  sunset: {
    online: "#f97316",
    maintenance: "#eab308",
    offline: "#ef4444",
    mapStyles: [
      { elementType: "geometry", stylers: [{ color: "#1f1724" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#7c3aed" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#3b0764" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#f5d0fe" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1f1724" }] },
    ],
  },
  mono: {
    online: "#94a3b8",
    maintenance: "#64748b",
    offline: "#475569",
    mapStyles: [
      { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
    ],
  },
}

export function PlantMap() {
  const data = (plantsJson as any).plants as PlantItem[]
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [selectedPlant, setSelectedPlant] = useState<PlantItem | null>(null)
  const [visiblePlants, setVisiblePlants] = useState<PlantItem[]>(data)
  const [palette, setPalette] = useState<PaletteId>("default")
  const [query, setQuery] = useState("")
  const [filterOnline, setFilterOnline] = useState(true)
  const [filterMaintenance, setFilterMaintenance] = useState(true)
  const [filterOffline, setFilterOffline] = useState(true)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const markersRef = useRef<any[]>([])
  const markerByIdRef = useRef<Record<string, any>>({})
  const infoRef = useRef<any>(null)

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return
    const g = (window as any).google
    if (!g?.maps) return
    const initialCenter = { lat: 49.0, lng: 31.0 }
    const m = new g.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      // Mobile optimizations
      gestureHandling: "greedy",
      zoomControl: true,
      zoomControlOptions: {
        position: g.maps.ControlPosition.RIGHT_BOTTOM,
      },
    })
    setMap(m)
  }, [isLoaded, map])

  const filteredData = useMemo(() => {
    return data.filter((p) => {
      if (p.status === "online" && !filterOnline) return false
      if (p.status === "maintenance" && !filterMaintenance) return false
      if (p.status === "offline" && !filterOffline) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [data, filterOnline, filterMaintenance, filterOffline, query])

  useEffect(() => {
    if (!map) return
    const g = (window as any).google
    if (!g?.maps) return

    const styles = PALETTES[palette].mapStyles || []
    map.setOptions({ styles })

    // clear previous markers
    markersRef.current.forEach((mk) => mk.setMap(null))
    markersRef.current = []
    markerByIdRef.current = {}

    const info = new g.maps.InfoWindow()
    infoRef.current = info

    const colorForStatus = (s: string) =>
      s === "online" ? PALETTES[palette].online : s === "maintenance" ? PALETTES[palette].maintenance : PALETTES[palette].offline

    const createSvgIcon = (color: string) => {
      const svg = encodeURIComponent(
        `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"${color}\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z\" fill=\"${color}\" opacity=\"0.2\"/><circle cx=\"12\" cy=\"11\" r=\"3\" fill=\"${color}\"/></svg>`,
      )
      return { url: `data:image/svg+xml;charset=UTF-8,${svg}`, scaledSize: new g.maps.Size(28, 28), anchor: new g.maps.Point(14, 28) }
    }

    const bounds = new g.maps.LatLngBounds()

    filteredData.forEach((p) => {
      const pos = { lat: p.coordinates.lat, lng: p.coordinates.lng }
      bounds.extend(pos)
      const marker = new g.maps.Marker({
        position: pos,
        map,
        title: p.name,
        icon: createSvgIcon(colorForStatus(p.status)),
      })
      markersRef.current.push(marker)
      markerByIdRef.current[p.id] = marker
      marker.addListener("click", () => {
        setSelectedPlant(p)
        info.setContent(
          `<div style=\"min-width:200px\">` +
            `<div style=\"font-weight:600;margin-bottom:4px\">${p.name}</div>` +
            `<div style=\"font-size:12px;color:#64748b;margin-bottom:6px\">${p.location}</div>` +
            `<div style=\"font-size:12px\"><b>Статус:</b> ${p.status}</div>` +
            `</div>`,
        )
        info.open({ map, anchor: marker })
      })
    })

    if (!bounds.isEmpty()) map.fitBounds(bounds, 64)

    const onIdle = () => {
      const b = map.getBounds()
      if (!b) return
      const filtered = filteredData.filter((p) => b.contains(new g.maps.LatLng(p.coordinates.lat, p.coordinates.lng)))
      setVisiblePlants(filtered)
    }
    const idleListener = g.maps.event.addListener(map, "idle", onIdle)
    onIdle()

    return () => {
      g.maps.event.removeListener(idleListener)
    }
  }, [map, palette, filteredData])

  const flyToPlant = (p: PlantItem | undefined) => {
    if (!p || !map) return
    const g = (window as any).google
    const marker = markerByIdRef.current[p.id]
    const pos = new g.maps.LatLng(p.coordinates.lat, p.coordinates.lng)
    map.panTo(pos)
    map.setZoom(9)
    if (marker && infoRef.current) {
      setSelectedPlant(p)
      infoRef.current.setContent(
        `<div style=\"min-width:200px\"><div style=\"font-weight:600;margin-bottom:4px\">${p.name}</div><div style=\"font-size:12px;color:#64748b;margin-bottom:6px\">${p.location}</div><div style=\"font-size:12px\"><b>Статус:</b> ${p.status}</div></div>`,
      )
      infoRef.current.open({ map, anchor: marker })
    }
  }

  const fitToAll = () => {
    if (!map) return
    const g = (window as any).google
    const bounds = new g.maps.LatLngBounds()
    filteredData.forEach((p) => bounds.extend(new g.maps.LatLng(p.coordinates.lat, p.coordinates.lng)))
    if (!bounds.isEmpty()) map.fitBounds(bounds, 64)
  }

  const metrics = useMemo(() => {
    if (!visiblePlants.length) return null
    const total = visiblePlants.length
    const online = visiblePlants.filter((p) => p.status === "online").length
    const maintenance = visiblePlants.filter((p) => p.status === "maintenance").length
    const offline = visiblePlants.filter((p) => p.status === "offline").length
    const totalPower = visiblePlants.reduce((s, p) => s + (p.power || 0), 0)
    const totalMax = visiblePlants.reduce((s, p) => s + (p.maxPower || 0), 0)
    const avgEff = Math.round(
      visiblePlants.reduce((s, p) => s + (p.efficiency || 0), 0) / Math.max(1, visiblePlants.filter((p) => p.efficiency != null).length),
    )
    const alerts = visiblePlants.reduce((s, p) => s + (p.alerts || 0), 0)
    return { total, online, maintenance, offline, totalPower, totalMax, avgEff, alerts }
  }, [visiblePlants])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="space-y-3 md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold">Карта Заводів</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Google Map з маркерами усіх поточних заводів</p>
        </div>
        
        {/* Mobile: Stack controls vertically, Desktop: Horizontal layout */}
        <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-3">
          {/* Status filters - mobile optimized */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs border border-border rounded-lg px-3 py-2 bg-card/50">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={filterOnline} onChange={(e) => setFilterOnline(e.target.checked)} className="w-3 h-3" />
              <span style={{ backgroundColor: PALETTES[palette].online }} className="w-2 h-2 rounded-full inline-block"></span>
              <span className="hidden sm:inline">Онлайн</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={filterMaintenance} onChange={(e) => setFilterMaintenance(e.target.checked)} className="w-3 h-3" />
              <span style={{ backgroundColor: PALETTES[palette].maintenance }} className="w-2 h-2 rounded-full inline-block"></span>
              <span className="hidden sm:inline">Сервіс</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={filterOffline} onChange={(e) => setFilterOffline(e.target.checked)} className="w-3 h-3" />
              <span style={{ backgroundColor: PALETTES[palette].offline }} className="w-2 h-2 rounded-full inline-block"></span>
              <span className="hidden sm:inline">Офлайн</span>
            </label>
          </div>

          {/* Search and actions - mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <input
                className="flex-1 h-9 rounded-md border border-border bg-card px-3 text-sm min-w-0"
                placeholder="Пошук станції..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const p = filteredData[0]
                    flyToPlant(p)
                  }
                }}
              />
              <button className="h-9 px-3 rounded-md border border-border bg-card text-sm whitespace-nowrap" onClick={() => flyToPlant(filteredData[0])}>
                <span className="hidden sm:inline">Знайти</span>
                <span className="sm:hidden">🔍</span>
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 sm:flex-none h-9 px-3 rounded-md border border-border bg-card text-sm" onClick={fitToAll}>
                <span className="hidden sm:inline">Підігнати</span>
                <span className="sm:hidden">📐</span>
              </button>
              <select
                className="h-9 rounded-md border border-border bg-card px-2 text-xs"
                value={palette}
                onChange={(e) => setPalette(e.target.value as PaletteId)}
              >
                <option value="default">🎨</option>
                <option value="ocean">🌊</option>
                <option value="sunset">🌅</option>
                <option value="mono">⚫</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Географічне розміщення</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-md overflow-hidden border border-border">
            {/* Mobile-optimized metrics panel */}
            {metrics && (
              <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-auto z-10 bg-card/95 backdrop-blur rounded-md border border-border p-2 md:p-3 text-xs space-y-1 md:space-y-2 shadow max-w-[280px] md:max-w-none">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Видимі станції:</span>
                  <Badge variant="secondary" className="text-xs">{metrics.total}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-1 md:gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PALETTES[palette].online }}></span>
                    <span className="hidden sm:inline">Онлайн</span>
                    <span className="sm:hidden">О</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PALETTES[palette].maintenance }}></span>
                    <span className="hidden sm:inline">Сервіс</span>
                    <span className="sm:hidden">С</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PALETTES[palette].offline }}></span>
                    <span className="hidden sm:inline">Офлайн</span>
                    <span className="sm:hidden">В</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs">
                  <div><span className="text-muted-foreground">Навантаження:</span> {metrics.totalPower} МВт</div>
                  <div><span className="text-muted-foreground">Макс. потужн.:</span> {metrics.totalMax} МВт</div>
                  <div><span className="text-muted-foreground">Сер. ефект.:</span> {Number.isFinite(metrics.avgEff) ? metrics.avgEff : 0}%</div>
                  <div><span className="text-muted-foreground">Сповіщення:</span> {metrics.alerts}</div>
                </div>
                {selectedPlant && (
                  <div className="mt-2 border-t border-border pt-2">
                    <div className="font-medium truncate max-w-[240px]" title={selectedPlant.name}>{selectedPlant.name}</div>
                    <div className="text-muted-foreground truncate max-w-[240px]" title={selectedPlant.location}>{selectedPlant.location}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <div>Статус: {selectedPlant.status}</div>
                      {selectedPlant.power != null && selectedPlant.maxPower != null && (
                        <div>{selectedPlant.power}/{selectedPlant.maxPower} МВт</div>
                      )}
                      {selectedPlant.efficiency != null && <div>Ефект.: {selectedPlant.efficiency}%</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={mapRef} className="h-full w-full" />
          </div>
        </CardContent>
      </Card>

      {!apiKey && (
        <div className="text-sm text-red-500 text-center md:text-left">Відсутній API ключ. Додайте NEXT_PUBLIC_GOOGLE_MAPS_API_KEY у .env.local</div>
      )}

      <Script
        id="google-maps-loader"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey || ""}`}
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
        onError={() => console.error("Помилка завантаження Google Maps API")}
      />
    </div>
  )
} 