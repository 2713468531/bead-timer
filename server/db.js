import mysql from 'mysql2/promise'

// 数据库连接配置 - 支持环境变量
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'bead_timer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
  collation: 'utf8mb4_unicode_ci',
  initSqls: ['SET NAMES utf8mb4', 'SET CHARACTER SET utf8mb4']
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

// 监听连接创建事件，设置字符集
pool.on('connection', (connection) => {
  connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci')
  connection.query('SET CHARACTER SET utf8mb4')
})

// 测试数据库连接
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    await connection.execute('SET NAMES utf8mb4')
    await connection.execute('SET CHARACTER SET utf8mb4')
    console.log('✓ 数据库连接成功')
    connection.release()
    return true
  } catch (error) {
    console.error('✗ 数据库连接失败:', error.message)
    return false
  }
}

// 执行查询
export async function query(sql, params = []) {
  let connection
  try {
    connection = await pool.getConnection()
    await connection.query('SET NAMES utf8mb4')
    const [rows] = await connection.query(sql, params)
    return rows
  } catch (error) {
    console.error('SQL执行错误:', error)
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// 执行插入并返回插入ID
export async function insert(sql, params = []) {
  let connection
  try {
    connection = await pool.getConnection()
    await connection.query('SET NAMES utf8mb4')
    const [result] = await connection.query(sql, params)
    return result.insertId
  } catch (error) {
    console.error('SQL插入错误:', error)
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// 执行更新并返回影响行数
export async function update(sql, params = []) {
  let connection
  try {
    connection = await pool.getConnection()
    await connection.query('SET NAMES utf8mb4')
    const [result] = await connection.query(sql, params)
    return result.affectedRows
  } catch (error) {
    console.error('SQL更新错误:', error)
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export default pool