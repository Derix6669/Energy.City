"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Settings, AlertTriangle, Battery, Zap, Wrench } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EquipmentManagerProps {
  plantId: string
}

export function EquipmentManager({ plantId }: EquipmentManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
  })

  // Mock equipment data
  const [equipment, setEquipment] = useState([
    {
      id: "1",
      name: "Генератор №1",
      type: "generator",
      capacity: 500, // MW
      currentOutput: 450,
      efficiency: 92,
      status: "online",
      location: "Блок А",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      alerts: 0,
    },
    {
      id: "2",
      name: "Акумулятор №1",
      type: "battery",
      capacity: 200, // MWh
      currentCharge: 156,
      efficiency: 95,
      status: "charging",
      location: "Блок Б",
      lastMaintenance: "2024-02-01",
      nextMaintenance: "2024-05-01",
      alerts: 0,
    },
    {
      id: "3",
      name: "Генератор №2",
      type: "generator",
      capacity: 600,
      currentOutput: 0,
      efficiency: 0,
      status: "maintenance",
      location: "Блок А",
      lastMaintenance: "2024-02-20",
      nextMaintenance: "2024-02-25",
      alerts: 2,
    },
    {
      id: "4",
      name: "Акумулятор №2",
      type: "battery",
      capacity: 150,
      currentCharge: 120,
      efficiency: 88,
      status: "discharging",
      location: "Блок В",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-04-20",
      alerts: 1,
    },
  ])

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.type || !newEquipment.capacity) return

    const equipment_item = {
      id: Date.now().toString(),
      name: newEquipment.name,
      type: newEquipment.type,
      capacity: Number.parseInt(newEquipment.capacity),
      currentOutput: newEquipment.type === "generator" ? 0 : undefined,
      currentCharge: newEquipment.type === "battery" ? 0 : undefined,
      efficiency: 0,
      status: "offline",
      location: newEquipment.location || "Не вказано",
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      alerts: 0,
    }

    setEquipment([...equipment, equipment_item])
    setNewEquipment({ name: "", type: "", capacity: "", location: "" })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "charging":
      case "discharging":
        return "default"
      case "maintenance":
        return "secondary"
      case "offline":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Онлайн"
      case "charging":
        return "Заряджається"
      case "discharging":
        return "Розряджається"
      case "maintenance":
        return "Обслуговування"
      case "offline":
        return "Офлайн"
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "generator":
        return <Zap className="h-4 w-4" />
      case "battery":
        return <Battery className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "generator":
        return "Генератор"
      case "battery":
        return "Акумулятор"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Управління Обладнанням
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Додати Обладнання
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Додати Нове Обладнання</DialogTitle>
                  <DialogDescription>Додайте новий прилад до вашого заводу</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Назва обладнання</Label>
                    <Input
                      id="name"
                      placeholder="Генератор №3"
                      value={newEquipment.name}
                      onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Тип обладнання</Label>
                    <Select
                      value={newEquipment.type}
                      onValueChange={(value) => setNewEquipment({ ...newEquipment, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="generator">Генератор</SelectItem>
                        <SelectItem value="battery">Акумулятор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Потужність ({newEquipment.type === "battery" ? "МВт·год" : "МВт"})</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="500"
                      value={newEquipment.capacity}
                      onChange={(e) => setNewEquipment({ ...newEquipment, capacity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Розташування</Label>
                    <Input
                      id="location"
                      placeholder="Блок А"
                      value={newEquipment.location}
                      onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddEquipment} className="w-full">
                    Додати Обладнання
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    {item.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getTypeText(item.type)} • {item.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                  {item.alerts > 0 && (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {item.alerts}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Потужність</p>
                  <p className="font-semibold">
                    {item.capacity} {item.type === "battery" ? "МВт·год" : "МВт"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ефективність</p>
                  <p className="font-semibold">{item.efficiency}%</p>
                </div>
              </div>

              {item.type === "generator" && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Поточний вихід</span>
                    <span>{item.currentOutput} МВт</span>
                  </div>
                  <Progress value={(item.currentOutput! / item.capacity) * 100} />
                </div>
              )}

              {item.type === "battery" && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Заряд</span>
                    <span>{item.currentCharge} МВт·год</span>
                  </div>
                  <Progress value={(item.currentCharge! / item.capacity) * 100} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Останнє ТО</p>
                  <p>{new Date(item.lastMaintenance).toLocaleDateString("uk-UA")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Наступне ТО</p>
                  <p>{new Date(item.nextMaintenance).toLocaleDateString("uk-UA")}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Wrench className="h-4 w-4 mr-2" />
                  Налаштування
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Деталі
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
