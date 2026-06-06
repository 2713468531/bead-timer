import express from 'express'
import cors from 'cors'
import { testConnection } from './db.js'
import memberRoutes from './routes/member.js'
import orderRoutes from './routes/order.js'

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())

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
    console.error('无法启动服务器：数据库连接失败')
    console.error('请确保MySQL服务已启动，且数据库配置正确')
    process.exit(1)
  }
  
  app.listen(PORT, () => {
    console.log(`✓ 服务器已启动: http://localhost:${PORT}`)
    console.log(`✓ API文档: http://localhost:${PORT}/api/health`)
  })
}

startServer()