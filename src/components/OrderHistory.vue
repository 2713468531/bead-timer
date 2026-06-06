<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-bold text-gray-800 flex items-center">
        <svg class="w-6 h-6 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        订单历史
      </h2>
      
      <div class="flex gap-3 flex-wrap">
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
        <input
          type="text"
          v-model="memberPhoneFilter"
          placeholder="会员手机号筛选"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
          maxlength="11"
        />
        <button @click="filterOrders" class="btn-info px-4 py-2">
          筛选
        </button>
        <button @click="resetFilter" class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
          重置
        </button>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-3 text-left font-semibold text-gray-600">桌台</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">开单时间</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">结束时间</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">时长</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">金额</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">会员手机号</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">支付方式</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600">套餐</th>
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
            <td class="px-4 py-3">{{ order.package || '-' }}</td>
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
        共 {{ filteredOrders.length }} 条记录，合计金额
      </span>
      <span class="text-xl font-bold text-primary">
        ¥{{ filteredTotal.toFixed(2) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDateTime, formatDuration, filterOrdersByDate } from '../utils/price'

const props = defineProps({
  orders: Array,
  tables: Array
})

const startDate = ref(getDefaultStartDate())
const endDate = ref(getDefaultEndDate())
const memberPhoneFilter = ref('')

function getDefaultStartDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

function getDefaultEndDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const filteredOrders = computed(() => {
  let orders = props.orders
  
  // 日期筛选
  if (startDate.value && endDate.value) {
    orders = filterOrdersByDate(orders, startDate.value, endDate.value)
  }
  
  // 会员手机号筛选
  if (memberPhoneFilter.value) {
    orders = orders.filter(order => order.memberPhone === memberPhoneFilter.value)
  }
  
  return orders
})

const filteredTotal = computed(() => {
  return filteredOrders.value.reduce((sum, order) => sum + order.price, 0)
})

function getTableName(tableId) {
  const table = props.tables.find(t => t.id === tableId)
  return table?.name || '未知桌台'
}

function filterOrders() {
}

function resetFilter() {
  startDate.value = ''
  endDate.value = ''
  memberPhoneFilter.value = ''
}
</script>
