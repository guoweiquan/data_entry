#!/bin/bash

echo "========================================"
echo "报名信息管理系统 - 启动脚本"
echo "========================================"
echo

echo "检查依赖安装情况..."
if [ ! -d "node_modules" ]; then
    echo "正在安装后端依赖..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "正在安装前端依赖..."
    cd frontend
    npm install
    cd ..
fi

echo
echo "启动后端服务..."
gnome-terminal --title="后端服务" -- bash -c "npm run dev; exec bash" &

sleep 3

echo "启动前端服务..."
gnome-terminal --title="前端服务" -- bash -c "cd frontend && npm run dev; exec bash" &

echo
echo "========================================"
echo "服务启动完成！"
echo "后端服务: http://localhost:3000"
echo "前端应用: http://localhost:5173"
echo "========================================"
echo
echo "按 Ctrl+C 退出..."
wait