"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause } from "lucide-react"
import plantsJson from "@/data/plants.json"

interface PlantNode {
  id: string
  name: string
  city: string
  x: number
  y: number
  status: "online" | "offline" | "maintenance"
  capacity: number
  currentLoad: number
  connections: string[]
}

interface Connection {
  from: string
  to: string
  capacity: number
  currentFlow: number
  status: "active" | "overload" | "maintenance"
}

const initialPlants: PlantNode[] = [
  {
    id: "plant1",
    name: "Київська ТЕС",
    city: "Київ",
    x: 400,
    y: 200,
    status: "online",
    capacity: 2400,
    currentLoad: 1920,
    connections: ["plant2", "plant3", "plant5"],
  },
  {
    id: "plant2",
    name: "Харківська ТЕС",
    city: "Харків",
    x: 600,
    y: 150,
    status: "online",
    capacity: 1800,
    currentLoad: 1440,
    connections: ["plant1", "plant4", "plant6"],
  },
  {
    id: "plant3",
    name: "Дніпровська ТЕС",
    city: "Дніпро",
    x: 500,
    y: 300,
    status: "maintenance",
    capacity: 2200,
    currentLoad: 0,
    connections: ["plant1", "plant4", "plant7"],
  },
  {
    id: "plant4",
    name: "Одеська ТЕС",
    city: "Одеса",
    x: 300,
    y: 400,
    status: "online",
    capacity: 1600,
    currentLoad: 1280,
    connections: ["plant2", "plant3", "plant8"],
  },
  {
    id: "plant5",
    name: "Львівська ТЕС",
    city: "Львів",
    x: 200,
    y: 250,
    status: "online",
    capacity: 1400,
    currentLoad: 1120,
    connections: ["plant1", "plant6", "plant9"],
  },
  {
    id: "plant6",
    name: "Запорізька АЕС",
    city: "Запоріжжя",
    x: 550,
    y: 350,
    status: "online",
    capacity: 6000,
    currentLoad: 4800,
    connections: ["plant2", "plant5", "plant7"],
  },
  {
    id: "plant7",
    name: "Кременчуцька ТЕС",
    city: "Кременчук",
    x: 480,
    y: 280,
    status: "online",
    capacity: 1200,
    currentLoad: 960,
    connections: ["plant3", "plant6", "plant8"],
  },
  {
    id: "plant8",
    name: "Миколаївська ТЕС",
    city: "Миколаїв",
    x: 350,
    y: 450,
    status: "offline",
    capacity: 800,
    currentLoad: 0,
    connections: ["plant4", "plant7", "plant9"],
  },
  {
    id: "plant9",
    name: "Івано-Франківська ТЕС",
    city: "Івано-Франківськ",
    x: 250,
    y: 300,
    status: "online",
    capacity: 1000,
    currentLoad: 800,
    connections: ["plant5", "plant8", "plant10"],
  },
  {
    id: "plant10",
    name: "Чернігівська ТЕС",
    city: "Чернігів",
    x: 450,
    y: 100,
    status: "online",
    capacity: 900,
    currentLoad: 720,
    connections: ["plant9", "plant1", "plant2"],
  },
]

const generateConnections = (plants: PlantNode[]): Connection[] => {
  const connections: Connection[] = []
  plants.forEach((plant) => {
    plant.connections.forEach((targetId) => {
      if (
        !connections.find(
          (c) => (c.from === plant.id && c.to === targetId) || (c.from === targetId && c.to === plant.id),
        )
      ) {
        const capacity = Math.floor(Math.random() * 500) + 200
        const currentFlow = Math.floor(capacity * (0.3 + Math.random() * 0.6))
        const status = currentFlow > capacity * 0.9 ? "overload" : "active"
        connections.push({
          from: plant.id,
          to: targetId,
          capacity,
          currentFlow,
          status,
        })
      }
    })
  })
  return connections
}

