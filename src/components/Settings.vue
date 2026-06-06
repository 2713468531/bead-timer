<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
      <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      价格设置
    </h2>
    
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5">
        <h3 class="font-semibold text-gray-700 mb-4">基础单价设置</h3>
        <div class="flex items-center gap-3">
          <span class="text-gray-500 text-lg">¥</span>
          <input
            type="number"
            v-model.number="localSettings.pricePerHour"
            class="w-40 px-4 py-3 text-2xl font-bold border-2 border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            min="0"
            step="1"
          />
          <span class="text-gray-600 text-lg">元/小时</span>
          <p class="text-sm text-gray-500 ml-4">不足1小时按分钟计价</p>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">包时套餐设置</h3>
          <button @click="addPackage" class="btn-primary text-sm py-2 px-4">
            + 添加套餐
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(pkg, index) in localSettings.packages"
            :key="index"
            class="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
          >
            <div class="flex-1">
              <input
                type="text"
                v-model="pkg.name"
                placeholder="套餐名称"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div class="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <input
                type="number"
                v-model.number="pkg.hours"
                placeholder="时长"
                class="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:ring-2 focus:ring-primary/50 focus:border-primary"
                min="0.5"
                step="0.5"
              />
              <span class="text-gray-500 text-sm">小时</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-lg">¥</span>
              <input
                type="number"
                v-model.number="pkg.price"
                placeholder="价格"
                class="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary"
                min="0"
                step="1"
              />
            </div>
            <div class="text-sm text-gray-400">
              <span v-if="pkg.hours > 0 && pkg.price > 0">
                省 ¥{{ ((pkg.hours * localSettings.pricePerHour) - pkg.price).toFixed(0) }}
              </span>
            </div>
            <button
              @click="removePackage(index)"
              class="text-red-400 hover:text-red-600 p-2 transition-colors"
              :disabled="localSettings.packages.length <= 0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div v-if="localSettings.packages.length === 0" class="text-center py-8 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p>暂无套餐，点击上方按钮添加</p>
          </div>
        </div>
      </div>
      
      <div class="bg-blue-50 rounded-xl p-5">
        <h3 class="font-semibold text-gray-700 mb-3">计费说明</h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">•</span>
            <span>结账时系统自动根据有效制作时长核算费用</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">•</span>
            <span>若时长匹配套餐，自动选用最优惠的套餐价格</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">•</span>
            <span>不足套餐时长按基础单价计算，精确到分钟</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="mt-8 flex justify-end gap-3">
      <button @click="resetSettings" class="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
        恢复默认
      </button>
      <button @click="saveSettings" class="btn-primary">
        保存设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defaultSettings } from '../utils/storage'

const props = defineProps({
  settings: Object,
  tables: Array
})

const emit = defineEmits(['save', 'addTable', 'updateTables'])

const localSettings = ref({ ...props.settings })

watch(() => props.settings, (val) => {
  localSettings.value = { ...val }
}, { deep: true })

function addPackage() {
  localSettings.value.packages.push({
    name: '新套餐',
    hours: 1,
    price: 0
  })
}

function removePackage(index) {
  if (localSettings.value.packages.length > 0) {
    localSettings.value.packages.splice(index, 1)
  }
}

function resetSettings() {
  localSettings.value = { ...defaultSettings }
}

function saveSettings() {
  emit('save', { ...localSettings.value })
}
</script>
