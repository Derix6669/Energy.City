export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "plant"
  plantId?: string // Only for plant users
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface Plant {
  id: string
  name: string
  location: string
  ownerId: string
}