export function NetworkGraph() {
  const [plants, setPlants] = useState<PlantNode[]>(initialPlants)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"global" | "local">("global")
  const [zoom, setZoom] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [dragging, setDragging] = useState<{
    id: string
    offsetX: number
    offsetY: number
  } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Local layout state per selected node
  const [localNodesById, setLocalNodesById] = useState<Record<string, { id: string; x: number; y: number }[]>>({})
  const [localDragging, setLocalDragging] = useState<{ index: number; offsetX: number; offsetY: number } | null>(null)

  const connections = useMemo(() => generateConnections(plants), [])

  const selectedNode = useMemo(() => plants.find((p) => p.id === selectedNodeId) || null, [plants, selectedNodeId])

  // derive subCount from plants.json by city
  const localSubCount = useMemo(() => {
    if (!selectedNode) return 0
    const list = (plantsJson as any).plants as Array<{ location: string }>
    const city = selectedNode.city
    return list.filter((p) => p.location?.startsWith(city)).length || 6
  }, [selectedNode])

  useEffect(() => {
    if (viewMode !== "local" || !selectedNode) return
    if (localNodesById[selectedNode.id] && localNodesById[selectedNode.id].length === localSubCount) return

    // initialize ring layout
    const width = 800
    const height = 600
    const center = { x: width / 2, y: height / 2 }
    const radius = 180
    const nodes = Array.from({ length: Math.max(1, localSubCount) }).map((_, i) => {
      const angle = (i / Math.max(1, localSubCount)) * Math.PI * 2
      return { id: `sub-${i}`, x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius }
    })
    setLocalNodesById((prev) => ({ ...prev, [selectedNode.id]: nodes }))
  }, [viewMode, selectedNode, localSubCount, localNodesById])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22c55e"
      case "offline":
        return "#ef4444"
      case "maintenance":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getConnectionColor = (status: string) => {
    switch (status) {
      case "active":
        return "#3b82f6"
      case "overload":
        return "#ef4444"
      case "maintenance":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5))
  const handleReset = () => setZoom(1)

  const getMousePoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const x = (clientX - rect.left) / zoom
    const y = (clientY - rect.top) / zoom
    return { x, y }
  }

  const onNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    const { x, y } = getMousePoint(e.clientX, e.clientY)
    const node = plants.find((p) => p.id === nodeId)
    if (!node) return
    setDragging({ id: nodeId, offsetX: node.x - x, offsetY: node.y - y })
  }

  const onSvgMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    const { x, y } = getMousePoint(e.clientX, e.clientY)
    setPlants((prev) =>
      prev.map((p) => (p.id === dragging.id ? { ...p, x: x + dragging.offsetX, y: y + dragging.offsetY } : p)),
    )
  }

  const endDrag = () => setDragging(null)

  // Local view dragging handlers
  const onLocalMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (!selectedNode) return
    const localNodes = localNodesById[selectedNode.id]
    if (!localNodes) return
    const pt = getMousePoint(e.clientX, e.clientY)
    setLocalDragging({ index, offsetX: localNodes[index].x - pt.x, offsetY: localNodes[index].y - pt.y })
  }

  const onLocalMouseMove = (e: React.MouseEvent) => {
    if (!localDragging || !selectedNode) return
    const pt = getMousePoint(e.clientX, e.clientY)
    setLocalNodesById((prev) => {
      const existing = prev[selectedNode.id] || []
      const next = existing.map((n, i) =>
        i === localDragging.index ? { ...n, x: pt.x + localDragging.offsetX, y: pt.y + localDragging.offsetY } : n,
      )
      return { ...prev, [selectedNode.id]: next }
    })
  }

  const endLocalDrag = () => setLocalDragging(null)

  // Internal local view graph - full canvas
  const renderLocalGraph = () => {
    if (!selectedNode) return null
    const width = 800
    const height = 600
    const center = { x: width / 2, y: height / 2 }

    const subNodes = localNodesById[selectedNode.id] || []

    // peer-to-peer ring links
    const subLinks = subNodes.map((_, i) => ({ from: i, to: (i + 1) % subNodes.length }))

    return (
      <g onMouseMove={onLocalMouseMove} onMouseUp={endLocalDrag} onMouseLeave={endLocalDrag}>
        <defs>
          <marker id={`arrow-local-${selectedNode.id}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <style>{`
            @keyframes dash-move { to { stroke-dashoffset: -14; } }
          `}</style>
        </defs>

        {/* center hub representing the city */}
        <circle cx={center.x} cy={center.y} r={40} fill="#14b8a6" stroke="#fff" strokeWidth={3} />
        <text x={center.x} y={center.y + 4} textAnchor="middle" fill="#fff" fontWeight="bold">{selectedNode.city}</text>

        {/* animated peer-to-peer links (ring) */}
        {subLinks.map((l, idx) => {
          if (subNodes.length === 0) return null
          const a = subNodes[l.from]
          const b = subNodes[l.to]
          return (
            <g key={idx}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#60a5fa"
                strokeWidth={3}
                markerEnd={`url(#arrow-local-${selectedNode.id})`}
                strokeDasharray="8 8"
                style={{ animation: "dash-move 1.4s linear infinite" }}
              />
            </g>
          )
        })}

        {/* sub nodes (draggable) */}
        {subNodes.map((n, i) => (
          <g key={i} onMouseDown={(e) => onLocalMouseDown(e, i)}>
            <circle cx={n.x} cy={n.y} r={14} fill="#0ea5e9" stroke="#fff" strokeWidth={2} />
            <circle cx={n.x} cy={n.y} r={7} fill="#1d4ed8" />
          </g>
        ))}
      </g>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="space-y-3 md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold">Візуалізація Мережі</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Інтерактивний граф електромережі заводів</p>
        </div>
        
        {/* Mobile: Stack controls vertically, Desktop: Horizontal layout */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {viewMode === "local" ? (
            <Button variant="outline" size="sm" onClick={() => { setViewMode("global"); setSelectedNodeId(null); }} className="w-full sm:w-auto">
              Повернутися
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Button variant="outline" size="sm" onClick={handleZoomOut} className="flex-1 sm:flex-none">
                <ZoomOut className="h-4 w-4" />
                <span className="ml-1 sm:hidden">Зменшити</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} className="flex-1 sm:flex-none">
                <RotateCcw className="h-4 w-4" />
                <span className="ml-1 sm:hidden">Скинути</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn} className="flex-1 sm:flex-none">
                <ZoomIn className="h-4 w-4" />
                <span className="ml-1 sm:hidden">Збільшити</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)} className="flex-1 sm:flex-none">
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="ml-1 sm:hidden">{isAnimating ? "Пауза" : "Грати"}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="relative overflow-hidden bg-slate-950 rounded-lg" style={{ height: "400px", minHeight: "400px" }}>
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className={viewMode === "global" ? "cursor-move" : ""}
                  style={{ transform: viewMode === "global" ? `scale(${zoom})` : undefined }}
                  onMouseMove={viewMode === "global" ? onSvgMouseMove : undefined}
                  onMouseUp={viewMode === "global" ? endDrag : undefined}
                  onMouseLeave={viewMode === "global" ? endDrag : undefined}
                  onClick={viewMode === "global" ? () => setSelectedNodeId(null) : undefined}
                >
                  {/* Grid Background */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.3" />
                    </pattern>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {viewMode === "global" ? (
                    <>
                      {/* Connections */}
                      {connections.map((connection, index) => {
                        const fromPlant = plants.find((p) => p.id === connection.from)
                        const toPlant = plants.find((p) => p.id === connection.to)
                        if (!fromPlant || !toPlant) return null

                        return (
                          <g key={index}>
                            <line
                              x1={fromPlant.x}
                              y1={fromPlant.y}
                              x2={toPlant.x}
                              y2={toPlant.y}
                              stroke={getConnectionColor(connection.status)}
                              strokeWidth={Math.max(2, connection.currentFlow / 100)}
                              opacity={0.7}
                              className={isAnimating ? "animate-pulse" : ""}
                            />
                            {/* Flow indicator */}
                            <circle
                              cx={(fromPlant.x + toPlant.x) / 2}
                              cy={(fromPlant.y + toPlant.y) / 2}
                              r="3"
                              fill={getConnectionColor(connection.status)}
                              className={isAnimating ? "animate-ping" : ""}
                            />
                          </g>
                        )
                      })}

                      {/* Plant Nodes */}
                      {plants.map((plant, idx) => {
                        const nodeRadius = Math.max(15, plant.capacity / 200)
                        const placement = idx % 4
                        const labelOffsets = [
                          { dx: 0, dy: -(nodeRadius + 6), anchor: "middle" as const },
                          { dx: nodeRadius + 6, dy: 4, anchor: "start" as const },
                          { dx: 0, dy: nodeRadius + 14, anchor: "middle" as const },
                          { dx: -(nodeRadius + 6), dy: 4, anchor: "end" as const },
                        ][placement]

                        return (
                          <g key={plant.id} onClick={(e) => { e.stopPropagation(); setSelectedNodeId(plant.id); setViewMode("local") }}>
                            {/* Node Circle */}
                            <circle
                              cx={plant.x}
                              cy={plant.y}
                              r={nodeRadius}
                              fill={getStatusColor(plant.status)}
                              stroke="#ffffff"
                              strokeWidth={2}
                              filter="url(#glow)"
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              onMouseDown={(e) => onNodeMouseDown(e, plant.id)}
                            />

                            {/* Load Indicator */}
                            <circle
                              cx={plant.x}
                              cy={plant.y}
                              r={Math.max(10, plant.capacity / 300)}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="2"
                              strokeDasharray={`${(plant.currentLoad / plant.capacity) * 2 * Math.PI * Math.max(10, plant.capacity / 300)} ${2 * Math.PI * Math.max(10, plant.capacity / 300)}`}
                              opacity="0.8"
                              className={isAnimating ? "animate-spin" : ""}
                              style={{ animationDuration: "10s" }}
                            />

                            {/* Plant Label */}
                            <text
                              x={plant.x + labelOffsets.dx}
                              y={plant.y + labelOffsets.dy}
                              textAnchor={labelOffsets.anchor}
                              fill="#ffffff"
                              fontSize="12"
                              fontWeight="bold"
                              className="select-none"
                              style={{ userSelect: "none", paintOrder: "stroke", stroke: "#0f172a", strokeWidth: 3 }}
                            >
                              {plant.name.split(" ")[0]}
                            </text>
                          </g>
                        )
                      })}
                    </>
                  ) : (
                    // Local view replaces the large graph
                    renderLocalGraph()
                  )}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{viewMode === "global" ? "Легенда" : "Локальний перегляд"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {viewMode === "global" ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs md:text-sm">Онлайн</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs md:text-sm">Офлайн</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs md:text-sm">Обслуговування</span>
                    </div>
                  </div>
                  <hr className="border-border" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-blue-500"></div>
                      <span className="text-xs md:text-sm">Активне з'єднання</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-red-500"></div>
                      <span className="text-xs md:text-sm">Перевантаження</span>
                    </div>
                  </div>
                </>
              ) : selectedNode ? (
                <>
                  <div className="text-xs md:text-sm">Місто: <span className="font-medium">{selectedNode.city}</span></div>
                  <div className="text-xs md:text-sm">Вузол: <span className="font-medium">{selectedNode.name}</span></div>
                  <div className="text-xs text-muted-foreground">Показано локальний потік енергії між підстанціями</div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Selected Node Info */}
          {viewMode === "global" && selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">{selectedNode.name}</CardTitle>
                <CardDescription>{selectedNode.city}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm">Статус:</span>
                  <Badge
                    variant={
                      selectedNode.status === "online"
                        ? "default"
                        : selectedNode.status === "offline"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {selectedNode.status === "online"
                      ? "Онлайн"
                      : selectedNode.status === "offline"
                        ? "Офлайн"
                        : "Обслуговування"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Потужність:</span>
                    <span>{selectedNode.capacity} МВт</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Поточне навантаження:</span>
                    <span>{selectedNode.currentLoad} МВт</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Використання:</span>
                    <span>{Math.round((selectedNode.currentLoad / selectedNode.capacity) * 100)}%</span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedNode.currentLoad / selectedNode.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  З'єднання: {selectedNode.connections.length} заводів
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Stats */}
          {viewMode === "global" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Статистика Мережі</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Всього заводів:</span>
                  <span>{plants.length}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Онлайн:</span>
                  <span className="text-green-500">{plants.filter((p) => p.status === "online").length}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Офлайн:</span>
                  <span className="text-red-500">{plants.filter((p) => p.status === "offline").length}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Обслуговування:</span>
                  <span className="text-yellow-500">{plants.filter((p) => p.status === "maintenance").length}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Загальна потужність:</span>
                  <span>{plants.reduce((sum, p) => sum + p.capacity, 0).toLocaleString()} МВт</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Поточне навантаження:</span>
                  <span>{plants.reduce((sum, p) => sum + p.currentLoad, 0).toLocaleString()} МВт</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
