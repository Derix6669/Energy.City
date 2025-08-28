import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "Система Управління Електромережею",
  description: "Агрегація Вугільних Заводів",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
