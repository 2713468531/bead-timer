// API基础地址 - 支持环境变量
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

// 通用请求方法
async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API请求失败:', error)
    return { success: false, message: '网络请求失败，请检查后端服务是否启动' }
  }
}

// ========== 会员相关API ==========

// 创建会员
export async function createMember(data) {
  return request('/member/create', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 查询会员
export async function searchMember(phone) {
  return request(`/member/search?phone=${phone}`)
}

// 获取会员列表
export async function getMemberList() {
  return request('/member/list')
}

// 更新会员信息
export async function updateMember(data) {
  return request('/member/update', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 注销会员
export async function cancelMember(id) {
  return request('/member/cancel', {
    method: 'PUT',
    body: JSON.stringify({ id })
  })
}

// 会员充值
export async function rechargeMember(data) {
  return request('/member/recharge', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取充值记录
export async function getRechargeHistory(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/member/recharge-history?${query}`)
}

// 会员消费
export async function consumeMember(data) {
  return request('/member/consume', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// ========== 订单相关API ==========

// 创建订单
export async function createOrder(data) {
  return request('/order/create', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取订单列表
export async function getOrderList(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/order/list?${query}`)
}

// 获取统计数据
export async function getStatistics(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/order/statistics?${query}`)
}