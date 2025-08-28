"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause } from "lucide-react"

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

const mockPlants: PlantNode[] = [
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

const generateConnections = (): Connection[] => {
  const connections: Connection[] = []
  mockPlants.forEach((plant) => {
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
  const [selectedNode, setSelectedNode] = useState<PlantNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [connections] = useState(generateConnections())
  const svgRef = useRef<SVGSVGElement>(null)

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Візуалізація Мережі</h2>
          <p className="text-muted-foreground">Інтерактивний граф електромережі заводів</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)}>
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="relative overflow-hidden bg-slate-950 rounded-lg" style={{ height: "600px" }}>
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="cursor-move"
                  style={{ transform: `scale(${zoom})` }}
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

                  {/* Connections */}
                  {connections.map((connection, index) => {
                    const fromPlant = mockPlants.find((p) => p.id === connection.from)
                    const toPlant = mockPlants.find((p) => p.id === connection.to)
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
                  {mockPlants.map((plant) => (
                    <g key={plant.id}>
                      {/* Node Circle */}
                      <circle
                        cx={plant.x}
                        cy={plant.y}
                        r={Math.max(15, plant.capacity / 200)}
                        fill={getStatusColor(plant.status)}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#glow)"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedNode(plant)}
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
                        x={plant.x}
                        y={plant.y - Math.max(20, plant.capacity / 200)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {plant.name.split(" ")[0]}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Легенда</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Онлайн</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Офлайн</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Обслуговування</span>
                </div>
              </div>
              <hr className="border-border" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500"></div>
                  <span className="text-sm">Активне з'єднання</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span className="text-sm">Перевантаження</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Node Info */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
                <CardDescription>{selectedNode.city}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Статус:</span>
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
                  <div className="flex justify-between text-sm">
                    <span>Потужність:</span>
                    <span>{selectedNode.capacity} МВт</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Поточне навантаження:</span>
                    <span>{selectedNode.currentLoad} МВт</span>
                  </div>
                  <div className="flex justify-between text-sm">
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
                <div className="text-sm text-muted-foreground">
                  З'єднання: {selectedNode.connections.length} заводів
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статистика Мережі</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Всього заводів:</span>
                <span>{mockPlants.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Онлайн:</span>
                <span className="text-green-500">{mockPlants.filter((p) => p.status === "online").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Офлайн:</span>
                <span className="text-red-500">{mockPlants.filter((p) => p.status === "offline").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Обслуговування:</span>
                <span className="text-yellow-500">{mockPlants.filter((p) => p.status === "maintenance").length}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span>Загальна потужність:</span>
                <span>{mockPlants.reduce((sum, p) => sum + p.capacity, 0).toLocaleString()} МВт</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Поточне навантаження:</span>
                <span>{mockPlants.reduce((sum, p) => sum + p.currentLoad, 0).toLocaleString()} МВт</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
