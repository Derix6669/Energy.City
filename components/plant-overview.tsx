"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Factory, Zap, Battery, AlertTriangle, Settings, TrendingUp, Activity } from "lucide-react"

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

interface PlantOverviewProps {
  plants: Plant[]
}

export function PlantOverview({ plants }: PlantOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-chart-3"
      case "maintenance":
        return "bg-chart-2"
      case "offline":
        return "bg-chart-4"
      default:
        return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "В мережі"
      case "maintenance":
        return "Обслуговування"
      case "offline":
        return "Відключено"
      default:
        return "Невідомо"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Огляд Заводів</h2>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Налаштування моніторингу
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plants.map((plant) => (
          <Card key={plant.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Factory className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{plant.name}</CardTitle>
                    <CardDescription>ID: {plant.id}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(plant.status)}`} />
                  <Badge variant="outline">{getStatusText(plant.status)}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Power Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-chart-2" />
                    <span className="text-sm font-medium">Потужність</span>
                  </div>
                  <span className="text-sm font-bold">
                    {plant.power} / {plant.maxPower} МВт
                  </span>
                </div>
                <Progress value={(plant.power / plant.maxPower) * 100} />
              </div>

              {/* Battery Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-chart-3" />
                    <span className="text-sm font-medium">Акумулятори</span>
                  </div>
                  <span className="text-sm font-bold">{plant.batteryLevel}%</span>
                </div>
                <Progress value={plant.batteryLevel} />
              </div>

              {/* Efficiency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                    <span className="text-sm font-medium">Ефективність</span>
                  </div>
                  <span className="text-sm font-bold">{plant.efficiency}%</span>
                </div>
                <Progress value={plant.efficiency} />
              </div>

              {/* Alerts */}
              {plant.alerts > 0 && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">{plant.alerts} активних сповіщень</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Деталі
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Управління
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
