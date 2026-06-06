<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-700">幸运抽奖</h2>
      <button @click="showPrizeModal = true" class="btn-secondary">
        + 管理奖品
      </button>
    </div>

    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
      <div class="text-center">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">幸运转盘</h3>
        <p class="text-gray-600 mb-6">点击开始抽奖，祝你好运！</p>
        
        <div class="relative w-72 h-72 mx-auto mb-6">
          <div class="absolute inset-0 rounded-full border-8 border-white shadow-2xl overflow-hidden">
            <div
              class="w-full h-full transition-transform duration-1000 ease-out"
              :style="{ transform: `rotate(${rotation}deg)` }"
            >
              <svg viewBox="0 0 200 200" class="w-full h-full">
                <g v-for="(prize, index) in activePrizes" :key="index">
                  <path
                    :d="getSlicePath(index, activePrizes.length)"
                    :fill="getSliceColor(index)"
                  />
                  <text
                    :x="getTextX(index, activePrizes.length)"
                    :y="getTextY(index, activePrizes.length)"
                    text-anchor="middle"
                    fill="white"
                    font-size="12"
                    font-weight="bold"
                    :transform="`rotate(${getTextRotation(index, activePrizes.length)}, ${getTextX(index, activePrizes.length)}, ${getTextY(index, activePrizes.length)})`"
                  >
                    {{ prize.name }}
                  </text>
                </g>
              </svg>
            </div>
          </div>
          
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
               :class="{ 'animate-pulse': isSpinning }"
               @click="startLottery">
            <svg v-if="!isSpinning" class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <svg v-else class="w-8 h-8 text-purple-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          
          <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent border-b-yellow-400"></div>
        </div>
        
        <button
          @click="startLottery"
          :disabled="isSpinning"
          class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ isSpinning ? '抽奖中...' : '开始抽奖' }}
        </button>
      </div>
    </div>

    <div v-if="lastWinner" class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600">恭喜中奖</p>
          <p class="text-xl font-bold text-orange-500">{{ lastWinner.name }}</p>
          <p class="text-sm text-gray-500">{{ formatDateTime(lastWinner.time) }}</p>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-700 mb-4">中奖记录</h3>
      <div v-if="lotteryHistory.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p class="text-gray-400 mt-3">暂无中奖记录</p>
      </div>
      <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">奖品</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">中奖时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in lotteryHistory" :key="index" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getPrizeBgClass(record.prize)">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <span class="font-medium text-gray-800">{{ record.prize }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500">{{ formatDateTime(record.time) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showPrizeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">奖品管理</h3>
          <button @click="showPrizeModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4 mb-6">
          <div v-for="(prize, index) in prizes" :key="index" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              v-model="prize.name"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="奖品名称"
            />
            <button
              @click="removePrize(index)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <button @click="addPrize" class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors">
          + 添加奖品
        </button>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="showPrizeModal = false"
            class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            @click="savePrizes"
            class="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDateTime } from '../utils/price'
import { loadPrizes, savePrizes as savePrizesToStorage, loadLotteryHistory, saveLotteryHistory } from '../utils/storage'

const prizes = ref([
  { name: '免费体验券' },
  { name: '9折优惠券' },
  { name: '小礼品一份' },
  { name: '谢谢参与' },
  { name: '5元抵扣券' },
  { name: '精美书签' }
])

const activePrizes = computed(() => prizes.value.filter(p => p.name.trim()))

const lotteryHistory = ref([])
const lastWinner = ref(null)
const isSpinning = ref(false)
const rotation = ref(0)
const showPrizeModal = ref(false)

const sliceColors = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444',
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'
]

function getSlicePath(index, total) {
  const angle = (360 / total) * index
  const nextAngle = angle + (360 / total)
  const startRad = (angle - 90) * Math.PI / 180
  const endRad = (nextAngle - 90) * Math.PI / 180
  const x1 = 100 + 90 * Math.cos(startRad)
  const y1 = 100 + 90 * Math.sin(startRad)
  const x2 = 100 + 90 * Math.cos(endRad)
  const y2 = 100 + 90 * Math.sin(endRad)
  const largeArcFlag = total <= 4 ? 0 : 1
  return `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

function getSliceColor(index) {
  return sliceColors[index % sliceColors.length]
}

function getTextX(index, total) {
  const angle = (360 / total) * index + (360 / total) / 2
  const rad = (angle - 90) * Math.PI / 180
  return 100 + 60 * Math.cos(rad)
}

function getTextY(index, total) {
  const angle = (360 / total) * index + (360 / total) / 2
  const rad = (angle - 90) * Math.PI / 180
  return 100 + 60 * Math.sin(rad)
}

function getTextRotation(index, total) {
  return (360 / total) * index + (360 / total) / 2
}

function getPrizeBgClass(prizeName) {
  if (prizeName.includes('免费') || prizeName.includes('券')) return 'bg-gradient-to-br from-purple-500 to-pink-500'
  if (prizeName.includes('礼品') || prizeName.includes('书签')) return 'bg-gradient-to-br from-yellow-400 to-orange-400'
  return 'bg-gradient-to-br from-blue-500 to-cyan-500'
}

function addPrize() {
  prizes.value.push({ name: '' })
}

function removePrize(index) {
  prizes.value.splice(index, 1)
}

function savePrizes() {
  savePrizesToStorage(prizes.value)
  showPrizeModal.value = false
}

function startLottery() {
  if (isSpinning.value || activePrizes.value.length === 0) return
  
  isSpinning.value = true
  const randomPrizeIndex = Math.floor(Math.random() * activePrizes.value.length)
  const spinAngle = 360 * 10 + (360 / activePrizes.value.length) * (activePrizes.value.length - randomPrizeIndex) + 180
  
  rotation.value = spinAngle
  
  setTimeout(() => {
    isSpinning.value = false
    const winner = activePrizes.value[randomPrizeIndex]
    lastWinner.value = {
      name: winner.name,
      time: Date.now()
    }
    
    lotteryHistory.value.unshift({
      prize: winner.name,
      time: Date.now()
    })
    
    if (lotteryHistory.value.length > 50) {
      lotteryHistory.value = lotteryHistory.value.slice(0, 50)
    }
    
    saveLotteryHistory(lotteryHistory.value)
  }, 5000)
}

onMounted(() => {
  const savedPrizes = loadPrizes()
  if (savedPrizes && savedPrizes.length > 0) {
    prizes.value = savedPrizes
  }
  
  lotteryHistory.value = loadLotteryHistory() || []
  if (lotteryHistory.value.length > 0) {
    lastWinner.value = {
      name: lotteryHistory.value[0].prize,
      time: lotteryHistory.value[0].time
    }
  }
})
</script>
