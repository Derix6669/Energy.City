"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, DollarSign, Users, ArrowUpDown, Clock } from "lucide-react"

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

interface EnergyTradingProps {
  plants: Plant[]
}

export function EnergyTrading({ plants }: EnergyTradingProps) {
  // Mock trading data
  const tradingOffers = [
    {
      id: 1,
      seller: "Завод №1 - Донецьк",
      buyer: "Завод №3 - Запоріжжя",
      amount: 50,
      price: 45.5,
      status: "active",
      timeLeft: "2г 15хв",
    },
    {
      id: 2,
      seller: "Завод №2 - Кривий Ріг",
      buyer: "Завод №4 - Маріуполь",
      amount: 75,
      price: 42.0,
      status: "pending",
      timeLeft: "45хв",
    },
    {
      id: 3,
      seller: "Завод №4 - Маріуполь",
      buyer: "Завод №1 - Донецьк",
      amount: 30,
      price: 48.2,
      status: "completed",
      timeLeft: "Завершено",
    },
  ]

  const marketStats = {
    avgPrice: 45.2,
    totalVolume: 1250,
    activeDeals: 12,
    completedToday: 8,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Торгівля Електроенергією</h2>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Створити угоду
        </Button>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Середня Ціна</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.avgPrice} ₴/МВт·г</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-chart-3" />
              +2.3% від вчора
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Обсяг Торгів</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.totalVolume} МВт·г</div>
            <p className="text-xs text-muted-foreground">За сьогодні</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активні Угоди</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">В процесі виконання</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено Сьогодні</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Успішних угод</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Trading Offers */}
      <Card>
        <CardHeader>
          <CardTitle>Поточні Торгові Пропозиції</CardTitle>
          <CardDescription>Активні угоди купівлі-продажу електроенергії</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradingOffers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{offer.seller}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{offer.buyer}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {offer.amount} МВт·г за {offer.price} ₴/МВт·г
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{offer.timeLeft}</div>
                    <Badge
                      variant={
                        offer.status === "active" ? "secondary" : offer.status === "pending" ? "outline" : "default"
                      }
                    >
                      {offer.status === "active" ? "Активна" : offer.status === "pending" ? "Очікує" : "Завершена"}
                    </Badge>
                  </div>
                  {offer.status !== "completed" && (
                    <Button variant="outline" size="sm">
                      Деталі
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Deal */}
      <Card>
        <CardHeader>
          <CardTitle>Створити Нову Угоду</CardTitle>
          <CardDescription>Запропонувати купівлю або продаж електроенергії</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Кількість (МВт·г)</Label>
              <Input id="amount" placeholder="Введіть кількість" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Ціна (₴/МВт·г)</Label>
              <Input id="price" placeholder="Введіть ціну" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              Продати
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <TrendingDown className="h-4 w-4 mr-2" />
              Купити
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
