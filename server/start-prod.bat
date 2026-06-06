@echo off
echo ========================================
echo   拼豆DIY会员系统 - 生产环境启动
echo ========================================
echo.

REM 设置环境变量
set NODE_ENV=production
set PORT=3000

echo [1] 检查端口占用...
netstat -ano | findstr :3000
if %ERRORLEVEL% EQU 0 (
    echo 警告：端口3000已被占用，正在停止...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a
    )
    timeout /t 2 /nobreak >nul
)

echo [2] 启动后端API服务...
start "Bead Timer Server" cmd /k "node index.js"

echo [3] 等待服务启动...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   服务启动完成！
echo ========================================
echo   后端API: http://localhost:3000
echo   健康检查: http://localhost:3000/api/health
echo ========================================
echo.
echo 提示：不要关闭此窗口！
pause
