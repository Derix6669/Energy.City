"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, TrendingUp, AlertTriangle, Factory } from "lucide-react"
import { PlantOverview } from "@/components/plant-overview"
import { PowerGrid } from "@/components/power-grid"
import { EnergyTrading } from "@/components/energy-trading"
import { EquipmentMonitoring } from "@/components/equipment-monitoring"
import { Analytics } from "@/components/analytics"
import { AdminSidebar } from "@/components/admin-sidebar"
import { HierarchicalTree } from "@/components/hierarchical-tree"
import { NotificationCenter } from "@/components/notification-center"
import { NetworkGraph } from "@/components/network-graph"
import { PlantMap } from "@/components/plant-map"

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const plants = [
    {
      id: 1,
      name: "Завод №1 - Донецьк",
      status: "online",
      power: 850,
      maxPower: 1000,
      efficiency: 87,
      batteryLevel: 65,
      alerts: 0,
    },
    {
      id: 2,
      name: "Завод №2 - Кривий Ріг",
      status: "online",
      power: 720,
      maxPower: 900,
      efficiency: 92,
      batteryLevel: 78,
      alerts: 1,
    },
    {
      id: 3,
      name: "Завод №3 - Запоріжжя",
      status: "maintenance",
      power: 0,
      maxPower: 1200,
      efficiency: 0,
      batteryLevel: 45,
      alerts: 3,
    },
    {
      id: 4,
      name: "Завод №4 - Маріуполь",
      status: "online",
      power: 950,
      maxPower: 1100,
      efficiency: 89,
      batteryLevel: 82,
      alerts: 0,
    },
  ]

  const totalPower = plants.reduce((sum, plant) => sum + plant.power, 0)
  const totalCapacity = plants.reduce((sum, plant) => sum + plant.maxPower, 0)
  const onlinePlants = plants.filter((plant) => plant.status === "online").length
  const totalAlerts = 4 // Критичні: 2, Попередження: 2

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <PlantOverview plants={plants} />
      case "hierarchy":
        return <HierarchicalTree />
      case "network":
        return <NetworkGraph />
      case "map":
        return <PlantMap />
      case "notifications":
        return <NotificationCenter />
      case "grid":
        return <PowerGrid plants={plants} />
      case "trading":
        return <EnergyTrading plants={plants} />
      case "equipment":
        return <EquipmentMonitoring plants={plants} />
      case "analytics":
        return <Analytics plants={plants} />
      default:
        return <PlantOverview plants={plants} />
    }
  }

  const getSectionTitle = () => {
    const titles = {
      overview: "Огляд Заводів",
      hierarchy: "Ієрархічне Дерево",
      network: "Візуалізація Мережі",
      map: "Карта Заводів",
      notifications: "Центр Сповіщень",
      grid: "Управління Електромережею",
      trading: "Торгівля Енергією",
      equipment: "Моніторинг Обладнання",
      analytics: "Аналітика та Звіти",
    }
    return titles[activeSection as keyof typeof titles] || "Огляд Заводів"
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} totalAlerts={totalAlerts} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-bold">{getSectionTitle()}</h1>
          <p className="text-sm text-muted-foreground mt-1">Централізоване управління мережею вугільних заводів</p>
        </header>

        {/* Key Metrics - показуємо тільки на головній сторінці */}
        {activeSection === "overview" && (
          <div className="p-6 border-b border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Загальна Потужність</CardTitle>
                  <Zap className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPower} МВт</div>
                  <p className="text-xs text-muted-foreground">з {totalCapacity} МВт максимальної</p>
                  <Progress value={(totalPower / totalCapacity) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активні Заводи</CardTitle>
                  <Factory className="h-4 w-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{onlinePlants}</div>
                  <p className="text-xs text-muted-foreground">з {plants.length} загалом</p>
                  <Progress value={(onlinePlants / plants.length) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Середня Ефективність</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(plants.reduce((sum, plant) => sum + plant.efficiency, 0) / plants.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Операційна ефективність</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Сповіщення</CardTitle>
                  <AlertTriangle className={`h-4 w-4 ${totalAlerts > 0 ? "text-chart-4" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAlerts}</div>
                  <p className="text-xs text-muted-foreground">Активних попереджень</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
