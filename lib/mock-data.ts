import type { MarketplaceOffer } from "@/types/marketplace"

export const mockOffers: MarketplaceOffer[] = [
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

// Mock storage (в реальному проекті це була б база даних)
const offers = [...mockOffers]
const nextId = 5
