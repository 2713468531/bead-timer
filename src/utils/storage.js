const TABLES_KEY = 'bead_tables'
const ORDERS_KEY = 'bead_orders'
const SETTINGS_KEY = 'bead_settings'
const PRIZES_KEY = 'bead_prizes'
const LOTTERY_HISTORY_KEY = 'bead_lottery_history'

export const defaultSettings = {
  pricePerHour: 30,
  packages: [
    { name: '1小时套餐', hours: 1, price: 28 },
    { name: '2小时套餐', hours: 2, price: 50 },
    { name: '3小时套餐', hours: 3, price: 70 },
    { name: '全天套餐', hours: 8, price: 150 }
  ]
}

export function saveTables(tables) {
  localStorage.setItem(TABLES_KEY, JSON.stringify(tables))
}

export function loadTables() {
  const data = localStorage.getItem(TABLES_KEY)
  if (data) {
    return JSON.parse(data)
  }
  return [
    { id: 1, name: '桌台1', status: 'free' },
    { id: 2, name: '桌台2', status: 'free' },
    { id: 3, name: '桌台3', status: 'free' },
    { id: 4, name: '桌台4', status: 'free' },
    { id: 5, name: '桌台5', status: 'free' }
  ]
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function loadOrders() {
  const data = localStorage.getItem(ORDERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadSettings() {
  const data = localStorage.getItem(SETTINGS_KEY)
  return data ? JSON.parse(data) : defaultSettings
}

export function savePrizes(prizes) {
  localStorage.setItem(PRIZES_KEY, JSON.stringify(prizes))
}

export function loadPrizes() {
  const data = localStorage.getItem(PRIZES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveLotteryHistory(history) {
  localStorage.setItem(LOTTERY_HISTORY_KEY, JSON.stringify(history))
}

export function loadLotteryHistory() {
  const data = localStorage.getItem(LOTTERY_HISTORY_KEY)
  return data ? JSON.parse(data) : []
}
