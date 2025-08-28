"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Battery, Zap, Thermometer, AlertTriangle, CheckCircle, Settings, Wrench } from "lucide-react"

interface Plant {
  id: number
  name: string
  status: string
  power: number
  maxPower: number
  efficiency: number
  batteryLevel: number
  alerts: number
}

interface EquipmentMonitoringProps {
  plants: Plant[]
}

export function EquipmentMonitoring({ plants }: EquipmentMonitoringProps) {
  // Mock equipment data
  const equipmentData = plants.map((plant) => ({
    plantId: plant.id,
    plantName: plant.name,
    equipment: [
      {
        id: 1,
        name: "Генератор №1",
        type: "generator",
        status: plant.status === "online" ? "operational" : "maintenance",
        efficiency: plant.efficiency,
        temperature: Math.floor(Math.random() * 50) + 350,
        vibration: Math.floor(Math.random() * 10) + 5,
        lastMaintenance: "15.12.2024",
      },
      {
        id: 2,
        name: "Генератор №2",
        type: "generator",
        status: plant.status === "online" ? "operational" : "offline",
        efficiency: plant.efficiency - 5,
        temperature: Math.floor(Math.random() * 50) + 340,
        vibration: Math.floor(Math.random() * 10) + 3,
        lastMaintenance: "10.12.2024",
      },
      {
        id: 3,
        name: "Акумуляторна Батарея",
        type: "battery",
        status: "operational",
        efficiency: plant.batteryLevel,
        temperature: Math.floor(Math.random() * 20) + 25,
        cycles: Math.floor(Math.random() * 1000) + 2500,
        lastMaintenance: "20.12.2024",
      },
      {
        id: 4,
        name: "Трансформатор",
        type: "transformer",
        status: plant.status === "maintenance" ? "maintenance" : "operational",
        efficiency: 96,
        temperature: Math.floor(Math.random() * 30) + 60,
        load: Math.floor((plant.power / plant.maxPower) * 100),
        lastMaintenance: "05.12.2024",
      },
    ],
  }))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-chart-3" />
      case "maintenance":
        return <Wrench className="h-4 w-4 text-chart-2" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-chart-4" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Працює"
      case "maintenance":
        return "Обслуговування"
      case "offline":
        return "Відключено"
      default:
        return "Невідомо"
    }
  }

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "generator":
        return <Zap className="h-5 w-5 text-chart-2" />
      case "battery":
        return <Battery className="h-5 w-5 text-chart-3" />
      case "transformer":
        return <Activity className="h-5 w-5 text-chart-1" />
      default:
        return <Settings className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Моніторинг Обладнання</h2>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Налаштування моніторингу
        </Button>
      </div>

      {/* Equipment Overview */}
      {equipmentData.map((plantData) => (
        <Card key={plantData.plantId}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getEquipmentIcon("generator")}
              {plantData.plantName}
            </CardTitle>
            <CardDescription>Стан обладнання та метрики</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plantData.equipment.map((equipment) => (
                <Card key={equipment.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEquipmentIcon(equipment.type)}
                        <CardTitle className="text-base">{equipment.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(equipment.status)}
                        <Badge variant="outline" className="text-xs">
                          {getStatusText(equipment.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Efficiency/Battery Level */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{equipment.type === "battery" ? "Заряд" : "Ефективність"}</span>
                        <span className="font-medium">{equipment.efficiency}%</span>
                      </div>
                      <Progress value={equipment.efficiency} />
                    </div>

                    {/* Temperature */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Температура</span>
                      </div>
                      <span className="text-sm font-medium">{equipment.temperature}°C</span>
                    </div>

                    {/* Additional metrics based on equipment type */}
                    {equipment.type === "generator" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-chart-1" />
                          <span className="text-sm">Вібрація</span>
                        </div>
                        <span className="text-sm font-medium">{equipment.vibration} мм/с</span>
                      </div>
                    )}

                    {equipment.type === "battery" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-chart-1" />
                          <span className="text-sm">Цикли</span>
                        </div>
                        <span className="text-sm font-medium">{equipment.cycles}</span>
                      </div>
                    )}

                    {equipment.type === "transformer" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Навантаження</span>
                          <span className="font-medium">{equipment.load}%</span>
                        </div>
                        <Progress value={equipment.load} />
                      </div>
                    )}

                    {/* Last Maintenance */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <span>Останнє ТО:</span>
                      <span>{equipment.lastMaintenance}</span>
                    </div>

                    {/* Action Button */}
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      <Settings className="h-3 w-3 mr-2" />
                      Деталі
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
