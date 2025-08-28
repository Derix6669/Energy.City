"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Factory, LogOut, Zap, Battery, TrendingUp, ShoppingCart, DollarSign, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types/auth"
import { EnergyMarketplace } from "@/components/energy-marketplace"
import { SellEnergy } from "@/components/sell-energy"
import { EquipmentManager } from "@/components/equipment-manager"

interface PlantDashboardProps {
  user: User
}

export function PlantDashboard({ user }: PlantDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { logout } = useAuth()

  // Mock data for the current plant
  const plantData = {
    id: user.plantId || "1",
    name: user.name,
    status: "online",
    currentPower: 720,
    maxPower: 900,
    efficiency: 92,
    batteryLevel: 78,
    alerts: 1,
    energyProduced: 15420, // kWh today
    energySold: 8200, // kWh today
    revenue: 12300, // UAH today
    equipmentCount: 12,
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Factory className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">{plantData.name}</h1>
              <p className="text-sm text-muted-foreground">Панель Управління Заводом</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={plantData.alerts > 0 ? "destructive" : "secondary"}>{plantData.alerts} Сповіщень</Badge>
            <Badge variant={plantData.status === "online" ? "default" : "secondary"}>
              {plantData.status === "online" ? "Онлайн" : "Офлайн"}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Вітаємо,</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Вихід
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Поточна Потужність</CardTitle>
              <Zap className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantData.currentPower} МВт</div>
              <p className="text-xs text-muted-foreground">з {plantData.maxPower} МВт максимальної</p>
              <Progress value={(plantData.currentPower / plantData.maxPower) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Рівень Акумуляторів</CardTitle>
              <Battery className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantData.batteryLevel}%</div>
              <p className="text-xs text-muted-foreground">Загальний заряд системи</p>
              <Progress value={plantData.batteryLevel} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ефективність</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantData.efficiency}%</div>
              <p className="text-xs text-muted-foreground">Операційна ефективність</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Дохід Сьогодні</CardTitle>
              <DollarSign className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantData.revenue.toLocaleString()} ₴</div>
              <p className="text-xs text-muted-foreground">Продано {plantData.energySold} кВт·год</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Огляд
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Купити Енергію
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Продати Енергію
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Обладнання
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Виробництво Енергії</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Вироблено сьогодні</span>
                      <span className="font-medium">{plantData.energyProduced.toLocaleString()} кВт·год</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Продано сьогодні</span>
                      <span className="font-medium">{plantData.energySold.toLocaleString()} кВт·год</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Залишок</span>
                      <span className="font-medium">
                        {(plantData.energyProduced - plantData.energySold).toLocaleString()} кВт·год
                      </span>
                    </div>
                    <Progress value={(plantData.energySold / plantData.energyProduced) * 100} className="mt-4" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round((plantData.energySold / plantData.energyProduced) * 100)}% енергії продано
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Стан Обладнання</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Всього приладів</span>
                      <span className="font-medium">{plantData.equipmentCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Активних</span>
                      <span className="font-medium text-chart-3">{plantData.equipmentCount - 1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">На обслуговуванні</span>
                      <span className="font-medium text-chart-4">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Сповіщення</span>
                      <Badge variant={plantData.alerts > 0 ? "destructive" : "secondary"}>{plantData.alerts}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <EnergyMarketplace plantId={plantData.id} />
          </TabsContent>

          <TabsContent value="sell">
            <SellEnergy plantData={plantData} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentManager plantId={plantData.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
