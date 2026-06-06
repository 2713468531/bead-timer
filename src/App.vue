<template>
  <div class="min-h-screen">
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800">拼豆DIY计时系统</h1>
              <p class="text-sm text-gray-500">店主后台管理</p>
            </div>
          </div>
          
          <nav class="flex gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-2 rounded-lg font-medium transition-all"
              :class="[
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <span class="flex items-center gap-2">
                <svg v-if="tab.id === 'tables'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <svg v-else-if="tab.id === 'member'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <svg v-else-if="tab.id === 'statistics'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <svg v-else-if="tab.id === 'history'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else-if="tab.id === 'lottery'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                </svg>
                {{ tab.name }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div v-if="activeTab === 'tables'">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-700">桌台状态</h2>
            <button @click="addTable" class="btn-secondary">
              + 添加桌台
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <TableCard
            v-for="table in tables"
            :key="table.id"
            :table="table"
            :elapsed-seconds="getElapsedSeconds(table)"
            @select="openOrderModal"
            @delete="deleteTable"
          />
        </div>
        
        <div v-if="tables.length === 0" class="text-center py-16">
          <svg class="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <p class="text-gray-400 mt-4">暂无桌台，请添加桌台</p>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'statistics'">
        <Statistics :orders="orders" :tables="tables" />
      </div>
      
      <div v-else-if="activeTab === 'member'">
        <Member />
      </div>
      
      <div v-else-if="activeTab === 'history'">
        <OrderHistory :orders="orders" :tables="tables" />
      </div>
      
      <div v-else-if="activeTab === 'lottery'">
        <Lottery />
      </div>
      
      <div v-else-if="activeTab === 'settings'">
        <Settings
          :settings="settings"
          :tables="tables"
          @save="handleSaveSettings"
          @add-table="addTable"
        />
      </div>
    </main>
    
    <OrderModal
      :visible="modalVisible"
      :table="selectedTable"
      :settings="settings"
      :elapsed-seconds="currentElapsedSeconds"
      @close="closeOrderModal"
      @start="handleStart"
      @pause="handlePause"
      @resume="handleResume"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import TableCard from './components/TableCard.vue'
import OrderModal from './components/OrderModal.vue'
import Statistics from './components/Statistics.vue'
import OrderHistory from './components/OrderHistory.vue'
import Lottery from './components/Lottery.vue'
import Settings from './components/Settings.vue'
import Member from './components/Member.vue'
import {
  saveTables,
  loadTables,
  saveOrders,
  loadOrders,
  saveSettings,
  loadSettings
} from './utils/storage'
import { calculatePrice } from './utils/price'
import { createOrder } from './utils/api'

const tabs = [
  { id: 'tables', name: '桌台管理' },
  { id: 'member', name: '会员管理' },
  { id: 'statistics', name: '数据统计' },
  { id: 'history', name: '订单历史' },
  { id: 'lottery', name: '幸运抽奖' },
  { id: 'settings', name: '价格设置' }
]

const activeTab = ref('tables')
const tables = ref([])
const orders = ref([])
const settings = ref({})
const modalVisible = ref(false)
const selectedTable = ref(null)
const currentElapsedSeconds = ref(0)

let timer = null

const workingTables = computed(() => {
  return tables.value.filter(t => t.status === 'working')
})

function getElapsedSeconds(table) {
  if (table.status !== 'working' || !table.startTime) return 0
  return Math.floor((Date.now() - table.startTime) / 1000)
}

function updateTimer() {
  workingTables.value.forEach(table => {
    if (table.status === 'working') {
      const elapsed = getElapsedSeconds(table)
      if (table.id === selectedTable.value?.id) {
        currentElapsedSeconds.value = elapsed
      }
    }
  })
}

function openOrderModal(table) {
  selectedTable.value = table
  if (table.status === 'working') {
    currentElapsedSeconds.value = getElapsedSeconds(table)
  }
  modalVisible.value = true
}

function closeOrderModal() {
  modalVisible.value = false
  selectedTable.value = null
  currentElapsedSeconds.value = 0
}

function handleStart({ table, remark }) {
  const updatedTable = tables.value.find(t => t.id === table.id)
  if (updatedTable) {
    updatedTable.status = 'working'
    updatedTable.startTime = Date.now()
    updatedTable.pausedDuration = 0
    updatedTable.remark = remark || ''
    saveTables(tables.value)
  }
  closeOrderModal()
}

function handlePause({ table, remark }) {
  const updatedTable = tables.value.find(t => t.id === table.id)
  if (updatedTable) {
    updatedTable.status = 'paused'
    updatedTable.pausedDuration = Math.floor(getElapsedSeconds(table) / 60) + (updatedTable.pausedDuration || 0)
    updatedTable.startTime = null
    updatedTable.remark = remark || updatedTable.remark
    saveTables(tables.value)
  }
  closeOrderModal()
}

function handleResume({ table, remark }) {
  const updatedTable = tables.value.find(t => t.id === table.id)
  if (updatedTable) {
    updatedTable.status = 'working'
    updatedTable.startTime = Date.now()
    updatedTable.remark = remark || updatedTable.remark
    saveTables(tables.value)
  }
  closeOrderModal()
}

async function handleCheckout({ table, remark, memberPhone, payType, memberPayAmount }) {
  const totalSeconds = getElapsedSeconds(table) + (table.pausedDuration || 0) * 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const price = calculatePrice(totalMinutes, settings.value.pricePerHour, settings.value.packages)
  
  const order = {
    id: Date.now(),
    tableId: table.id,
    tableName: table.name,
    startTime: table.startTime || Date.now() - totalSeconds * 1000,
    endTime: Date.now(),
    duration: totalMinutes,
    price,
    package: null,
    remark: remark || table.remark || '',
    memberPhone: memberPhone || null,
    payType: payType || '现金',
    memberPayAmount: memberPayAmount || 0
  }
  
  orders.value.push(order)
  saveOrders(orders.value)
  
  // 同步到MySQL数据库
  try {
    await createOrder({
      tableId: table.id,
      tableName: table.name,
      startTime: order.startTime,
      endTime: order.endTime,
      duration: totalMinutes,
      price: price,
      packageName: null,
      remark: order.remark,
      memberPhone: memberPhone || null,
      payType: payType || '现金',
      memberPayAmount: memberPayAmount || 0
    })
  } catch (error) {
    console.error('订单同步到数据库失败:', error)
  }
  
  const updatedTable = tables.value.find(t => t.id === table.id)
  if (updatedTable) {
    updatedTable.status = 'free'
    updatedTable.startTime = null
    updatedTable.pausedDuration = 0
    updatedTable.remark = ''
    saveTables(tables.value)
  }
  
  closeOrderModal()
}

function addTable() {
  const maxId = tables.value.length > 0 ? Math.max(...tables.value.map(t => t.id)) : 0
  tables.value.push({
    id: maxId + 1,
    name: `桌台${maxId + 1}`,
    status: 'free'
  })
  saveTables(tables.value)
}

function deleteTable(table) {
  tables.value = tables.value.filter(t => t.id !== table.id)
  saveTables(tables.value)
}

function handleSaveSettings(newSettings) {
  settings.value = newSettings
  saveSettings(newSettings)
}

onMounted(() => {
  tables.value = loadTables()
  orders.value = loadOrders()
  settings.value = loadSettings()
  
  timer = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
