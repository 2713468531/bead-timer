import express from 'express'
import { query, insert, update } from '../db.js'

const router = express.Router()

// 1. 新开会员卡
router.post('/create', async (req, res) => {
  try {
    const { name, phone, remark = '' } = req.body
    
    // 验证必填字段
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名和手机号不能为空' 
      })
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '手机号格式不正确，请输入11位有效手机号' 
      })
    }
    
    // 检查手机号是否已存在
    const existingMembers = await query(
      'SELECT id FROM member WHERE phone = ? AND status = 1',
      [phone]
    )
    
    if (existingMembers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '该手机号已注册会员，请勿重复开卡' 
      })
    }
    
    // 插入新会员
    const memberId = await insert(
      'INSERT INTO member (name, phone, balance, remark, status) VALUES (?, ?, 0, ?, 1)',
      [name, phone, remark]
    )
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ 
      success: true, 
      message: '会员开卡成功',
      data: { id: memberId, name, phone, balance: 0, remark }
    }))
  } catch (error) {
    console.error('创建会员失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '创建会员失败' 
    })
  }
})

// 2. 根据手机号查询会员
router.get('/search', async (req, res) => {
  try {
    const { phone } = req.query
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: '请输入手机号' 
      })
    }
    
    const members = await query(
      'SELECT * FROM member WHERE phone = ? AND status = 1',
      [phone]
    )
    
    if (members.length === 0) {
      return res.json({ 
        success: false, 
        message: '未找到该会员' 
      })
    }
    
    const member = members[0]
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ 
      success: true, 
      data: {
        id: member.id,
        name: member.name,
        phone: member.phone,
        balance: parseFloat(member.balance),
        createTime: member.create_time,
        totalRecharge: parseFloat(member.total_recharge),
        totalConsume: parseFloat(member.total_consume),
        remark: member.remark || ''
      }
    }))
  } catch (error) {
    console.error('查询会员失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '查询会员失败' 
    })
  }
})

// 3. 获取会员列表
router.get('/list', async (req, res) => {
  try {
    const members = await query(
      'SELECT * FROM member WHERE status = 1 ORDER BY create_time DESC'
    )
    
    const list = members.map(m => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      balance: parseFloat(m.balance),
      createTime: m.create_time,
      totalRecharge: parseFloat(m.total_recharge),
      totalConsume: parseFloat(m.total_consume),
      remark: m.remark || '',
      status: m.status
    }))
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ 
      success: true, 
      data: list 
    }))
  } catch (error) {
    console.error('获取会员列表失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '获取会员列表失败' 
    })
  }
})

// 4. 更新会员信息（姓名、备注）
router.put('/update', async (req, res) => {
  try {
    const { id, name, remark } = req.body
    
    if (!id || !name) {
      return res.status(400).json({ 
        success: false, 
        message: '会员ID和姓名不能为空' 
      })
    }
    
    await update(
      'UPDATE member SET name = ?, remark = ? WHERE id = ?',
      [name, remark || '', id]
    )
    
    res.json({ 
      success: true, 
      message: '会员信息更新成功' 
    })
  } catch (error) {
    console.error('更新会员失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '更新会员失败' 
    })
  }
})

// 5. 注销会员（软删除）
router.put('/cancel', async (req, res) => {
  try {
    const { id } = req.body
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: '会员ID不能为空' 
      })
    }
    
    await update(
      'UPDATE member SET status = 0 WHERE id = ?',
      [id]
    )
    
    res.json({ 
      success: true, 
      message: '会员已注销' 
    })
  } catch (error) {
    console.error('注销会员失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '注销会员失败' 
    })
  }
})

// 6. 会员充值
router.post('/recharge', async (req, res) => {
  try {
    const { phone, amount } = req.body
    
    if (!phone || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: '手机号和充值金额不能为空，且金额必须大于0' 
      })
    }
    
    // 查询会员
    const members = await query(
      'SELECT * FROM member WHERE phone = ? AND status = 1',
      [phone]
    )
    
    if (members.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '未找到该会员或会员已注销' 
      })
    }
    
    const member = members[0]
    const newBalance = parseFloat(member.balance) + parseFloat(amount)
    
    // 更新会员余额和累计充值
    await update(
      'UPDATE member SET balance = ?, total_recharge = total_recharge + ? WHERE id = ?',
      [newBalance, amount, member.id]
    )
    
    // 插入充值记录
    await insert(
      'INSERT INTO member_recharge (member_id, phone, recharge_money, after_balance) VALUES (?, ?, ?, ?)',
      [member.id, phone, amount, newBalance]
    )
    
    res.json({ 
      success: true, 
      message: '充值成功',
      data: {
        balance: newBalance,
        rechargeAmount: parseFloat(amount)
      }
    })
  } catch (error) {
    console.error('充值失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '充值失败' 
    })
  }
})

// 7. 获取充值记录
router.get('/recharge-history', async (req, res) => {
  try {
    const { phone, startDate, endDate } = req.query
    
    let sql = `
      SELECT r.*, m.name as member_name 
      FROM member_recharge r 
      LEFT JOIN member m ON r.member_id = m.id 
      WHERE 1=1
    `
    const params = []
    
    if (phone) {
      sql += ' AND r.phone = ?'
      params.push(phone)
    }
    
    if (startDate && endDate) {
      sql += ' AND DATE(r.create_time) BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }
    
    sql += ' ORDER BY r.create_time DESC'
    
    const records = await query(sql, params)
    
    const list = records.map(r => ({
      id: r.id,
      memberId: r.member_id,
      phone: r.phone,
      memberName: r.member_name,
      rechargeMoney: parseFloat(r.recharge_money),
      afterBalance: parseFloat(r.after_balance),
      createTime: r.create_time
    }))
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ 
      success: true, 
      data: list 
    }))
  } catch (error) {
    console.error('获取充值记录失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '获取充值记录失败' 
    })
  }
})

// 8. 会员余额消费（内部调用）
router.post('/consume', async (req, res) => {
  try {
    const { phone, amount } = req.body
    
    if (!phone || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: '手机号和消费金额不能为空，且金额必须大于0' 
      })
    }
    
    // 查询会员
    const members = await query(
      'SELECT * FROM member WHERE phone = ? AND status = 1',
      [phone]
    )
    
    if (members.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '未找到该会员' 
      })
    }
    
    const member = members[0]
    const currentBalance = parseFloat(member.balance)
    
    if (currentBalance < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false, 
        message: '会员余额不足',
        data: { balance: currentBalance }
      })
    }
    
    const newBalance = currentBalance - parseFloat(amount)
    
    // 更新会员余额和累计消费
    await update(
      'UPDATE member SET balance = ?, total_consume = total_consume + ? WHERE id = ?',
      [newBalance, amount, member.id]
    )
    
    res.json({ 
      success: true, 
      message: '消费成功',
      data: {
        balance: newBalance,
        consumeAmount: parseFloat(amount)
      }
    })
  } catch (error) {
    console.error('会员消费失败:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || '会员消费失败' 
    })
  }
})

export default router