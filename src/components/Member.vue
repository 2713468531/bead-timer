<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
      <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      会员管理
    </h2>
    
    <!-- 新开会员卡 -->
    <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 mb-6">
      <h3 class="font-semibold text-gray-700 mb-4">新开会员卡</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">会员姓名 *</label>
          <input
            type="text"
            v-model="newMember.name"
            placeholder="请输入姓名"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            maxlength="50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
          <input
            type="text"
            v-model="newMember.phone"
            placeholder="11位手机号"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            maxlength="11"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <input
            type="text"
            v-model="newMember.remark"
            placeholder="可选备注"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            maxlength="255"
          />
        </div>
      </div>
      <button @click="handleCreateMember" class="btn-primary mt-4">
        办理开卡
      </button>
    </div>
    
    <!-- 会员检索 -->
    <div class="bg-gray-50 rounded-xl p-6 mb-6">
      <h3 class="font-semibold text-gray-700 mb-4">会员检索</h3>
      <div class="flex gap-3">
        <input
          type="text"
          v-model="searchPhone"
          placeholder="输入手机号查询会员"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
          maxlength="11"
        />
        <button @click="handleSearchMember" class="btn-info">
          查询
        </button>
      </div>
      
      <div v-if="searchedMember" class="mt-4 bg-white rounded-lg p-4 border border-primary/20">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-500">姓名</span>
            <p class="font-semibold text-gray-800">{{ searchedMember.name }}</p>
          </div>
          <div>
            <span class="text-gray-500">手机号</span>
            <p class="font-semibold text-gray-800">{{ searchedMember.phone }}</p>
          </div>
          <div>
            <span class="text-gray-500">账户余额</span>
            <p class="font-semibold text-primary">¥{{ searchedMember.balance.toFixed(2) }}</p>
          </div>
          <div>
            <span class="text-gray-500">开卡时间</span>
            <p class="font-semibold text-gray-800">{{ formatDateTime(searchedMember.createTime) }}</p>
          </div>
          <div>
            <span class="text-gray-500">累计充值</span>
            <p class="font-semibold text-success">¥{{ searchedMember.totalRecharge.toFixed(2) }}</p>
          </div>
          <div>
            <span class="text-gray-500">累计消费</span>
            <p class="font-semibold text-danger">¥{{ searchedMember.totalConsume.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 会员充值 -->
    <div class="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-6 mb-6">
      <h3 class="font-semibold text-gray-700 mb-4">会员充值</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <input
            type="text"
            v-model="rechargePhone"
            placeholder="输入手机号"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            maxlength="11"
            @input="handleRechargePhoneInput"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">当前余额</label>
          <div class="px-4 py-3 bg-white border border-gray-200 rounded-lg text-lg font-bold text-primary">
            {{ rechargeMemberInfo ? `¥${rechargeMemberInfo.balance.toFixed(2)}` : '请先输入手机号' }}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">充值金额</label>
          <input
            type="number"
            v-model="rechargeAmount"
            placeholder="输入充值金额"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <button @click="handleRecharge" class="btn-success mt-4">
        确认充值
      </button>
    </div>
    
    <!-- 会员列表 -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-4">会员列表</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left font-semibold text-gray-600">序号</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">姓名</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">手机号</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">余额</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">开卡时间</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">累计充值</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">累计消费</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in memberList" :key="member.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3">
                <span v-if="!editingMember || editingMember.id !== member.id">{{ member.name }}</span>
                <input
                  v-else
                  type="text"
                  v-model="editingMember.name"
                  class="px-2 py-1 border border-gray-300 rounded"
                  maxlength="50"
                />
              </td>
              <td class="px-4 py-3 font-medium">{{ member.phone }}</td>
              <td class="px-4 py-3 font-semibold text-primary">¥{{ member.balance.toFixed(2) }}</td>
              <td class="px-4 py-3">{{ formatDateTime(member.createTime) }}</td>
              <td class="px-4 py-3 text-success">¥{{ member.totalRecharge.toFixed(2) }}</td>
              <td class="px-4 py-3 text-danger">¥{{ member.totalConsume.toFixed(2) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    v-if="!editingMember || editingMember.id !== member.id"
                    @click="startEdit(member)"
                    class="text-info hover:text-info/80 font-medium"
                  >
                    编辑
                  </button>
                  <template v-else>
                    <button @click="saveEdit" class="text-success hover:text-success/80 font-medium">
                      保存
                    </button>
                    <button @click="cancelEdit" class="text-gray-500 hover:text-gray-700 font-medium">
                      取消
                    </button>
                  </template>
                  <button
                    @click="handleCancelMember(member)"
                    class="text-danger hover:text-danger/80 font-medium"
                  >
                    注销
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="memberList.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400">
                暂无会员记录
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 充值明细 -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-700">充值明细</h3>
        <div class="flex gap-3">
          <input
            type="date"
            v-model="rechargeStartDate"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <span class="text-gray-400 self-center">-</span>
          <input
            type="date"
            v-model="rechargeEndDate"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <button @click="loadRechargeHistory" class="btn-info px-4 py-2">
            筛选
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left font-semibold text-gray-600">充值时间</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">手机号</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">会员姓名</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">充值金额</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-600">充值后余额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in rechargeHistory" :key="record.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">{{ formatDateTime(record.createTime) }}</td>
              <td class="px-4 py-3 font-medium">{{ record.phone }}</td>
              <td class="px-4 py-3">{{ record.memberName }}</td>
              <td class="px-4 py-3 font-semibold text-success">¥{{ record.rechargeMoney.toFixed(2) }}</td>
              <td class="px-4 py-3 font-semibold text-primary">¥{{ record.afterBalance.toFixed(2) }}</td>
            </tr>
            <tr v-if="rechargeHistory.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-400">
                暂无充值记录
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 提示弹窗 -->
    <div v-if="showAlert" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-warning mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.542 0 2.502-1.667 1.738-3.036l-6.88-12.636c-.77-1.416-2.694-1.416-3.464 0l-6.88 12.636c-.764 1.369.196 3.036 1.738 3.036z"></path>
          </svg>
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ alertTitle }}</h3>
          <p class="text-gray-600 mb-6">{{ alertMessage }}</p>
          <button @click="closeAlert" class="btn-primary">
            确定
          </button>
        </div>
      </div>
    </div>
    
    <!-- 成功提示 -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-success mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-bold text-gray-800 mb-2">操作成功</h3>
          <p class="text-gray-600 mb-6">{{ successMessage }}</p>
          <button @click="closeSuccess" class="btn-success">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  createMember, 
  searchMember, 
  getMemberList, 
  updateMember, 
  cancelMember,
  rechargeMember,
  getRechargeHistory
} from '../utils/api'
import { formatDateTime } from '../utils/price'

// 新开会员卡
const newMember = ref({
  name: '',
  phone: '',
  remark: ''
})

// 会员检索
const searchPhone = ref('')
const searchedMember = ref(null)

// 会员充值
const rechargePhone = ref('')
const rechargeAmount = ref('')
const rechargeMemberInfo = ref(null)

// 会员列表
const memberList = ref([])
const editingMember = ref(null)

// 充值明细
const rechargeHistory = ref([])
const rechargeStartDate = ref(getDefaultDate())
const rechargeEndDate = ref(getDefaultDate())

function getDefaultDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// 提示弹窗
const showAlert = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')
const showSuccess = ref(false)
const successMessage = ref('')

// 加载会员列表
async function loadMemberList() {
  const res = await getMemberList()
  if (res.success) {
    memberList.value = res.data
  }
}

// 加载充值记录
async function loadRechargeHistory() {
  const params = {}
  if (rechargeStartDate.value && rechargeEndDate.value) {
    params.startDate = rechargeStartDate.value
    params.endDate = rechargeEndDate.value
  }
  const res = await getRechargeHistory(params)
  if (res.success) {
    rechargeHistory.value = res.data
  }
}

// 创建会员
async function handleCreateMember() {
  if (!newMember.value.name || !newMember.value.phone) {
    showAlert.value = true
    alertTitle.value = '信息不完整'
    alertMessage.value = '请填写会员姓名和手机号'
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(newMember.value.phone)) {
    showAlert.value = true
    alertTitle.value = '手机号格式错误'
    alertMessage.value = '请输入11位有效手机号'
    return
  }
  
  const res = await createMember(newMember.value)
  if (res.success) {
    showSuccess.value = true
    successMessage.value = '会员开卡成功！'
    newMember.value = { name: '', phone: '', remark: '' }
    loadMemberList()
  } else {
    showAlert.value = true
    alertTitle.value = '开卡失败'
    alertMessage.value = res.message
  }
}

// 查询会员
async function handleSearchMember() {
  if (!searchPhone.value) {
    showAlert.value = true
    alertTitle.value = '请输入手机号'
    alertMessage.value = '请输入要查询的会员手机号'
    return
  }
  
  const res = await searchMember(searchPhone.value)
  if (res.success) {
    searchedMember.value = res.data
  } else {
    showAlert.value = true
    alertTitle.value = '查询失败'
    alertMessage.value = res.message || '未找到该会员'
    searchedMember.value = null
  }
}

// 充值手机号输入时自动查询
async function handleRechargePhoneInput() {
  if (rechargePhone.value.length === 11 && /^1[3-9]\d{9}$/.test(rechargePhone.value)) {
    const res = await searchMember(rechargePhone.value)
    if (res.success) {
      rechargeMemberInfo.value = res.data
    } else {
      rechargeMemberInfo.value = null
    }
  } else {
    rechargeMemberInfo.value = null
  }
}

// 充值
async function handleRecharge() {
  if (!rechargePhone.value || !rechargeAmount.value) {
    showAlert.value = true
    alertTitle.value = '信息不完整'
    alertMessage.value = '请输入手机号和充值金额'
    return
  }
  
  if (!rechargeMemberInfo.value) {
    showAlert.value = true
    alertTitle.value = '会员不存在'
    alertMessage.value = '请先输入有效的会员手机号'
    return
  }
  
  const amount = parseFloat(rechargeAmount.value)
  if (amount <= 0) {
    showAlert.value = true
    alertTitle.value = '金额错误'
    alertMessage.value = '充值金额必须大于0'
    return
  }
  
  const res = await rechargeMember({
    phone: rechargePhone.value,
    amount: amount
  })
  
  if (res.success) {
    showSuccess.value = true
    successMessage.value = `充值成功！当前余额：¥${res.data.balance.toFixed(2)}`
    rechargeAmount.value = ''
    rechargeMemberInfo.value.balance = res.data.balance
    loadMemberList()
    loadRechargeHistory()
  } else {
    showAlert.value = true
    alertTitle.value = '充值失败'
    alertMessage.value = res.message
  }
}

// 开始编辑
function startEdit(member) {
  editingMember.value = { ...member }
}

// 保存编辑
async function saveEdit() {
  if (!editingMember.value.name) {
    showAlert.value = true
    alertTitle.value = '姓名不能为空'
    alertMessage.value = '请填写会员姓名'
    return
  }
  
  const res = await updateMember({
    id: editingMember.value.id,
    name: editingMember.value.name,
    remark: editingMember.value.remark
  })
  
  if (res.success) {
    showSuccess.value = true
    successMessage.value = '会员信息更新成功'
    editingMember.value = null
    loadMemberList()
  } else {
    showAlert.value = true
    alertTitle.value = '更新失败'
    alertMessage.value = res.message
  }
}

// 取消编辑
function cancelEdit() {
  editingMember.value = null
}

// 注销会员
async function handleCancelMember(member) {
  if (member.balance > 0) {
    showAlert.value = true
    alertTitle.value = '无法注销'
    alertMessage.value = `该会员余额还有 ¥${member.balance.toFixed(2)}，请先处理余额后再注销`
    return
  }
  
  const res = await cancelMember(member.id)
  if (res.success) {
    showSuccess.value = true
    successMessage.value = '会员已注销'
    loadMemberList()
  } else {
    showAlert.value = true
    alertTitle.value = '注销失败'
    alertMessage.value = res.message
  }
}

// 关闭提示
function closeAlert() {
  showAlert.value = false
}

function closeSuccess() {
  showSuccess.value = false
}

onMounted(() => {
  loadMemberList()
  loadRechargeHistory()
})
</script>