import express from 'express'
import cors from 'cors'
import { testConnection, query } from './db.js'
import memberRoutes from './routes/member.js'
import orderRoutes from './routes/order.js'

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

// 根路径
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '拼豆DIY会员系统API服务',
    version: '1.0.0',
    health: '/api/health'
  })
})

// 路由
app.use('/api/member', memberRoutes)
app.use('/api/order', orderRoutes)

// 数据库初始化
app.get('/api/init-db', async (req, res) => {
  try {
    const createMemberTable = `
      CREATE TABLE IF NOT EXISTS member (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(11) NOT NULL,
        balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        total_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_consume DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        remark VARCHAR(255) DEFAULT NULL,
        status TINYINT(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (id),
        UNIQUE KEY uk_phone (phone),
        KEY idx_status (status),
        KEY idx_create_time (create_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    
    const createRechargeTable = `
      CREATE TABLE IF NOT EXISTS member_recharge (
        id INT(11) NOT NULL AUTO_INCREMENT,
        member_id INT(11) NOT NULL,
        phone VARCHAR(11) NOT NULL,
        recharge_money DECIMAL(10,2) NOT NULL,
        after_balance DECIMAL(10,2) NOT NULL,
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_member_id (member_id),
        KEY idx_phone (phone),
        KEY idx_create_time (create_time),
        CONSTRAINT fk_recharge_member FOREIGN KEY (member_id) REFERENCES member (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT(11) NOT NULL AUTO_INCREMENT,
        table_id INT(11) NOT NULL,
        table_name VARCHAR(50) NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        duration INT(11) NOT NULL DEFAULT 0,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        package_name VARCHAR(100) DEFAULT NULL,
        remark VARCHAR(255) DEFAULT NULL,
        member_phone VARCHAR(11) DEFAULT NULL,
        pay_type VARCHAR(20) NOT NULL DEFAULT '现金',
        member_pay_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_table_id (table_id),
        KEY idx_start_time (start_time),
        KEY idx_end_time (end_time),
        KEY idx_member_phone (member_phone),
        KEY idx_pay_type (pay_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    
    await query(createMemberTable)
    await query(createRechargeTable)
    await query(createOrdersTable)
    
    res.json({ 
      success: true, 
      message: '数据库表初始化成功' 
    })
  } catch (error) {
    console.error('数据库初始化失败:', error)
    res.status(500).json({ 
      success: false, 
      message: '数据库初始化失败: ' + error.message 
    })
  }
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ 
    success: false, 
    message: err.message || '服务器内部错误' 
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API路径不存在' 
  })
})

// 启动服务器
async function startServer() {
  const dbConnected = await testConnection()
  
  if (!dbConnected) {
    console.error('警告：数据库连接失败，但服务器将继续启动')
    console.error('请检查数据库配置或稍后再试')
  }
  
  app.listen(PORT, () => {
    console.log(`✓ 服务器已启动: http://localhost:${PORT}`)
    console.log(`✓ API文档: http://localhost:${PORT}/api/health`)
  })
}

startServer()