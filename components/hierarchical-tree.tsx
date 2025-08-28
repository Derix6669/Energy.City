"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  Factory,
  Zap,
  Battery,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface Equipment {
  id: string
  name: string
  type: "generator" | "battery"
  status: "online" | "offline" | "maintenance"
  capacity: number
  currentOutput: number
}

interface Plant {
  id: string
  name: string
  status: "online" | "offline" | "maintenance"
  totalCapacity: number
  currentOutput: number
  equipment: Equipment[]
}

interface City {
  id: string
  name: string
  region: string
  plants: Plant[]
}

// Mock data з українськими містами та заводами
const mockCities: City[] = [
  {
    id: "kyiv",
    name: "Київ",
    region: "Київська область",
    plants: [
      {
        id: "kyiv-1",
        name: "Київська ТЕС-1",
        status: "online",
        totalCapacity: 2400,
        currentOutput: 2100,
        equipment: [
          { id: "gen-1", name: "Генератор №1", type: "generator", status: "online", capacity: 800, currentOutput: 750 },
          { id: "gen-2", name: "Генератор №2", type: "generator", status: "online", capacity: 800, currentOutput: 700 },
          { id: "bat-1", name: "Акумулятор №1", type: "battery", status: "online", capacity: 400, currentOutput: 350 },
          {
            id: "bat-2",
            name: "Акумулятор №2",
            type: "battery",
            status: "maintenance",
            capacity: 400,
            currentOutput: 0,
          },
        ],
      },
      {
        id: "kyiv-2",
        name: "Київська ТЕС-2",
        status: "online",
        totalCapacity: 1800,
        currentOutput: 1650,
        equipment: [
          { id: "gen-3", name: "Генератор №1", type: "generator", status: "online", capacity: 600, currentOutput: 580 },
          { id: "gen-4", name: "Генератор №2", type: "generator", status: "online", capacity: 600, currentOutput: 570 },
          { id: "bat-3", name: "Акумулятор №1", type: "battery", status: "online", capacity: 300, currentOutput: 250 },
          { id: "bat-4", name: "Акумулятор №2", type: "battery", status: "online", capacity: 300, currentOutput: 250 },
        ],
      },
    ],
  },
  {
    id: "dnipro",
    name: "Дніпро",
    region: "Дніпропетровська область",
    plants: [
      {
        id: "dnipro-1",
        name: "Придніпровська ТЕС",
        status: "online",
        totalCapacity: 3200,
        currentOutput: 2800,
        equipment: [
          {
            id: "gen-5",
            name: "Генератор №1",
            type: "generator",
            status: "online",
            capacity: 1000,
            currentOutput: 950,
          },
          {
            id: "gen-6",
            name: "Генератор №2",
            type: "generator",
            status: "online",
            capacity: 1000,
            currentOutput: 900,
          },
          { id: "gen-7", name: "Генератор №3", type: "generator", status: "offline", capacity: 600, currentOutput: 0 },
          { id: "bat-5", name: "Акумулятор №1", type: "battery", status: "online", capacity: 300, currentOutput: 475 },
          { id: "bat-6", name: "Акумулятор №2", type: "battery", status: "online", capacity: 300, currentOutput: 475 },
        ],
      },
    ],
  },
  {
    id: "kharkiv",
    name: "Харків",
    region: "Харківська область",
    plants: [
      {
        id: "kharkiv-1",
        name: "Харківська ТЕС-1",
        status: "maintenance",
        totalCapacity: 2000,
        currentOutput: 800,
        equipment: [
          {
            id: "gen-8",
            name: "Генератор №1",
            type: "generator",
            status: "maintenance",
            capacity: 800,
            currentOutput: 0,
          },
          { id: "gen-9", name: "Генератор №2", type: "generator", status: "online", capacity: 800, currentOutput: 600 },
          { id: "bat-7", name: "Акумулятор №1", type: "battery", status: "online", capacity: 200, currentOutput: 200 },
        ],
      },
      {
        id: "kharkiv-2",
        name: "Харківська ТЕС-2",
        status: "online",
        totalCapacity: 1600,
        currentOutput: 1400,
        equipment: [
          {
            id: "gen-10",
            name: "Генератор №1",
            type: "generator",
            status: "online",
            capacity: 700,
            currentOutput: 650,
          },
          {
            id: "gen-11",
            name: "Генератор №2",
            type: "generator",
            status: "online",
            capacity: 700,
            currentOutput: 600,
          },
          { id: "bat-8", name: "Акумулятор №1", type: "battery", status: "online", capacity: 200, currentOutput: 150 },
        ],
      },
    ],
  },
]

