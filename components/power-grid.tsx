"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Power, ArrowRight, ArrowLeft, Activity, AlertCircle } from "lucide-react"

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

interface PowerGridProps {
  plants: Plant[]
}

export function PowerGrid({ plants }: PowerGridProps) {
  // Mock grid connections data
  const gridConnections = [
    { from: 1, to: 2, power: 45, direction: "export" },
    { from: 2, to: 4, power: 32, direction: "export" },
    { from: 4, to: 1, power: 28, direction: "export" },
    { from: 1, to: 3, power: 0, direction: "none" }, // Plant 3 is in maintenance
  ]

  const totalGridLoad = plants.reduce((sum, plant) => sum + plant.power, 0)
  const gridStability = 94 // Mock stability percentage
  const powerLosses = 12 // Mock power losses in MW

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управління Електромережею</h2>
        <div className="flex gap-2">
          <Badge variant={gridStability > 90 ? "secondary" : "destructive"}>Стабільність: {gridStability}%</Badge>
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Аналіз мережі
          </Button>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5 text-primary" />
              Загальне Навантаження
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{totalGridLoad} МВт</div>
            <p className="text-sm text-muted-foreground mt-1">Поточне споживання мережі</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-3" />
              Стабільність Мережі
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">{gridStability}%</div>
            <Progress value={gridStability} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">Операційна стабільність</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-chart-4" />
              Втрати Потужності
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">{powerLosses} МВт</div>
            <p className="text-sm text-muted-foreground mt-1">Втрати при передачі</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Міжзаводські З'єднання</CardTitle>
          <CardDescription>Поточні потоки електроенергії між заводами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gridConnections.map((connection, index) => {
              const fromPlant = plants.find((p) => p.id === connection.from)
              const toPlant = plants.find((p) => p.id === connection.to)

              if (!fromPlant || !toPlant) return null

              return (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{fromPlant.name}</div>
                    <div className="flex items-center gap-2">
                      {connection.direction === "export" ? (
                        <ArrowRight className="h-4 w-4 text-chart-2" />
                      ) : connection.direction === "import" ? (
                        <ArrowLeft className="h-4 w-4 text-chart-3" />
                      ) : (
                        <div className="h-4 w-4 bg-muted rounded-full" />
                      )}
                      <span className="text-sm text-muted-foreground">{connection.power} МВт</span>
                    </div>
                    <div className="text-sm font-medium">{toPlant.name}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={connection.power > 0 ? "secondary" : "outline"}>
                      {connection.power > 0 ? "Активне" : "Неактивне"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Налаштувати
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grid Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Схема Мережі</CardTitle>
          <CardDescription>Візуальне представлення електромережі</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            {plants.map((plant) => (
              <div key={plant.id} className="text-center space-y-2">
                <div
                  className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center ${
                    plant.status === "online"
                      ? "bg-chart-3/20 border-2 border-chart-3"
                      : plant.status === "maintenance"
                        ? "bg-chart-2/20 border-2 border-chart-2"
                        : "bg-chart-4/20 border-2 border-chart-4"
                  }`}
                >
                  <Power
                    className={`h-8 w-8 ${
                      plant.status === "online"
                        ? "text-chart-3"
                        : plant.status === "maintenance"
                          ? "text-chart-2"
                          : "text-chart-4"
                    }`}
                  />
                </div>
                <div className="text-xs font-medium">{plant.name.split(" - ")[1]}</div>
                <div className="text-xs text-muted-foreground">{plant.power} МВт</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
