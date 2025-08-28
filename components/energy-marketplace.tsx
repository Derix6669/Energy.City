"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Zap, MapPin, Brain } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIRecommendations } from "@/components/ai-recommendations"

interface EnergyMarketplaceProps {
  plantId: string
}

export function EnergyMarketplace({ plantId }: EnergyMarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  // Mock energy offers with extended data for AI
  const energyOffers = [
    {
      id: "1",
      seller: "Завод №3 - Запоріжжя",
      amount: 500,
      price: 1.2,
      location: "Запоріжжя",
      distance: 45,
      availability: "Зараз",
      quality: "Високоякісна",
      type: "Вугільна",
      reliability: 92,
      historicalPerformance: 88,
      carbonFootprint: 320,
    },
    {
      id: "2",
      seller: "Завод №4 - Маріуполь",
      amount: 1200,
      price: 1.1,
      location: "Маріуполь",
      distance: 78,
      availability: "Через 2 години",
      quality: "Стандартна",
      type: "Вугільна",
      reliability: 85,
      historicalPerformance: 90,
      carbonFootprint: 380,
    },
    {
      id: "3",
      seller: "Завод №1 - Донецьк",
      amount: 800,
      price: 1.35,
      location: "Донецьк",
      distance: 23,
      availability: "Зараз",
      quality: "Преміум",
      type: "Вугільна",
      reliability: 95,
      historicalPerformance: 94,
      carbonFootprint: 280,
    },
    {
      id: "4",
      seller: "Завод №5 - Дніпро",
      amount: 300,
      price: 1.0,
      location: "Дніпро",
      distance: 120,
      availability: "Завтра",
      quality: "Стандартна",
      type: "Вугільна",
      reliability: 78,
      historicalPerformance: 82,
      carbonFootprint: 420,
    },
  ]

  const filteredOffers = energyOffers.filter((offer) => {
    const matchesSearch =
      offer.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && offer.price <= 1.1) ||
      (priceFilter === "medium" && offer.price > 1.1 && offer.price <= 1.3) ||
      (priceFilter === "high" && offer.price > 1.3)
    const matchesLocation = locationFilter === "all" || offer.location === locationFilter

    return matchesSearch && matchesPrice && matchesLocation
  })

  // Mock user preferences
  const userPreferences = {
    prioritizeCost: true,
    prioritizeReliability: false,
    prioritizeEcoFriendly: false,
    maxDistance: 150,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Пошук Енергії для Покупки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Пошук</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Назва заводу або місто..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ціновий діапазон</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Всі ціни" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі ціни</SelectItem>
                  <SelectItem value="low">До 1.1 ₴/кВт·год</SelectItem>
                  <SelectItem value="medium">1.1-1.3 ₴/кВт·год</SelectItem>
                  <SelectItem value="high">Понад 1.3 ₴/кВт·год</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Локація</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Всі міста" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі міста</SelectItem>
                  <SelectItem value="Донецьк">Донецьк</SelectItem>
                  <SelectItem value="Запоріжжя">Запоріжжя</SelectItem>
                  <SelectItem value="Маріуполь">Маріуполь</SelectItem>
                  <SelectItem value="Дніпро">Дніпро</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Застосувати
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marketplace">Всі Пропозиції</TabsTrigger>
          <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            ШІ Рекомендації
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{offer.seller}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        {offer.location} • {offer.distance} км
                      </div>
                    </div>
                    <Badge variant={offer.availability === "Зараз" ? "default" : "secondary"}>
                      {offer.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Кількість</p>
                        <p className="text-lg font-semibold flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          {offer.amount.toLocaleString()} кВт·год
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ціна</p>
                        <p className="text-lg font-semibold text-primary">{offer.price} ₴/кВт·год</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Якість:</span>
                      <Badge variant="outline">{offer.quality}</Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Тип:</span>
                      <span>{offer.type}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Загальна вартість:</span>
                      <span className="font-semibold">{(offer.amount * offer.price).toLocaleString()} ₴</span>
                    </div>

                    <Button className="w-full">Купити Енергію</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Не знайдено пропозицій за вашими критеріями пошуку.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-recommendations">
          <AIRecommendations
            offers={filteredOffers}
            plantLocation="Кривий Ріг"
            currentEnergyNeed={1000}
            budget={1500}
            preferences={userPreferences}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
