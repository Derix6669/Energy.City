"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Battery, TrendingUp, Zap } from "lucide-react"

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
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
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
        return "Невідомо"
    }
  }

  const getBatteryColor = (level: number) => {
    if (level >= 80) return "text-green-500"
    if (level >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-2xl font-bold">Огляд Заводів</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Поточний стан та продуктивність</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {plants.map((plant) => (
          <Card key={plant.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm md:text-base font-medium truncate" title={plant.name}>
                    {plant.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(plant.status)}`} />
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(plant.status)}
                    </Badge>
                  </div>
                </div>
                {plant.alerts > 0 && (
                  <div className="flex items-center gap-1 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-medium">{plant.alerts}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Power Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Потужність:</span>
                  <span className="font-medium">{plant.power} / {plant.maxPower} МВт</span>
                </div>
                <Progress value={(plant.power / plant.maxPower) * 100} className="h-2" />
              </div>

              {/* Efficiency */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Ефективність
                </span>
                <span className="font-medium">{plant.efficiency}%</span>
              </div>

              {/* Battery Level */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  Батарея
                </span>
                <span className={`font-medium ${getBatteryColor(plant.batteryLevel)}`}>
                  {plant.batteryLevel}%
                </span>
              </div>

              {/* Status Indicator */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Статус системи</span>
                  <div className="flex items-center gap-1">
                    <Zap className={`h-3 w-3 ${plant.status === "online" ? "text-green-500" : "text-muted-foreground"}`} />
                    <span className={plant.status === "online" ? "text-green-600" : "text-muted-foreground"}>
                      {plant.status === "online" ? "Активна" : "Неактивна"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Загальна Потужність</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {plants.reduce((sum, plant) => sum + plant.power, 0)} МВт
            </div>
            <p className="text-xs text-muted-foreground">
              з {plants.reduce((sum, plant) => sum + plant.maxPower, 0)} МВт максимальної
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Середня Ефективність</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {Math.round(plants.reduce((sum, plant) => sum + plant.efficiency, 0) / plants.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Операційна ефективність</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Активні Заводи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {plants.filter((plant) => plant.status === "online").length}
            </div>
            <p className="text-xs text-muted-foreground">з {plants.length} загалом</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Сповіщення</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-red-500">
              {plants.reduce((sum, plant) => sum + plant.alerts, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Активних попереджень</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
