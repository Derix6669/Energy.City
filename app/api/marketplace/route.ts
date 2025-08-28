import { type NextRequest, NextResponse } from "next/server"
import type { MarketplaceOffer, CreateOfferRequest } from "@/types/marketplace"

// Mock storage (в реальному проекті це була б база даних)
const offers: MarketplaceOffer[] = [
  {
    id: "1",
    plantId: "plant1",
    plantName: "Криворізький завод №1",
    energyAmount: 1500,
    pricePerKwh: 2.45,
    totalPrice: 3675,
    location: "Кривий Ріг",
    validUntil: "2025-01-15T18:00:00Z",
    status: "active",
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    plantId: "plant2",
    plantName: "Донецький завод №3",
    energyAmount: 2200,
    pricePerKwh: 2.3,
    totalPrice: 5060,
    location: "Донецьк",
    validUntil: "2025-01-16T12:00:00Z",
    status: "active",
    createdAt: "2025-01-10T14:30:00Z",
  },
  {
    id: "3",
    plantId: "plant3",
    plantName: "Запорізький завод №2",
    energyAmount: 800,
    pricePerKwh: 2.6,
    totalPrice: 2080,
    location: "Запоріжжя",
    validUntil: "2025-01-14T20:00:00Z",
    status: "active",
    createdAt: "2025-01-09T16:15:00Z",
  },
  {
    id: "4",
    plantId: "plant4",
    plantName: "Львівський завод №1",
    energyAmount: 1200,
    pricePerKwh: 2.55,
    totalPrice: 3060,
    location: "Львів",
    validUntil: "2025-01-17T09:00:00Z",
    status: "active",
    createdAt: "2025-01-11T08:45:00Z",
  },
]

let nextId = 5

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const location = searchParams.get("location")
  const maxPrice = searchParams.get("maxPrice")

  let filteredOffers = offers

  if (status) {
    filteredOffers = filteredOffers.filter((offer) => offer.status === status)
  }

  if (location) {
    filteredOffers = filteredOffers.filter((offer) => offer.location.toLowerCase().includes(location.toLowerCase()))
  }

  if (maxPrice) {
    filteredOffers = filteredOffers.filter((offer) => offer.pricePerKwh <= Number.parseFloat(maxPrice))
  }

  return NextResponse.json(filteredOffers)
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOfferRequest = await request.json()

    const newOffer: MarketplaceOffer = {
      id: nextId.toString(),
      plantId: body.plantId,
      plantName: `Завод ${body.plantId}`,
      energyAmount: body.energyAmount,
      pricePerKwh: body.pricePerKwh,
      totalPrice: body.energyAmount * body.pricePerKwh,
      location: "Україна",
      validUntil: body.validUntil,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    offers.push(newOffer)
    nextId++

    return NextResponse.json(newOffer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Помилка створення пропозиції" }, { status: 400 })
  }
}
