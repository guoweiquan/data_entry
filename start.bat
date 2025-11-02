@echo off
echo ========================================
echo 报名信息管理系统 - 启动脚本
echo ========================================
echo.

echo 检查依赖安装情况...
if not exist "node_modules" (
    echo 正在安装后端依赖...
    call npm install
)

if not exist "frontend\node_modules" (
    echo 正在安装前端依赖...
    cd frontend
    call npm install
    cd ..
)

echo.
echo 启动后端服务...
start "后端服务" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo 启动前端服务...
start "前端服务" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 服务启动完成！
echo 后端服务: http://localhost:3000
echo 前端应用: http://localhost:5173
echo ========================================
echo.
echo 按任意键退出...
pause >nul