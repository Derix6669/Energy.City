import { type NextRequest, NextResponse } from "next/server"
import type { BuyRequest, MarketplaceOffer } from "@/types/marketplace"

// Mock storage (той самий масив що і в інших файлах)
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

export async function POST(request: NextRequest) {
  try {
    const body: BuyRequest = await request.json()

    const offerIndex = offers.findIndex((offer) => offer.id === body.offerId)

    if (offerIndex === -1) {
      return NextResponse.json({ error: "Пропозицію не знайдено" }, { status: 404 })
    }

    const offer = offers[offerIndex]

    if (offer.status !== "active") {
      return NextResponse.json({ error: "Пропозиція більше не активна" }, { status: 400 })
    }

    if (body.amount > offer.energyAmount) {
      return NextResponse.json({ error: "Недостатньо енергії в пропозиції" }, { status: 400 })
    }

    // Оновлюємо пропозицію
    if (body.amount === offer.energyAmount) {
      offers[offerIndex].status = "sold"
    } else {
      offers[offerIndex].energyAmount -= body.amount
      offers[offerIndex].totalPrice = offers[offerIndex].energyAmount * offers[offerIndex].pricePerKwh
    }

    const transaction = {
      id: Date.now().toString(),
      offerId: body.offerId,
      buyerId: body.buyerId,
      sellerId: offer.plantId,
      amount: body.amount,
      pricePerKwh: offer.pricePerKwh,
      totalPrice: body.amount * offer.pricePerKwh,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    return NextResponse.json({
      message: "Покупка успішно завершена",
      transaction,
      updatedOffer: offers[offerIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Помилка обробки покупки" }, { status: 400 })
  }
}
