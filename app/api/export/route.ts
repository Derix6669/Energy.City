import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { format, data } = await request.json()

    const timestamp = new Date().toISOString().split("T")[0]

    if (format === "csv") {
      const csvContent = generateCSVContent(data)

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="analytics-report-${timestamp}.csv"`,
        },
      })
    }

    if (format === "pdf") {
      const pdfContent = generatePDFContent(data)

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="analytics-report-${timestamp}.pdf"`,
        },
      })
    }

    if (format === "excel") {
      const excelContent = generateExcelContent(data)

      return new NextResponse(excelContent, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="analytics-report-${timestamp}.xlsx"`,
        },
      })
    }

    return NextResponse.json({ error: "Непідтримуваний формат" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Помилка генерації звіту" }, { status: 500 })
  }
}

function generateCSVContent(data: any): string {
  const headers = ["Показник", "Значення", "Одиниця виміру"]

  const rows = [
    ["Загальний дохід", (data.kpiData.totalRevenue / 1000000).toFixed(1), "млн ₴"],
    ["Чистий прибуток", (data.kpiData.totalProfit / 1000000).toFixed(1), "млн ₴"],
    ["Середня ефективність", data.kpiData.avgEfficiency.toString(), "%"],
    ["Час роботи", data.kpiData.uptime.toString(), "%"],
    ["Зменшення CO₂", data.kpiData.co2Reduction.toString(), "%"],
    ["Заощаджена енергія", data.kpiData.energySaved.toString(), "МВт·г"],
    ...data.performanceMetrics.map((metric: any) => [`${metric.plant} - час роботи`, metric.uptime.toString(), "%"]),
  ]

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

function generatePDFContent(data: any): string {
  // Mock PDF content - в реальному проекті використовувати jsPDF або puppeteer
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Звіт аналітики електромережі) Tj
0 -20 Td
(Дата: ${new Date().toLocaleDateString("uk-UA")}) Tj
0 -20 Td
(Загальний дохід: ${(data.kpiData.totalRevenue / 1000000).toFixed(1)} млн грн) Tj
0 -20 Td
(Чистий прибуток: ${(data.kpiData.totalProfit / 1000000).toFixed(1)} млн грн) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
456
%%EOF`
}

function generateExcelContent(data: any): string {
  // Mock Excel content - в реальному проекті використовувати xlsx бібліотеку
  const csvContent = generateCSVContent(data)
  return csvContent // Спрощена версія для демо
}
