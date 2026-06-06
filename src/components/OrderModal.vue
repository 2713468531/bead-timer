<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
      <div class="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <p class="text-white/80 text-sm">{{ table?.name }}</p>
      </div>
      
      <div class="p-6 space-y-4">
        <div v-if="table?.status !== 'free'" class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">开单时间</span>
              <p class="font-semibold">{{ formatDateTime(table?.startTime) }}</p>
            </div>
            <div>
              <span class="text-gray-500">当前时长</span>
              <p class="font-semibold text-danger">{{ displayTime }}</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
            <input
              type="text"
              v-model="remark"
              placeholder="输入备注信息，如：顾客要求、特殊需求等"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              maxlength="50"
            />
          </div>
          
          <div v-if="table?.status !== 'free'">
            <label class="block text-sm font-medium text-gray-700 mb-1">绑定会员卡（可选）</label>
            <input
              type="text"
              v-model="memberPhone"
              placeholder="输入会员手机号"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              maxlength="11"
            />
            
            <div v-if="memberInfo" class="mt-2 bg-success/10 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm text-gray-600">会员：{{ memberInfo.name }}</span>
                  <span class="text-sm text-gray-600 ml-2">余额：</span>
                  <span class="text-lg font-bold text-success">¥{{ memberInfo.balance.toFixed(2) }}</span>
                </div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="useMemberBalance"
                    class="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span class="text-sm font-medium text-gray-700">余额抵扣</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="table?.status === 'free'" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">选择套餐（可选）</label>
            <select
              v-model="selectedPackage"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">不使用套餐</option>
              <option v-for="pkg in settings.packages" :key="pkg.name" :value="pkg.name">
                {{ pkg.name }} - ¥{{ pkg.price }}
              </option>
            </select>
          </div>
        </div>
        
        <div v-if="table?.status !== 'free'" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">消费金额</label>
            <div class="text-3xl font-bold text-primary">¥{{ calculatedPrice.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      
      <div class="flex gap-3 p-6 pt-0">
        <button
          v-if="table?.status === 'free'"
          @click="handleStart"
          class="btn-primary flex-1"
        >
          开启制作
        </button>
        
        <template v-else-if="table?.status === 'working'">
          <button @click="handlePause" class="btn-warning flex-1">
            暂停制作
          </button>
          <button @click="handleCheckout" class="btn-success flex-1">
            结算账单
          </button>
        </template>
        
        <template v-else-if="table?.status === 'paused'">
          <button @click="handleResume" class="btn-success flex-1">
            恢复制作
          </button>
          <button @click="handleCheckout" class="btn-primary flex-1">
            结算账单
          </button>
        </template>
        
        <button @click="$emit('close')" class="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
          取消
        </button>
      </div>
    </div>
    
    <!-- 余额不足提示弹窗 -->
    <div v-if="showInsufficientBalance" class="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-warning mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.542 0 2.502-1.667 1.738-3.036l-6.88-12.636c-.77-1.416-2.694-1.416-3.464 0l-6.88 12.636c-.764 1.369.196 3.036 1.738 3.036z"></path>
          </svg>
          <h3 class="text-lg font-bold text-gray-800 mb-2">余额不足</h3>
          <p class="text-gray-600 mb-2">
            当前余额：<span class="font-bold text-success">¥{{ memberInfo?.balance.toFixed(2) }}</span>
          </p>
          <p class="text-gray-600 mb-6">
            账单金额：<span class="font-bold text-danger">¥{{ calculatedPrice.toFixed(2) }}</span>
          </p>
          <div class="flex gap-3">
            <button @click="closeInsufficientBalance" class="btn-secondary flex-1">
              取消会员抵扣
            </button>
            <button @click="showInsufficientBalance = false" class="btn-primary flex-1">
              前去充值
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { formatDateTime, formatDuration, calculatePrice } from '../utils/price'
import { searchMember, consumeMember } from '../utils/api'

const props = defineProps({
  visible: Boolean,
  table: Object,
  settings: Object,
  elapsedSeconds: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'start', 'pause', 'resume', 'checkout'])

const selectedPackage = ref('')
const remark = ref('')
const memberPhone = ref('')
const memberInfo = ref(null)
const useMemberBalance = ref(false)
const showInsufficientBalance = ref(false)

watch(() => props.visible, (val) => {
  if (val && props.table) {
    remark.value = props.table.remark || ''
  }
  if (!val) {
    selectedPackage.value = ''
    memberPhone.value = ''
    memberInfo.value = null
    useMemberBalance.value = false
  }
})

// 监听手机号输入，自动查询会员
watch(memberPhone, async (val) => {
  if (val && val.length === 11 && /^1[3-9]\d{9}$/.test(val)) {
    const res = await searchMember(val)
    if (res.success) {
      memberInfo.value = res.data
    } else {
      memberInfo.value = null
    }
  } else {
    memberInfo.value = null
    useMemberBalance.value = false
  }
})

const title = computed(() => {
  if (!props.table) return ''
  const map = {
    free: '开单计时',
    working: '制作中',
    paused: '暂停中'
  }
  return map[props.table.status] || ''
})

const displayTime = computed(() => {
  const pausedSeconds = (props.table?.pausedDuration || 0) * 60
  const totalSeconds = props.elapsedSeconds + pausedSeconds
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const currentDuration = computed(() => {
  return Math.floor(props.elapsedSeconds / 60) + (props.table?.pausedDuration || 0)
})

const calculatedPrice = computed(() => {
  const pkg = props.settings.packages.find(p => p.name === selectedPackage.value)
  if (pkg) {
    return pkg.price
  }
  return calculatePrice(currentDuration.value, props.settings.pricePerHour, props.settings.packages)
})

// 会员余额是否足够
const isBalanceEnough = computed(() => {
  if (!memberInfo.value || !useMemberBalance.value) return false
  return memberInfo.value.balance >= calculatedPrice.value
})

function handleStart() {
  emit('start', { table: props.table, package: selectedPackage.value, remark: remark.value })
}

function handlePause() {
  emit('pause', { table: props.table, remark: remark.value })
}

function handleResume() {
  emit('resume', { table: props.table, remark: remark.value })
}

async function handleCheckout() {
  // 如果选择会员余额支付
  if (useMemberBalance.value && memberInfo.value) {
    if (!isBalanceEnough.value) {
      showInsufficientBalance.value = true
      return
    }
    
    // 先扣除会员余额
    const consumeRes = await consumeMember({
      phone: memberPhone.value,
      amount: calculatedPrice.value
    })
    
    if (!consumeRes.success) {
      showInsufficientBalance.value = true
      return
    }
    
    emit('checkout', {
      table: props.table,
      package: selectedPackage.value,
      remark: remark.value,
      memberPhone: memberPhone.value,
      payType: '会员余额',
      memberPayAmount: calculatedPrice.value
    })
  } else {
    emit('checkout', {
      table: props.table,
      package: selectedPackage.value,
      remark: remark.value,
      memberPhone: memberPhone.value || null,
      payType: '现金',
      memberPayAmount: 0
    })
  }
}

function closeInsufficientBalance() {
  showInsufficientBalance.value = false
  useMemberBalance.value = false
}
</script>
