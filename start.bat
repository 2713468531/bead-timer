@echo off
echo ========================================
echo 拼豆DIY会员系统启动脚本
echo ========================================
echo.

echo [1] 检查MySQL数据库...
echo 请确保MySQL已启动，并已执行database/init.sql创建数据库和表
echo.

echo [2] 启动后端API服务...
cd server
start cmd /k "npm install && npm start"
cd ..
echo 后端服务启动中... (端口: 3000)
echo.

echo [3] 启动前端开发服务器...
start cmd /k "npm install && npm run dev"
echo 前端服务启动中... (端口: 5173)
echo.

echo ========================================
echo 启动完成！
echo ========================================
echo 后端API: http://localhost:3000
echo 前端页面: http://localhost:5173
echo ========================================
echo 请等待服务启动完成后访问页面
echo.
pause