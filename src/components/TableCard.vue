<template>
  <div>
    <div
      class="table-card p-4"
      :class="[
        table.status === 'free' ? 'bg-white border-2 border-success/30 hover:border-success' : '',
        table.status === 'working' ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-danger/30' : '',
        table.status === 'paused' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-warning/30' : ''
      ]"
      @click="$emit('select', table)"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold text-gray-800">{{ table.name }}</h3>
        <div class="flex items-center gap-2">
          <span :class="[
            'status-badge',
            table.status === 'free' ? 'status-free' : '',
            table.status === 'working' ? 'status-working' : '',
            table.status === 'paused' ? 'status-paused' : ''
          ]">
            {{ statusText }}
          </span>
          <button
            v-if="table.status === 'free'"
            @click.stop="showConfirmModal = true"
            class="delete-btn p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="删除桌台"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="table.status !== 'free'" class="space-y-2">
        <div class="text-sm text-gray-600">
          <span class="font-semibold">开单时间：</span>
          {{ formatDateTime(table.startTime) }}
        </div>
        <div v-if="table.remark" class="text-sm text-gray-500 italic">
          备注：{{ table.remark }}
        </div>
        <div v-if="table.status === 'working'" class="text-center py-2">
          <div class="text-3xl font-bold" :class="table.status === 'working' ? 'text-danger' : 'text-warning'">
            {{ displayTime }}
          </div>
          <div class="text-xs text-gray-400 mt-1">已制作</div>
        </div>
        <div v-if="table.status === 'paused'" class="text-sm text-gray-600">
          <span class="font-semibold">暂停中，已累计：</span>
          {{ formatMinutesToHMS(table.pausedDuration || 0) }}
        </div>
      </div>
      
      <div v-else class="text-center py-4">
        <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <p class="text-gray-400 mt-2">点击开单</p>
      </div>
    </div>
    
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div class="flex items-center justify-center mb-4">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 text-center mb-2">确认删除</h3>
        <p class="text-gray-600 text-center mb-6">确定要删除桌台「{{ table.name }}」吗？此操作无法撤销。</p>
        <div class="flex gap-3">
          <button
            @click="showConfirmModal = false"
            class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 py-3 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            确定删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { formatDateTime, formatMinutesToHMS } from '../utils/price'

const props = defineProps({
  table: {
    type: Object,
    required: true
  },
  elapsedSeconds: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select', 'delete'])

const localElapsedSeconds = ref(0)
const showConfirmModal = ref(false)
let timer = null

const statusText = computed(() => {
  const map = {
    free: '空闲',
    working: '制作中',
    paused: '暂停'
  }
  return map[props.table.status] || '未知'
})

const displayTime = computed(() => {
  const pausedSeconds = (props.table.pausedDuration || 0) * 60
  const totalSeconds = localElapsedSeconds.value + pausedSeconds
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

function updateTime() {
  if (props.table.status === 'working' && props.table.startTime) {
    localElapsedSeconds.value = Math.floor((Date.now() - props.table.startTime) / 1000)
  }
}

function confirmDelete() {
  showConfirmModal.value = false
  emit('delete', props.table)
}

watch(() => props.table.status, (newStatus) => {
  if (newStatus === 'working') {
    startTimer()
  } else {
    stopTimer()
    if (newStatus === 'paused') {
      localElapsedSeconds.value = 0
    }
  }
})

watch(() => props.table.startTime, () => {
  if (props.table.status === 'working') {
    localElapsedSeconds.value = Math.floor((Date.now() - props.table.startTime) / 1000)
  }
})

function startTimer() {
  stopTimer()
  updateTime()
  timer = setInterval(updateTime, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  if (props.table.status === 'working') {
    startTimer()
  } else {
    localElapsedSeconds.value = props.elapsedSeconds
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>
