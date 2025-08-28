export interface MarketplaceOffer {
  id: string
  plantId: string
  plantName: string
  energyAmount: number // kWh
  pricePerKwh: number // грн за kWh
  totalPrice: number
  location: string
  validUntil: string
  status: "active" | "sold" | "expired"
  createdAt: string
}

export interface BuyRequest {
  offerId: string
  buyerId: string
  amount: number
}

export interface CreateOfferRequest {
  plantId: string
  energyAmount: number
  pricePerKwh: number
  validUntil: string
}
