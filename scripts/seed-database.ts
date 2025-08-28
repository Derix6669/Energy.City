// Скрипт для ініціалізації демо даних
import plantsData from "../data/plants.json"
import equipmentData from "../data/equipment.json"
import offersData from "../data/marketplace-offers.json"
import analyticsData from "../data/analytics-history.json"
import transactionsData from "../data/transactions.json"

interface SeedDataResult {
  success: boolean
  message: string
  data?: any
}

export async function seedDatabase(): Promise<SeedDataResult> {
  try {
    console.log("🌱 Початок ініціалізації демо даних...")

    // Ініціалізація заводів
    console.log("📍 Завантаження даних заводів...")
    const plants = plantsData.plants
    console.log(`✅ Завантажено ${plants.length} заводів`)

    // Ініціалізація обладнання
    console.log("⚙️ Завантаження даних обладнання...")
    const equipment = equipmentData.equipment
    console.log(`✅ Завантажено ${equipment.length} одиниць обладнання`)

    // Ініціалізація пропозицій marketplace
    console.log("💰 Завантаження пропозицій marketplace...")
    const offers = offersData.offers
    console.log(`✅ Завантажено ${offers.length} пропозицій`)

    // Ініціалізація історичних даних
    console.log("📊 Завантаження аналітичних даних...")
    const analytics = analyticsData
    console.log(`✅ Завантажено історичні дані за ${analytics.monthlyFinancials.length} місяців`)

    // Ініціалізація транзакцій
    console.log("🔄 Завантаження транзакцій...")
    const transactions = transactionsData.transactions
    console.log(`✅ Завантажено ${transactions.length} транзакцій`)

    // Валідація даних
    console.log("🔍 Валідація цілісності даних...")

    // Перевірка зв'язків між заводами та обладнанням
    const plantIds = plants.map((p) => p.id)
    const equipmentPlantIds = equipment.map((e) => e.plantId)
    const invalidEquipment = equipmentPlantIds.filter((id) => !plantIds.includes(id))

    if (invalidEquipment.length > 0) {
      throw new Error(`Знайдено обладнання з невалідними plantId: ${invalidEquipment.join(", ")}`)
    }

    // Перевірка пропозицій
    const offerPlantIds = offers.map((o) => o.plantId)
    const invalidOffers = offerPlantIds.filter((id) => !plantIds.includes(id))

    if (invalidOffers.length > 0) {
      throw new Error(`Знайдено пропозиції з невалідними plantId: ${invalidOffers.join(", ")}`)
    }

    console.log("✅ Валідація пройшла успішно")

    // Підрахунок статистики
    const stats = {
      totalPlants: plants.length,
      onlinePlants: plants.filter((p) => p.status === "online").length,
      totalEquipment: equipment.length,
      activeOffers: offers.filter((o) => o.status === "active").length,
      totalTransactions: transactions.length,
      completedTransactions: transactions.filter((t) => t.status === "completed").length,
      totalRevenue: analytics.monthlyFinancials.reduce((sum, m) => sum + m.revenue, 0),
      totalProfit: analytics.monthlyFinancials.reduce((sum, m) => sum + m.profit, 0),
    }

    console.log("📈 Статистика демо даних:")
    console.log(`   • Заводи: ${stats.onlinePlants}/${stats.totalPlants} онлайн`)
    console.log(`   • Обладнання: ${stats.totalEquipment} одиниць`)
    console.log(`   • Активні пропозиції: ${stats.activeOffers}`)
    console.log(`   • Транзакції: ${stats.completedTransactions}/${stats.totalTransactions} завершено`)
    console.log(`   • Загальний дохід: ${(stats.totalRevenue / 1000000).toFixed(1)}М ₴`)
    console.log(`   • Загальний прибуток: ${(stats.totalProfit / 1000000).toFixed(1)}М ₴`)

    console.log("🎉 Ініціалізація демо даних завершена успішно!")

    return {
      success: true,
      message: "Демо дані успішно ініціалізовані",
      data: {
        plants,
        equipment,
        offers,
        analytics,
        transactions,
        stats,
      },
    }
  } catch (error) {
    console.error("❌ Помилка ініціалізації демо даних:", error)
    return {
      success: false,
      message: `Помилка: ${error instanceof Error ? error.message : "Невідома помилка"}`,
    }
  }
}

// Запуск скрипта якщо викликається напряму
if (require.main === module) {
  seedDatabase().then((result) => {
    if (result.success) {
      console.log("✅ Скрипт виконано успішно")
      process.exit(0)
    } else {
      console.error("❌ Скрипт завершився з помилкою:", result.message)
      process.exit(1)
    }
  })
}
