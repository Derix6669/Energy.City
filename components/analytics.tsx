"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Zap,
  FileText,
  Target,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Pie,
  Cell,
} from "recharts"

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

interface AnalyticsProps {
  plants: Plant[]
}

export function Analytics({ plants }: AnalyticsProps) {
  // Mock analytics data
  const powerTrendData = [
    { time: "00:00", power: 1200, efficiency: 85 },
    { time: "04:00", power: 1100, efficiency: 87 },
    { time: "08:00", power: 1800, efficiency: 92 },
    { time: "12:00", power: 2200, efficiency: 89 },
    { time: "16:00", power: 2400, efficiency: 91 },
    { time: "20:00", power: 1900, efficiency: 88 },
  ]

  const energyDistribution = [
    { name: "Завод №1", value: 35, color: "#6366f1" },
    { name: "Завод №2", value: 28, color: "#10b981" },
    { name: "Завод №3", value: 0, color: "#f59e0b" },
    { name: "Завод №4", value: 37, color: "#ef4444" },
  ]

  const tradingData = [
    { month: "Січ", revenue: 2400000, costs: 1800000, profit: 600000 },
    { month: "Лют", revenue: 2200000, costs: 1700000, profit: 500000 },
    { month: "Бер", revenue: 2800000, costs: 1900000, profit: 900000 },
    { month: "Кві", revenue: 3200000, costs: 2100000, profit: 1100000 },
    { month: "Тра", revenue: 2900000, costs: 2000000, profit: 900000 },
    { month: "Чер", revenue: 3100000, costs: 2200000, profit: 900000 },
  ]

  const kpiData = {
    totalRevenue: 16600000,
    totalProfit: 4800000,
    avgEfficiency: 89.2,
    uptime: 94.5,
    co2Reduction: 12.8,
    energySaved: 2340,
  }

  const performanceMetrics = [
    { plant: "Завод №1", uptime: 98.2, efficiency: 87, maintenance: 5 },
    { plant: "Завод №2", uptime: 96.8, efficiency: 92, maintenance: 3 },
    { plant: "Завод №3", uptime: 45.0, efficiency: 0, maintenance: 15 },
    { plant: "Завод №4", uptime: 99.1, efficiency: 89, maintenance: 2 },
  ]

  const handleExport = async (format: "csv" | "pdf" | "excel") => {
    try {
      const exportData = {
        kpiData,
        powerTrendData,
        tradingData,
        performanceMetrics,
      }

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format,
          data: exportData,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url

        const timestamp = new Date().toISOString().split("T")[0]
        const extensions = { csv: "csv", pdf: "pdf", excel: "xlsx" }
        link.download = `analytics-report-${timestamp}.${extensions[format]}`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        console.error("Помилка експорту:", await response.text())
      }
    } catch (error) {
      console.error("Помилка експорту:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Аналітика та Звіти</h2>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Тиждень</SelectItem>
              <SelectItem value="month">Місяць</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Рік</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальний Дохід</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(kpiData.totalRevenue / 1000000).toFixed(1)}М ₴</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-chart-3" />
              +12.5% від минулого періоду
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Чистий Прибуток</CardTitle>
            <Target className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(kpiData.totalProfit / 1000000).toFixed(1)}М ₴</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-chart-3" />
              +8.3% від минулого періоду
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Середня Ефективність</CardTitle>
            <BarChart3 className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.avgEfficiency}%</div>
            <Progress value={kpiData.avgEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Час Роботи</CardTitle>
            <Calendar className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.uptime}%</div>
            <Progress value={kpiData.uptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Зменшення CO₂</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.co2Reduction}%</div>
            <p className="text-xs text-muted-foreground">Порівняно з минулим роком</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заощаджена Енергія</CardTitle>
            <Zap className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.energySaved} МВт·г</div>
            <p className="text-xs text-muted-foreground">За поточний період</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Тренд Потужності та Ефективності</CardTitle>
            <CardDescription>Динаміка за останні 24 години</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={powerTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Потужність (МВт)"
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Ефективність (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Розподіл Енергії по Заводах</CardTitle>
            <CardDescription>Частка кожного заводу в загальному виробництві</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Pie
                data={energyDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {energyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Фінансова Аналітика Торгівлі</CardTitle>
          <CardDescription>Доходи, витрати та прибуток за останні 6 місяців</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={tradingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}М ₴`, ""]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Доходи" />
              <Bar dataKey="costs" fill="hsl(var(--chart-4))" name="Витрати" />
              <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Прибуток" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Показники Продуктивності Заводів</CardTitle>
          <CardDescription>Детальна статистика по кожному заводу</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{metric.plant}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Час роботи: {metric.uptime}%</span>
                    <span>Ефективність: {metric.efficiency}%</span>
                    <span>ТО за місяць: {metric.maintenance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={metric.uptime > 95 ? "secondary" : metric.uptime > 80 ? "outline" : "destructive"}>
                    {metric.uptime > 95 ? "Відмінно" : metric.uptime > 80 ? "Добре" : "Потребує уваги"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Експорт Звітів</CardTitle>
          <CardDescription>Завантажити детальні звіти в різних форматах</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExport("pdf")}
            >
              <FileText className="h-4 w-4" />
              Звіт PDF
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExport("excel")}
            >
              <BarChart3 className="h-4 w-4" />
              Excel таблиця
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExport("csv")}
            >
              <Download className="h-4 w-4" />
              CSV дані
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
