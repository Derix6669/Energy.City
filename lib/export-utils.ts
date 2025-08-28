// Утиліти для експорту даних в різних форматах

export interface ExportData {
  kpiData: {
    totalRevenue: number
    totalProfit: number
    avgEfficiency: number
    uptime: number
    co2Reduction: number
    energySaved: number
  }
  powerTrendData: Array<{
    time: string
    power: number
    efficiency: number
  }>
  tradingData: Array<{
    month: string
    revenue: number
    costs: number
    profit: number
  }>
  performanceMetrics: Array<{
    plant: string
    uptime: number
    efficiency: number
    maintenance: number
  }>
}

export function generateCSV(data: ExportData): string {
  const headers = ["Показник", "Значення", "Одиниця виміру"]

  const rows = [
    ["Загальний дохід", (data.kpiData.totalRevenue / 1000000).toFixed(1), "млн ₴"],
    ["Чистий прибуток", (data.kpiData.totalProfit / 1000000).toFixed(1), "млн ₴"],
    ["Середня ефективність", data.kpiData.avgEfficiency.toString(), "%"],
    ["Час роботи", data.kpiData.uptime.toString(), "%"],
    ["Зменшення CO₂", data.kpiData.co2Reduction.toString(), "%"],
    ["Заощаджена енергія", data.kpiData.energySaved.toString(), "МВт·г"],
    ...data.performanceMetrics.map((metric) => [`${metric.plant} - час роботи`, metric.uptime.toString(), "%"]),
  ]

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateExcelData(data: ExportData) {
  return {
    sheets: [
      {
        name: "KPI Показники",
        data: [
          ["Показник", "Значення", "Одиниця"],
          ["Загальний дохід", (data.kpiData.totalRevenue / 1000000).toFixed(1), "млн ₴"],
          ["Чистий прибуток", (data.kpiData.totalProfit / 1000000).toFixed(1), "млн ₴"],
          ["Середня ефективність", data.kpiData.avgEfficiency, "%"],
          ["Час роботи", data.kpiData.uptime, "%"],
          ["Зменшення CO₂", data.kpiData.co2Reduction, "%"],
          ["Заощаджена енергія", data.kpiData.energySaved, "МВт·г"],
        ],
      },
      {
        name: "Продуктивність заводів",
        data: [
          ["Завод", "Час роботи (%)", "Ефективність (%)", "ТО за місяць"],
          ...data.performanceMetrics.map((metric) => [
            metric.plant,
            metric.uptime,
            metric.efficiency,
            metric.maintenance,
          ]),
        ],
      },
      {
        name: "Фінансові дані",
        data: [
          ["Місяць", "Доходи (₴)", "Витрати (₴)", "Прибуток (₴)"],
          ...data.tradingData.map((item) => [item.month, item.revenue, item.costs, item.profit]),
        ],
      },
    ],
  }
}
