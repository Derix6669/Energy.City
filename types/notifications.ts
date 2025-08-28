export interface Notification {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  plantId?: string
  plantName?: string
  equipmentId?: string
  equipmentName?: string
  timestamp: string
  isRead: boolean
  priority: "high" | "medium" | "low"
  category: "equipment" | "power" | "maintenance" | "trading" | "system"
  actionRequired?: boolean
  resolvedAt?: string
  resolvedBy?: string
}

export interface NotificationStats {
  total: number
  unread: number
  critical: number
  warning: number
  info: number
  success: number
}
