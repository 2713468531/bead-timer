<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-bold text-gray-800 flex items-center">
        <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        数据统计
      </h2>
      
      <div class="flex gap-3">
        <input
          type="date"
          v-model="startDate"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <span class="text-gray-400 self-center">-</span>
        <input
          type="date"
          v-model="endDate"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <button @click="applyFilter" class="btn-info px-4 py-2">
          筛选
        </button>
        <button @click="resetFilter" class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
          重置
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">当日订单</p>
        <p class="text-2xl font-bold text-primary">{{ dailyStats.count }}</p>
      </div>
      <div class="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">当日时长</p>
        <p class="text-2xl font-bold text-secondary">{{ formatDuration(dailyStats.totalDuration) }}</p>
      </div>
      <div class="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">当日营收</p>
        <p class="text-2xl font-bold text-accent">¥{{ dailyStats.totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-gradient-to-br from-info/10 to-info/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">筛选订单</p>
        <p class="text-2xl font-bold text-info">{{ filteredOrders.length }}</p>
      </div>
    </div>
    
    <!-- 会员统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">当日会员充值</p>
        <p class="text-2xl font-bold text-success">¥{{ memberStats.today.totalRecharge.toFixed(2) }}</p>
      </div>
      <div class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">当日会员消费</p>
        <p class="text-2xl font-bold text-warning">¥{{ memberStats.today.totalMemberPay.toFixed(2) }}</p>
      </div>
      <div class="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">筛选期间充值</p>
        <p class="text-2xl font-bold text-success">¥{{ memberStats.filtered.totalRecharge.toFixed(2) }}</p>
      </div>
      <div class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-4">
        <p class="text-gray-500 text-sm">筛选期间消费</p>
        <p class="text-2xl font-bold text-warning">¥{{ memberStats.filtered.totalMemberPay.toFixed(2) }}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 rounded-xl p-4">
        <h3 class="font-semibold text-gray-700 mb-3">筛选期间汇总</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">订单数</span>
            <span class="font-semibold">{{ filteredStats.count }} 笔</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">总制作时长</span>
            <span class="font-semibold">{{ formatDuration(filteredStats.totalDuration) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">总收入</span>
            <span class="font-semibold text-primary">¥{{ filteredStats.totalRevenue.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <h3 class="font-semibold text-gray-700 mb-3">历史汇总</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">总订单数</span>
            <span class="font-semibold">{{ overallStats.count }} 笔</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">总制作时长</span>
            <span class="font-semibold">{{ formatDuration(overallStats.totalDuration) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">总收入</span>
            <span class="font-semibold text-primary">¥{{ overallStats.totalRevenue.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-3">桌台累计统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          v-for="stat in tableStats"
          :key="stat.tableId"
          class="bg-gray-50 rounded-xl p-3"
        >
          <div class="text-sm font-medium text-gray-700">{{ stat.tableName }}</div>
          <div class="text-xs text-gray-500 mt-1">累计时长: {{ formatDuration(stat.totalDuration) }}</div>
          <div class="text-lg font-bold text-primary mt-1">¥{{ stat.totalRevenue.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="font-semibold text-gray-700 mb-3">历史订单明细</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left font-semibold text-gray-600">桌号</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">开单时间</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">结账时间</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">实际DIY时长</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">收费</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">会员手机号</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">支付方式</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">{{ getTableName(order.tableId) }}</td>
              <td class="px-4 py-3">{{ formatDateTime(order.startTime) }}</td>
              <td class="px-4 py-3">{{ formatDateTime(order.endTime) }}</td>
              <td class="px-4 py-3">{{ formatDuration(order.duration) }}</td>
              <td class="px-4 py-3 font-semibold text-primary">¥{{ order.price.toFixed(2) }}</td>
              <td class="px-4 py-3">{{ order.memberPhone || '-' }}</td>
              <td class="px-4 py-3">
                <span v-if="order.payType === '会员余额'" class="text-success font-medium">会员余额</span>
                <span v-else class="text-gray-600">现金</span>
              </td>
              <td class="px-4 py-3">{{ order.remark || '-' }}</td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400">
                暂无订单记录
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredOrders.length > 0" class="mt-4 flex justify-end items-center gap-4">
        <span class="text-sm text-gray-500">
          共 {{ filteredOrders.length }} 条记录
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDuration, formatDateTime, getDailyStats, getOverallStats, getTableStats, filterOrdersByDate } from '../utils/price'
import { getStatistics } from '../utils/api'

const props = defineProps({
  orders: Array,
  tables: Array
})

const startDate = ref(getDefaultDate())
const endDate = ref(getDefaultDate())

function getDefaultDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const memberStats = ref({
  today: { totalRecharge: 0, totalMemberPay: 0 },
  filtered: { totalRecharge: 0, totalMemberPay: 0 }
})

const dailyStats = computed(() => getDailyStats(props.orders))
const overallStats = computed(() => getOverallStats(props.orders))

const filteredOrders = computed(() => {
  if (!startDate.value || !endDate.value) {
    return props.orders
  }
  return filterOrdersByDate(props.orders, startDate.value, endDate.value)
})

const filteredStats = computed(() => {
  const orders = filteredOrders.value
  return {
    count: orders.length,
    totalDuration: orders.reduce((sum, order) => sum + order.duration, 0),
    totalRevenue: orders.reduce((sum, order) => sum + order.price, 0)
  }
})

const tableStats = computed(() => {
  return props.tables.map(table => ({
    tableId: table.id,
    tableName: table.name,
    ...getTableStats(filteredOrders.value, table.id)
  }))
})

function getTableName(tableId) {
  const table = props.tables.find(t => t.id === tableId)
  return table?.name || '未知桌台'
}

async function loadMemberStats() {
  try {
    const params = {}
    if (startDate.value && endDate.value) {
      params.startDate = startDate.value
      params.endDate = endDate.value
    }
    
    const res = await getStatistics(params)
    if (res.success) {
      memberStats.value = {
        today: {
          totalRecharge: res.data.today.totalRecharge,
          totalMemberPay: res.data.today.totalMemberPay
        },
        filtered: {
          totalRecharge: res.data.filtered.totalRecharge,
          totalMemberPay: res.data.filtered.totalMemberPay
        }
      }
    }
  } catch (error) {
    console.error('获取会员统计失败:', error)
  }
}

function applyFilter() {
  loadMemberStats()
}

function resetFilter() {
  startDate.value = ''
  endDate.value = ''
  loadMemberStats()
}

onMounted(() => {
  loadMemberStats()
})
</script>
