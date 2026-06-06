export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
  }
  return `${mins}分钟`
}

export function formatSecondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatMinutesToHMS(minutes) {
  const totalSeconds = minutes * 60
  return formatSecondsToHMS(totalSeconds)
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculatePrice(durationMinutes, pricePerHour, packages = []) {
  let price = 0
  const hours = durationMinutes / 60
  
  let bestPackage = null
  let bestPackageSavings = 0
  
  for (const pkg of packages) {
    if (hours <= pkg.hours) {
      const normalPrice = pkg.hours * pricePerHour
      const savings = normalPrice - pkg.price
      if (savings > bestPackageSavings) {
        bestPackage = pkg
        bestPackageSavings = savings
      }
    }
  }
  
  if (bestPackage && bestPackageSavings > 0) {
    price = bestPackage.price
  } else {
    price = Math.ceil(durationMinutes / 60) * pricePerHour
    if (durationMinutes % 60 > 0) {
      const remainingMinutes = durationMinutes % 60
      price = Math.floor(durationMinutes / 60) * pricePerHour + (remainingMinutes / 60) * pricePerHour
    }
  }
  
  return Math.round(price * 100) / 100
}

export function getTodayOrders(orders) {
  const today = new Date().toDateString()
  return orders.filter(order => new Date(order.endTime).toDateString() === today)
}

export function filterOrdersByDate(orders, startDate, endDate) {
  return orders.filter(order => {
    const orderDate = new Date(order.endTime)
    return orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
  })
}

export function getTableStats(orders, tableId) {
  const tableOrders = orders.filter(order => order.tableId === tableId)
  const totalDuration = tableOrders.reduce((sum, order) => sum + order.duration, 0)
  const totalRevenue = tableOrders.reduce((sum, order) => sum + order.price, 0)
  return {
    count: tableOrders.length,
    totalDuration,
    totalRevenue
  }
}

export function getDailyStats(orders) {
  const todayOrders = getTodayOrders(orders)
  const totalDuration = todayOrders.reduce((sum, order) => sum + order.duration, 0)
  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.price, 0)
  return {
    count: todayOrders.length,
    totalDuration,
    totalRevenue
  }
}

export function getOverallStats(orders) {
  const totalDuration = orders.reduce((sum, order) => sum + order.duration, 0)
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0)
  return {
    count: orders.length,
    totalDuration,
    totalRevenue
  }
}
