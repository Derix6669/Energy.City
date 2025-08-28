"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, TrendingDown, Star, MapPin, DollarSign, Lightbulb, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyOffer {
  id: string
  seller: string
  amount: number
  price: number
  location: string
  distance: number
  availability: string
  quality: string
  type: string
  reliability: number // 0-100
  historicalPerformance: number // 0-100
  carbonFootprint: number // kg CO2/MWh
}

interface AIRecommendation {
  offerId: string
  score: number // 0-100
  rank: number
  reasons: string[]
  pros: string[]
  cons: string[]
  costSavings?: number
  riskLevel: "low" | "medium" | "high"
  recommendation: "highly_recommended" | "recommended" | "consider" | "not_recommended"
}

interface AIRecommendationsProps {
  offers: EnergyOffer[]
  plantLocation: string
  currentEnergyNeed: number
  budget: number
  preferences: {
    prioritizeCost: boolean
    prioritizeReliability: boolean
    prioritizeEcoFriendly: boolean
    maxDistance: number
  }
}

export function AIRecommendations({
  offers,
  plantLocation,
  currentEnergyNeed,
  budget,
  preferences,
}: AIRecommendationsProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)

  // AI Algorithm for generating recommendations
  const recommendations: AIRecommendation[] = useMemo(() => {
    return offers
      .map((offer) => {
        let score = 50 // Base score

        // Price factor (30% weight)
        const priceScore = Math.max(0, 100 - (offer.price - 1.0) * 100)
        score += priceScore * 0.3

        // Distance factor (20% weight)
        const distanceScore = Math.max(0, 100 - (offer.distance / preferences.maxDistance) * 100)
        score += distanceScore * 0.2

        // Reliability factor (25% weight)
        score += offer.reliability * 0.25

        // Historical performance factor (15% weight)
        score += offer.historicalPerformance * 0.15

        // Environmental factor (10% weight)
        const ecoScore = Math.max(0, 100 - (offer.carbonFootprint / 500) * 100)
        score += ecoScore * 0.1

        // Apply user preferences
        if (preferences.prioritizeCost) {
          score += priceScore * 0.2
        }
        if (preferences.prioritizeReliability) {
          score += offer.reliability * 0.15
        }
        if (preferences.prioritizeEcoFriendly) {
          score += ecoScore * 0.15
        }

        // Availability bonus
        if (offer.availability === "Зараз") {
          score += 10
        }

        // Quality bonus
        if (offer.quality === "Преміум") {
          score += 15
        } else if (offer.quality === "Високоякісна") {
          score += 10
        }

        score = Math.min(100, Math.max(0, score))

        // Generate reasons and pros/cons
        const reasons = []
        const pros = []
        const cons = []

        if (offer.price < 1.2) {
          reasons.push("Конкурентна ціна")
          pros.push(`Низька ціна: ${offer.price} ₴/кВт·год`)
        }
        if (offer.distance < 50) {
          reasons.push("Близька відстань")
          pros.push(`Коротка відстань доставки: ${offer.distance} км`)
        }
        if (offer.reliability > 85) {
          reasons.push("Висока надійність постачальника")
          pros.push(`Надійність: ${offer.reliability}%`)
        }
        if (offer.availability === "Зараз") {
          reasons.push("Негайна доступність")
          pros.push("Доступно зараз")
        }

        if (offer.price > 1.3) {
          cons.push(`Висока ціна: ${offer.price} ₴/кВт·год`)
        }
        if (offer.distance > 100) {
          cons.push(`Велика відстань: ${offer.distance} км`)
        }
        if (offer.reliability < 70) {
          cons.push(`Низька надійність: ${offer.reliability}%`)
        }

        // Determine recommendation level
        let recommendation: AIRecommendation["recommendation"]
        if (score >= 80) recommendation = "highly_recommended"
        else if (score >= 65) recommendation = "recommended"
        else if (score >= 50) recommendation = "consider"
        else recommendation = "not_recommended"

        // Calculate risk level
        let riskLevel: AIRecommendation["riskLevel"]
        if (offer.reliability > 85 && offer.distance < 50) riskLevel = "low"
        else if (offer.reliability > 70 && offer.distance < 100) riskLevel = "medium"
        else riskLevel = "high"

        // Calculate potential cost savings
        const averagePrice = offers.reduce((sum, o) => sum + o.price, 0) / offers.length
        const costSavings = offer.price < averagePrice ? (averagePrice - offer.price) * offer.amount : undefined

        return {
          offerId: offer.id,
          score: Math.round(score),
          rank: 0, // Will be set after sorting
          reasons,
          pros,
          cons,
          costSavings,
          riskLevel,
          recommendation,
        }
      })
      .sort((a, b) => b.score - a.score)
      .map((rec, index) => ({ ...rec, rank: index + 1 }))
  }, [offers, preferences])

  const getRecommendationColor = (recommendation: AIRecommendation["recommendation"]) => {
    switch (recommendation) {
      case "highly_recommended":
        return "text-green-600 bg-green-50 border-green-200"
      case "recommended":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "consider":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "not_recommended":
        return "text-red-600 bg-red-50 border-red-200"
    }
  }

  const getRecommendationText = (recommendation: AIRecommendation["recommendation"]) => {
    switch (recommendation) {
      case "highly_recommended":
        return "Дуже рекомендується"
      case "recommended":
        return "Рекомендується"
      case "consider":
        return "Варто розглянути"
      case "not_recommended":
        return "Не рекомендується"
    }
  }

  const getRiskColor = (risk: AIRecommendation["riskLevel"]) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
    }
  }

  const getRiskText = (risk: AIRecommendation["riskLevel"]) => {
    switch (risk) {
      case "low":
        return "Низький ризик"
      case "medium":
        return "Середній ризик"
      case "high":
        return "Високий ризик"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            ШІ Рекомендації Тарифів
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Аналіз базується на ціні, відстані, надійності, історичних даних та ваших преференціях
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{recommendations.length}</div>
              <div className="text-sm text-muted-foreground">Проаналізовано пропозицій</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {recommendations.filter((r) => r.recommendation === "highly_recommended").length}
              </div>
              <div className="text-sm text-muted-foreground">Дуже рекомендується</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {recommendations.filter((r) => r.costSavings && r.costSavings > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">З економією коштів</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const offer = offers.find((o) => o.id === rec.offerId)!
          const isSelected = selectedRecommendation === rec.offerId

          return (
            <Card
              key={rec.offerId}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-md",
                isSelected && "ring-2 ring-primary",
                getRecommendationColor(rec.recommendation),
              )}
              onClick={() => setSelectedRecommendation(isSelected ? null : rec.offerId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {rec.rank}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{offer.seller}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {offer.location} • {offer.distance} км
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {offer.price} ₴/кВт·год
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{rec.score}/100</span>
                    </div>
                    <Badge variant="outline" className={getRecommendationColor(rec.recommendation)}>
                      {getRecommendationText(rec.recommendation)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ШІ Оцінка:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={rec.score} className="w-24" />
                      <span className="text-sm font-medium">{rec.score}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ризик:</span>
                      <span className={cn("font-medium", getRiskColor(rec.riskLevel))}>
                        {getRiskText(rec.riskLevel)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Надійність:</span>
                      <span className="font-medium">{offer.reliability}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Доступність:</span>
                      <Badge variant={offer.availability === "Зараз" ? "default" : "secondary"} className="text-xs">
                        {offer.availability}
                      </Badge>
                    </div>
                  </div>

                  {rec.costSavings && rec.costSavings > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Економія: {rec.costSavings.toFixed(0)} ₴ порівняно з середньою ціною
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <span>Ключові фактори: {rec.reasons.join(", ")}</span>
                  </div>

                  {isSelected && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            Переваги:
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {rec.pros.map((pro, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {rec.cons.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                              <TrendingDown className="h-4 w-4" />
                              Недоліки:
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {rec.cons.map((con, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button className="flex items-center gap-2">
                          Вибрати цю пропозицію
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
