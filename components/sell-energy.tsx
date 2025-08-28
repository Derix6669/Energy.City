"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Zap, Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SellEnergyProps {
  plantData: {
    id: string
    name: string
    energyProduced: number
    energySold: number
  }
}

export function SellEnergy({ plantData }: SellEnergyProps) {
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")
  const [quality, setQuality] = useState("")
  const [availability, setAvailability] = useState("")
  const [description, setDescription] = useState("")

  // Mock current listings
  const [listings, setListings] = useState([
    {
      id: "1",
      amount: 500,
      price: 1.25,
      quality: "Високоякісна",
      availability: "Зараз",
      status: "Активна",
      views: 12,
      inquiries: 3,
    },
    {
      id: "2",
      amount: 300,
      price: 1.15,
      quality: "Стандартна",
      availability: "Через 1 годину",
      status: "Активна",
      views: 8,
      inquiries: 1,
    },
  ])

  const availableEnergy = plantData.energyProduced - plantData.energySold

  const handleCreateListing = () => {
    if (!amount || !price || !quality || !availability) return

    const newListing = {
      id: Date.now().toString(),
      amount: Number.parseInt(amount),
      price: Number.parseFloat(price),
      quality,
      availability,
      status: "Активна",
      views: 0,
      inquiries: 0,
    }

    setListings([...listings, newListing])
    setAmount("")
    setPrice("")
    setQuality("")
    setAvailability("")
    setDescription("")
  }

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter((listing) => listing.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Listing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Створити Нову Пропозицію
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Доступно для продажу</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Zap className="h-4 w-4" />
                {availableEnergy.toLocaleString()} кВт·год
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Кількість (кВт·год)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={availableEnergy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Ціна (₴/кВт·год)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="1.25"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Якість енергії</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть якість" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Стандартна">Стандартна</SelectItem>
                    <SelectItem value="Високоякісна">Високоякісна</SelectItem>
                    <SelectItem value="Преміум">Преміум</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Доступність</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Коли доступно" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Зараз">Зараз</SelectItem>
                    <SelectItem value="Через 1 годину">Через 1 годину</SelectItem>
                    <SelectItem value="Через 2 години">Через 2 години</SelectItem>
                    <SelectItem value="Завтра">Завтра</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Опис (необов'язково)</Label>
              <Textarea
                id="description"
                placeholder="Додаткова інформація про енергію..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {amount && price && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Очікуваний дохід</p>
                <p className="text-lg font-semibold text-primary">
                  {(Number.parseInt(amount || "0") * Number.parseFloat(price || "0")).toLocaleString()} ₴
                </p>
              </div>
            )}

            <Button onClick={handleCreateListing} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Створити Пропозицію
            </Button>
          </CardContent>
        </Card>

        {/* Current Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Поточні Пропозиції
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {listing.amount.toLocaleString()} кВт·год
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.price} ₴/кВт·год • {listing.quality}
                      </p>
                    </div>
                    <Badge variant={listing.status === "Активна" ? "default" : "secondary"}>{listing.status}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Доступність</p>
                      <p>{listing.availability}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Перегляди</p>
                      <p>{listing.views}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Запити</p>
                      <p>{listing.inquiries}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-primary">{(listing.amount * listing.price).toLocaleString()} ₴</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteListing(listing.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {listings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>У вас немає активних пропозицій</p>
                  <p className="text-sm">Створіть нову пропозицію для продажу енергії</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
