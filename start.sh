#!/bin/bash

echo "🚀 启动 Bud AI 项目..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node --version
npm --version

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 生成 Prisma 客户端
echo "🗄️ 生成 Prisma 客户端..."
npx prisma generate

# 检查环境变量
echo "🔐 检查环境变量..."
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    cp env.example .env
    echo "📝 请编辑 .env 文件，配置必要的环境变量："
    echo "   - DATABASE_URL: PostgreSQL 数据库连接"
    echo "   - JWT_SECRET: JWT 密钥"
    echo "   - OPENAI_API_KEY: OpenAI API 密钥"
    echo ""
    echo "配置完成后，请重新运行此脚本"
    exit 1
fi

# 检查数据库连接
echo "🔗 检查数据库连接..."
if npx prisma db push --accept-data-loss; then
    echo "✅ 数据库连接成功"
else
    echo "❌ 数据库连接失败，请检查 DATABASE_URL 配置"
    exit 1
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "📍 项目将在 http://localhost:3000 启动"
echo "📱 PWA 功能已启用，可在移动设备上安装"
echo ""
echo "🎯 功能特性："
echo "   - 儿童端：任务挑战、AI陪练、成长追踪、共创空间"
echo "   - 家长端：周报查看、家庭游戏、成长洞察"
echo "   - AI 驱动：个性化任务、智能评估、陪练对话"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev 