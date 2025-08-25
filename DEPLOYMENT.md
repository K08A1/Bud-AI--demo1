# 🚀 Bud AI 部署指南

## GitHub 部署步骤

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `bud-ai`
   - Description: `AI 驱动儿童素质能力成长系统`
   - 选择 Public 或 Private
   - 不要勾选 "Add a README file"（我们已有）
4. 点击 "Create repository"

### 2. 推送代码到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/bud-ai.git

# 添加所有文件
git add .

# 提交代码
git commit -m "🎉 初始提交：Bud AI 儿童素质能力成长系统"

# 推送到主分支
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库页面：

1. 点击 "Settings" → "Secrets and variables" → "Actions"
2. 添加以下 Secrets：

#### 必需的环境变量：
- `DATABASE_URL`: 生产环境数据库连接字符串
- `JWT_SECRET`: JWT 签名密钥
- `OPENAI_API_KEY`: OpenAI API 密钥

#### Vercel 部署相关：
- `VERCEL_TOKEN`: Vercel 访问令牌
- `ORG_ID`: Vercel 组织 ID
- `PROJECT_ID`: Vercel 项目 ID

### 4. 获取 Vercel 配置信息

#### 安装 Vercel CLI：
```bash
npm i -g vercel
```

#### 登录并获取配置：
```bash
vercel login
vercel link
```

这会生成 `.vercel` 文件夹，包含 `orgId` 和 `projectId`。

### 5. 自动部署

配置完成后，每次推送到 `main` 分支都会自动触发部署。

## 部署平台选择

### 推荐：Vercel（免费）
- 完美支持 Next.js
- 自动 HTTPS
- 全球 CDN
- 自动预览部署

### 替代：Netlify
- 同样支持 Next.js
- 免费额度充足
- 表单处理功能

### 替代：Railway
- 支持数据库部署
- 适合全栈应用
- 有免费额度

## 环境变量配置

### 生产环境 (.env.production)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo-preview"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_NAME="Bud AI"
```

### 开发环境 (.env.local)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="dev-secret-key"
JWT_EXPIRES_IN="30d"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo-preview"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bud AI (Dev)"
```

## 数据库部署

### PostgreSQL 推荐服务：

1. **Supabase** (免费)
   - 免费额度：500MB 数据库
   - 自动备份
   - 实时订阅

2. **Neon** (免费)
   - 免费额度：3GB 数据库
   - 无服务器架构
   - 分支功能

3. **Railway** (免费)
   - 免费额度：$5/月
   - 简单部署
   - 自动扩展

### 数据库初始化：
```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 查看数据库（可选）
npx prisma studio
```

## 域名配置

### 自定义域名：
1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书自动生成

### 子域名：
- `app.yourdomain.com` - 主应用
- `api.yourdomain.com` - API 端点

## 监控和维护

### 性能监控：
- Vercel Analytics
- Core Web Vitals
- 错误追踪

### 日志管理：
- Vercel 函数日志
- 数据库查询日志
- 用户行为分析

## 故障排除

### 常见问题：

1. **构建失败**
   - 检查环境变量
   - 验证依赖版本
   - 查看构建日志

2. **数据库连接失败**
   - 检查 DATABASE_URL
   - 验证网络访问
   - 确认数据库状态

3. **API 调用失败**
   - 检查 OpenAI API 密钥
   - 验证 API 限制
   - 查看错误日志

### 获取帮助：
- GitHub Issues
- Vercel 支持
- 项目文档

## 安全注意事项

1. **环境变量**：永远不要提交到代码仓库
2. **API 密钥**：定期轮换，使用最小权限
3. **数据库**：启用连接池，限制并发连接
4. **HTTPS**：确保所有通信都通过 HTTPS
5. **CORS**：正确配置跨域访问策略

---

🎯 **部署完成后，您的 Bud AI 应用就可以在全球范围内访问了！** 