import express from 'express'
import { query, insert } from '../db.js'

const router = express.Router()

// 1. 创建订单（结账时调用）
router.post('/create', async (req, res) => {
  try {
    const { 
      tableId, 
      tableName, 
      startTime, 
      endTime, 
      duration, 
      price, 
      packageName, 
      remark, 
      memberPhone, 
      payType, 
      memberPayAmount 
    } = req.body
    
    // 验证必填字段
    if (!tableId || !tableName || !startTime || !endTime || duration === undefined || price === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: '订单信息不完整' 
      })
    }
    
    const orderId = await insert(
      `INSERT INTO orders 
       (table_id, table_name, start_time, end_time, duration, price, package_name, remark, member_phone, pay_type, member_pay_amount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tableId, 
        tableName, 
        new Date(startTime), 
        new Date(endTime), 
        duration, 
        price, 
        packageName || null, 
        remark || null, 
        memberPhone || null, 
        payType || '现金', 
        memberPayAmount || 0
      ]
    )
    
    res.json({ 
      success: true, 
      message: '订单创建成功',
      data: { orderId }
    })
  } catch (error) {
    console.error('创建订单失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '创建订单失败' 
    })
  }
})

// 2. 获取订单列表
router.get('/list', async (req, res) => {
  try {
    const { startDate, endDate, memberPhone } = req.query
    
    let sql = 'SELECT * FROM orders WHERE 1=1'
    const params = []
    
    if (startDate && endDate) {
      sql += ' AND DATE(end_time) BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }
    
    if (memberPhone) {
      sql += ' AND member_phone = ?'
      params.push(memberPhone)
    }
    
    sql += ' ORDER BY end_time DESC'
    
    const orders = await query(sql, params)
    
    const list = orders.map(o => ({
      id: o.id,
      tableId: o.table_id,
      tableName: o.table_name,
      startTime: o.start_time,
      endTime: o.end_time,
      duration: o.duration,
      price: parseFloat(o.price),
      packageName: o.package_name,
      remark: o.remark,
      memberPhone: o.member_phone,
      payType: o.pay_type,
      memberPayAmount: parseFloat(o.member_pay_amount)
    }))
    
    res.json({ 
      success: true, 
      data: list 
    })
  } catch (error) {
    console.error('获取订单列表失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '获取订单列表失败' 
    })
  }
})

// 3. 获取统计数据
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    let dateFilter = ''
    const params = []
    
    if (startDate && endDate) {
      dateFilter = ' AND DATE(end_time) BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }
    
    // 当日统计
    const today = new Date().toISOString().split('T')[0]
    const todayStats = await query(
      `SELECT 
        COUNT(*) as count,
        COALESCE(SUM(duration), 0) as totalDuration,
        COALESCE(SUM(price), 0) as totalRevenue
       FROM orders 
       WHERE DATE(end_time) = ?`,
      [today]
    )
    
    // 当日会员充值统计
    const todayRecharge = await query(
      `SELECT COALESCE(SUM(recharge_money), 0) as totalRecharge
       FROM member_recharge 
       WHERE DATE(create_time) = ?`,
      [today]
    )
    
    // 当日会员消费统计
    const todayMemberConsume = await query(
      `SELECT COALESCE(SUM(member_pay_amount), 0) as totalMemberPay
       FROM orders 
       WHERE DATE(end_time) = ? AND pay_type = '会员余额'`,
      [today]
    )
    
    // 筛选期间统计
    let filteredStats = [{ count: 0, totalDuration: 0, totalRevenue: 0 }]
    let filteredRecharge = [{ totalRecharge: 0 }]
    let filteredMemberConsume = [{ totalMemberPay: 0 }]
    
    if (startDate && endDate) {
      filteredStats = await query(
        `SELECT 
          COUNT(*) as count,
          COALESCE(SUM(duration), 0) as totalDuration,
          COALESCE(SUM(price), 0) as totalRevenue
         FROM orders 
         WHERE DATE(end_time) BETWEEN ? AND ?`,
        [startDate, endDate]
      )
      
      filteredRecharge = await query(
        `SELECT COALESCE(SUM(recharge_money), 0) as totalRecharge
         FROM member_recharge 
         WHERE DATE(create_time) BETWEEN ? AND ?`,
        [startDate, endDate]
      )
      
      filteredMemberConsume = await query(
        `SELECT COALESCE(SUM(member_pay_amount), 0) as totalMemberPay
         FROM orders 
         WHERE DATE(end_time) BETWEEN ? AND ? AND pay_type = '会员余额'`,
        [startDate, endDate]
      )
    }
    
    // 历史汇总
    const overallStats = await query(
      `SELECT 
        COUNT(*) as count,
        COALESCE(SUM(duration), 0) as totalDuration,
        COALESCE(SUM(price), 0) as totalRevenue
       FROM orders`
    )
    
    res.json({ 
      success: true, 
      data: {
        today: {
          count: todayStats[0].count,
          totalDuration: todayStats[0].totalDuration,
          totalRevenue: parseFloat(todayStats[0].totalRevenue),
          totalRecharge: parseFloat(todayRecharge[0].totalRecharge),
          totalMemberPay: parseFloat(todayMemberConsume[0].totalMemberPay)
        },
        filtered: {
          count: filteredStats[0].count,
          totalDuration: filteredStats[0].totalDuration,
          totalRevenue: parseFloat(filteredStats[0].totalRevenue),
          totalRecharge: parseFloat(filteredRecharge[0].totalRecharge),
          totalMemberPay: parseFloat(filteredMemberConsume[0].totalMemberPay)
        },
        overall: {
          count: overallStats[0].count,
          totalDuration: overallStats[0].totalDuration,
          totalRevenue: parseFloat(overallStats[0].totalRevenue)
        }
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '获取统计数据失败' 
    })
  }
})

export default router