export function HierarchicalTree() {
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set())
  const [expandedPlants, setExpandedPlants] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const toggleCity = (cityId: string) => {
    const newExpanded = new Set(expandedCities)
    if (newExpanded.has(cityId)) {
      newExpanded.delete(cityId)
    } else {
      newExpanded.add(cityId)
    }
    setExpandedCities(newExpanded)
  }

  const togglePlant = (plantId: string) => {
    const newExpanded = new Set(expandedPlants)
    if (newExpanded.has(plantId)) {
      newExpanded.delete(plantId)
    } else {
      newExpanded.add(plantId)
    }
    setExpandedPlants(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Онлайн"
      case "offline":
        return "Офлайн"
      case "maintenance":
        return "Обслуговування"
      default:
        return status
    }
  }

  const filteredCities = mockCities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.plants.some(
        (plant) =>
          plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.equipment.some((eq) => eq.name.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ієрархічне Дерево</h2>
          <p className="text-muted-foreground">Структура міст, заводів та обладнання</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук міст, заводів або обладнання..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tree Structure */}
      <div className="space-y-4">
        {filteredCities.map((city) => (
          <Card key={city.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => toggleCity(city.id)}
                  className="flex items-center gap-2 p-0 h-auto font-semibold text-lg"
                >
                  {expandedCities.has(city.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <MapPin className="h-5 w-5 text-blue-500" />
                  {city.name}
                </Button>
                <Badge variant="outline">{city.region}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-7">
                <span>Заводів: {city.plants.length}</span>
                <span>Загальна потужність: {city.plants.reduce((sum, plant) => sum + plant.totalCapacity, 0)} МВт</span>
                <span>Поточний вихід: {city.plants.reduce((sum, plant) => sum + plant.currentOutput, 0)} МВт</span>
              </div>
            </CardHeader>

            {expandedCities.has(city.id) && (
              <CardContent className="pt-0">
                <div className="space-y-3 ml-4">
                  {city.plants.map((plant) => (
                    <Card key={plant.id} className="border-l-4 border-l-primary/20">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            onClick={() => togglePlant(plant.id)}
                            className="flex items-center gap-2 p-0 h-auto font-medium"
                          >
                            {expandedPlants.has(plant.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Factory className="h-4 w-4 text-orange-500" />
                            {plant.name}
                          </Button>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(plant.status)}
                            <Badge
                              variant={
                                plant.status === "online"
                                  ? "default"
                                  : plant.status === "maintenance"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {getStatusText(plant.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground ml-6">
                          <span>Потужність: {plant.totalCapacity} МВт</span>
                          <span>Вихід: {plant.currentOutput} МВт</span>
                          <span>Обладнання: {plant.equipment.length}</span>
                          <span>Ефективність: {Math.round((plant.currentOutput / plant.totalCapacity) * 100)}%</span>
                        </div>
                      </CardHeader>

                      {expandedPlants.has(plant.id) && (
                        <CardContent className="pt-0">
                          <div className="space-y-2 ml-4">
                            {plant.equipment.map((equipment) => (
                              <div
                                key={equipment.id}
                                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                              >
                                <div className="flex items-center gap-3">
                                  {equipment.type === "generator" ? (
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                  ) : (
                                    <Battery className="h-4 w-4 text-green-500" />
                                  )}
                                  <div>
                                    <p className="font-medium text-sm">{equipment.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {equipment.type === "generator" ? "Генератор" : "Акумулятор"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right text-sm">
                                    <p>
                                      {equipment.currentOutput} / {equipment.capacity} МВт
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {Math.round((equipment.currentOutput / equipment.capacity) * 100)}% завантаження
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(equipment.status)}
                                    <Badge
                                      variant={
                                        equipment.status === "online"
                                          ? "default"
                                          : equipment.status === "maintenance"
                                            ? "secondary"
                                            : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {getStatusText(equipment.status)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
