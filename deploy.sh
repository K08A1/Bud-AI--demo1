#!/bin/bash

# 🚀 Bud AI 快速部署脚本
# 使用方法: ./deploy.sh "提交信息"

set -e

echo "🌱 Bud AI 部署脚本启动..."

# 检查参数
if [ -z "$1" ]; then
    echo "❌ 请提供提交信息"
    echo "使用方法: ./deploy.sh \"提交信息\""
    exit 1
fi

COMMIT_MESSAGE="$1"

# 检查Git状态
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 检测到未提交的更改，正在添加..."
    git add .
else
    echo "✅ 工作目录干净，无需添加文件"
fi

# 提交更改
echo "💾 提交更改: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# 推送到远程仓库
echo "🚀 推送到远程仓库..."
git push origin main

echo "✅ 部署完成！"
echo ""
echo "📋 下一步操作："
echo "1. 在 GitHub 仓库中配置 Secrets"
echo "2. 连接 Vercel 进行自动部署"
echo "3. 配置生产环境数据库"
echo ""
echo "📖 详细说明请查看 DEPLOYMENT.md" 