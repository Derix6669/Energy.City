"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Factory,
  LogOut,
  PieChart,
  Power,
  Users,
  Bell,
  Network,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  totalAlerts: number
}

const navigationItems = [
  {
    id: "overview",
    label: "Огляд Заводів",
    icon: BarChart3,
  },
  {
    id: "hierarchy",
    label: "Ієрархічне Дерево",
    icon: Factory,
  },
  {
    id: "network",
    label: "Візуалізація Мережі",
    icon: Network,
  },
  {
    id: "map",
    label: "Карта",
    icon: Factory,
  },
  {
    id: "notifications",
    label: "Сповіщення",
    icon: Bell,
  },
  {
    id: "grid",
    label: "Електромережа",
    icon: Power,
  },
  {
    id: "trading",
    label: "Торгівля",
    icon: Users,
  },
  {
    id: "equipment",
    label: "Обладнання",
    icon: Activity,
  },
  {
    id: "analytics",
    label: "Аналітика",
    icon: PieChart,
  },
]

export function AdminSidebar({ activeSection, onSectionChange, totalAlerts }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)
  const closeMobile = () => setIsMobileOpen(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobile}
          className="h-10 w-10 p-0 bg-card/80 backdrop-blur border-border"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMobile} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 z-50",
          "lg:relative lg:z-auto",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "fixed left-0 top-0 z-50" : "lg:relative",
          !isMobileOpen && "lg:block hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <Factory className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-semibold text-sm">Система Управління</h2>
                <p className="text-xs text-muted-foreground">Електромережею</p>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="h-8 w-8 p-0 hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeMobile} 
            className="h-8 w-8 p-0 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              const showNotificationBadge = item.id === "notifications" && totalAlerts > 0

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 lg:h-10 relative",
                    isCollapsed && "justify-center px-2 lg:px-2",
                    isActive && "bg-primary/10 text-primary border-primary/20",
                    "text-sm lg:text-sm",
                  )}
                  onClick={() => {
                    onSectionChange(item.id)
                    closeMobile()
                  }}
                >
                  <Icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  {showNotificationBadge && (
                    <Badge
                      variant="destructive"
                      className={cn(
                        "text-xs h-5 min-w-5 flex items-center justify-center",
                        isCollapsed ? "absolute -top-1 -right-1" : "ml-auto",
                      )}
                    >
                      {totalAlerts}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Alerts Badge */}
          {!isCollapsed && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Сповіщення</span>
              <Badge variant={totalAlerts > 0 ? "destructive" : "secondary"}>{totalAlerts}</Badge>
            </div>
          )}

          {/* User Info */}
          {!isCollapsed && user && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Вітаємо,</p>
              <p className="text-sm font-medium truncate">{user.name}</p>
            </div>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-2 h-10",
              isCollapsed && "justify-center px-2",
              "text-sm"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Вихід</span>}
          </Button>
        </div>
      </div>
    </>
  )
}
