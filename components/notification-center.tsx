"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Search,
  Clock,
  Factory,
  Zap,
  Settings,
  TrendingUp,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification, NotificationStats } from "@/types/notifications"

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    type: "critical",
    title: "Критична помилка генератора",
    message: "Турбогенератор ТГВ-250 на Харківській ТЕЦ-3 зупинився через перегрів. Необхідне негайне втручання.",
    plantId: "plant6",
    plantName: "Харківська ТЕЦ-3",
    equipmentId: "gen-010",
    equipmentName: "Турбогенератор ТГВ-250",
    timestamp: "2025-01-14T14:30:00Z",
    isRead: false,
    priority: "high",
    category: "equipment",
    actionRequired: true,
  },
  {
    id: "notif-002",
    type: "warning",
    title: "Планове обслуговування",
    message: "Запорізький алюмінієвий завод №2 розпочав планове обслуговування. Очікуваний час завершення: 20 січня.",
    plantId: "plant3",
    plantName: "Запорізький алюмінієвий завод №2",
    timestamp: "2025-01-14T10:00:00Z",
    isRead: false,
    priority: "medium",
    category: "maintenance",
    actionRequired: false,
  },
  {
    id: "notif-003",
    type: "warning",
    title: "Низький рівень акумулятора",
    message: "Рівень заряду акумуляторної системи на Полтавській ТЕЦ-4 знизився до 35%. Рекомендується зарядка.",
    plantId: "plant9",
    plantName: "Полтавська ТЕЦ-4",
    equipmentId: "bat-009",
    equipmentName: "Резервна батарея Kokam",
    timestamp: "2025-01-14T12:15:00Z",
    isRead: true,
    priority: "medium",
    category: "equipment",
    actionRequired: true,
  },
  {
    id: "notif-004",
    type: "success",
    title: "Успішна транзакція",
    message: "Київська ТЕС-5 успішно продала 2800 МВт енергії Одеській ТЕС-2 за ціною 2.2 грн/кВт·год.",
    plantId: "plant5",
    plantName: "Київська ТЕС-5",
    timestamp: "2025-01-14T11:45:00Z",
    isRead: true,
    priority: "low",
    category: "trading",
    actionRequired: false,
  },
  {
    id: "notif-005",
    type: "info",
    title: "Оновлення системи",
    message: "Система управління електромережею була оновлена до версії 2.1.4. Додано нові функції аналітики.",
    timestamp: "2025-01-14T09:00:00Z",
    isRead: true,
    priority: "low",
    category: "system",
    actionRequired: false,
  },
  {
    id: "notif-006",
    type: "warning",
    title: "Перевищення потужності",
    message: "Маріупольський металургійний комбінат працює на 95% від максимальної потужності. Моніторинг ситуації.",
    plantId: "plant4",
    plantName: "Маріупольський металургійний комбінат",
    timestamp: "2025-01-14T13:20:00Z",
    isRead: false,
    priority: "medium",
    category: "power",
    actionRequired: false,
  },
  {
    id: "notif-007",
    type: "critical",
    title: "Аварійне відключення",
    message: "Полтавська ТЕЦ-4 була аварійно відключена через технічні проблеми. Розслідування триває.",
    plantId: "plant9",
    plantName: "Полтавська ТЕЦ-4",
    timestamp: "2025-01-14T08:30:00Z",
    isRead: false,
    priority: "high",
    category: "equipment",
    actionRequired: true,
  },
  {
    id: "notif-008",
    type: "info",
    title: "Нова пропозиція на ринку",
    message: "Вінницька ТЕЦ-2 розмістила нову пропозицію: 750 МВт зеленої енергії за 2.1 грн/кВт·год.",
    plantId: "plant10",
    plantName: "Вінницька ТЕЦ-2",
    timestamp: "2025-01-14T07:15:00Z",
    isRead: true,
    priority: "low",
    category: "trading",
    actionRequired: false,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const stats: NotificationStats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      critical: notifications.filter((n) => n.type === "critical").length,
      warning: notifications.filter((n) => n.type === "warning").length,
      info: notifications.filter((n) => n.type === "info").length,
      success: notifications.filter((n) => n.type === "success").length,
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        const matchesSearch =
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.plantName?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === "all" || notification.type === filterType
        const matchesCategory = filterCategory === "all" || notification.category === filterCategory
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "unread" && !notification.isRead) ||
          (activeTab === "critical" && notification.type === "critical") ||
          (activeTab === "action" && notification.actionRequired)

        return matchesSearch && matchesType && matchesCategory && matchesTab
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [notifications, searchTerm, filterType, filterCategory, activeTab])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "equipment":
        return <Settings className="h-4 w-4" />
      case "power":
        return <Zap className="h-4 w-4" />
      case "maintenance":
        return <Clock className="h-4 w-4" />
      case "trading":
        return <TrendingUp className="h-4 w-4" />
      case "system":
        return <Factory className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Щойно"
    if (diffInHours < 24) return `${diffInHours} год тому`
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Центр Сповіщень</h2>
          <p className="text-muted-foreground">Управління повідомленнями та попередженнями системи</p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          <Check className="h-4 w-4 mr-2" />
          Позначити всі як прочитані
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всього</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Непрочитані</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
              </div>
              <Badge variant="secondary">{stats.unread}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Критичні</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Попередження</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Інформація</p>
                <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Успішні</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук сповіщень..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Тип сповіщення" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі типи</SelectItem>
                <SelectItem value="critical">Критичні</SelectItem>
                <SelectItem value="warning">Попередження</SelectItem>
                <SelectItem value="info">Інформація</SelectItem>
                <SelectItem value="success">Успішні</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Категорія" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі категорії</SelectItem>
                <SelectItem value="equipment">Обладнання</SelectItem>
                <SelectItem value="power">Енергія</SelectItem>
                <SelectItem value="maintenance">Обслуговування</SelectItem>
                <SelectItem value="trading">Торгівля</SelectItem>
                <SelectItem value="system">Система</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Сповіщення</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Всі ({stats.total})</TabsTrigger>
              <TabsTrigger value="unread">Непрочитані ({stats.unread})</TabsTrigger>
              <TabsTrigger value="critical">Критичні ({stats.critical})</TabsTrigger>
              <TabsTrigger value="action">Потребують дій</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Немає сповіщень для відображення</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                        !notification.isRead && "bg-muted/30 border-primary/20",
                        notification.isRead && "bg-background",
                      )}
                    >
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={cn("font-medium text-sm", !notification.isRead && "font-semibold")}>
                                {notification.title}
                              </h4>
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Потребує дій
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(notification.category)}
                                <span className="capitalize">{notification.category}</span>
                              </div>
                              {notification.plantName && (
                                <div className="flex items-center gap-1">
                                  <Factory className="h-3 w-3" />
                                  <span>{notification.plantName}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
