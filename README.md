# 🌱 Bud AI - AI驱动儿童素质能力成长系统

Bud AI 是一个基于人工智能的儿童素质能力成长系统，专注于培养儿童的5C核心能力：表达力(Expression)、逻辑力(Logic)、探究力(Exploration)、创造力(Creativity)和习惯力(Habit)。

## ✨ 核心特性

### 🎯 儿童端功能
- **AI诊断评估**: 智能分析孩子能力水平，制定个性化学习计划
- **任务挑战系统**: AI生成趣味任务，涵盖5C能力培养
- **AI陪练助手**: 温柔耐心的AI老师，引导式教学不直接给答案
- **成长追踪**: 雷达图可视化能力发展，徽章系统激励进步
- **共创空间**: 多人协作创作，培养合作精神和创造力
- **作品存档**: 记录成长轨迹，AI点评反馈

### 👨‍👩‍👧‍👦 家长端功能
- **孩子概览**: 实时查看学习进度和成就
- **AI周报**: 智能生成每周成长报告，洞察进步趋势
- **家庭游戏**: 推荐亲子互动游戏，增进感情提升能力
- **成长洞察**: 深度分析能力发展，预测成长趋势
- **提醒设置**: 学习提醒、习惯养成

### 🤖 AI驱动特性
- **个性化任务**: 基于能力水平和兴趣定制学习内容
- **智能评估**: 多维度分析任务完成质量
- **陪练对话**: 自然语言交互，引导式教学
- **周报生成**: 自动分析数据，生成专业成长报告
- **游戏推荐**: 智能匹配适合的家庭游戏

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **图表**: Recharts
- **PWA**: next-pwa

### 后端技术栈
- **运行时**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + bcryptjs
- **AI集成**: OpenAI GPT-4
- **缓存**: 内置内存缓存

### 核心架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   儿童端 PWA    │    │   家长端 PWA    │    │   AI 服务层     │
│                 │    │                 │    │                 │
│ • 任务挑战      │    │ • 孩子概览      │    │ • 任务生成      │
│ • AI陪练        │    │ • 周报查看      │    │ • 智能评估      │
│ • 成长追踪      │    │ • 家庭游戏      │    │ • 陪练对话      │
│ • 共创空间      │    │ • 成长洞察      │    │ • 周报生成      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Next.js API   │
                    │                 │
                    │ • 认证授权      │
                    │ • 数据管理      │
                    │ • 业务逻辑      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │                 │
                    │ • 用户数据      │
                    │ • 成长记录      │
                    │ • 任务数据      │
                    └─────────────────┘
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- PostgreSQL 12+
- OpenAI API 密钥

### 1. 克隆项目
```bash
git clone https://github.com/your-username/bud-ai.git
cd bud-ai
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下环境变量：
```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/bud_ai"

# JWT配置
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# OpenAI配置
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4-turbo-preview"

# 应用配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bud AI"
NEXT_PUBLIC_PWA_ENABLED="true"
```

### 4. 数据库初始化
```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 可选：查看数据库
npx prisma studio
```

### 5. 启动项目
```bash
# 使用启动脚本（推荐）
./start.sh

# 或手动启动
npm run dev
```

访问 http://localhost:3000 开始使用！

## 📱 PWA 安装指南

### 移动设备
1. 在浏览器中访问应用
2. 点击"添加到主屏幕"或"安装应用"
3. 确认安装，应用将出现在主屏幕

### 桌面设备
1. 在浏览器地址栏点击"安装"图标
2. 选择"安装 Bud AI"
3. 应用将作为独立窗口运行

## 🎮 使用流程

### 首次使用
1. **注册账号**: 使用手机号注册
2. **创建孩子档案**: 填写昵称、年级、兴趣
3. **AI能力评估**: 完成5个维度的能力测试
4. **开始学习**: 进入个性化学习计划

### 日常使用
1. **每日挑战**: 完成AI生成的个性化任务
2. **AI陪练**: 遇到困难时寻求AI帮助
3. **成长记录**: 查看能力雷达图和进步趋势
4. **共创活动**: 参与多人协作创作

### 家长查看
1. **孩子概览**: 查看学习进度和成就
2. **周报阅读**: 了解本周成长情况
3. **家庭游戏**: 选择适合的亲子游戏
4. **成长洞察**: 深度分析能力发展

## 🗄️ 数据库架构

### 核心数据表
- **User**: 用户账号信息
- **Child**: 孩子档案和5C能力分数
- **Task**: 任务定义和配置
- **TaskRecord**: 任务完成记录
- **Assessment**: AI能力评估记录
- **GrowthRecord**: 每日成长数据
- **WeeklyReport**: AI生成的周报
- **Badge**: 徽章定义
- **BadgeAward**: 徽章颁发记录
- **Work**: 作品存档
- **CoCreationTheme**: 共创主题
- **CoCreationContribution**: 共创贡献
- **FamilyGame**: 家庭游戏
- **CoachSession**: AI陪练会话

### 数据关系
```
User (1) ── (N) Child
Child (1) ── (N) TaskRecord
Child (1) ── (N) Assessment
Child (1) ── (N) GrowthRecord
Child (1) ── (N) WeeklyReport
Child (1) ── (N) BadgeAward
Child (1) ── (N) Work
Child (1) ── (N) CoCreationContribution
Task (1) ── (N) TaskRecord
CoCreationTheme (1) ── (N) CoCreationContribution
```

## 🔧 开发指南

### 项目结构
```
bud-ai/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── child/          # 儿童端页面
│   │   ├── parent/         # 家长端页面
│   │   └── globals.css     # 全局样式
│   ├── lib/                # 工具库
│   │   ├── prisma.ts       # 数据库客户端
│   │   ├── auth.ts         # 认证工具
│   │   ├── openai.ts       # AI 集成
│   │   └── store.ts        # 状态管理
│   └── components/         # 可复用组件
├── prisma/                 # 数据库架构
├── public/                 # 静态资源
└── docs/                   # 文档
```

### 开发命令
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 数据库操作
npm run db:generate    # 生成 Prisma 客户端
npm run db:push        # 推送数据库架构
npm run db:studio      # 打开数据库管理界面
```

### API 开发
- 所有API路由位于 `src/app/api/`
- 使用 Prisma 进行数据库操作
- 统一的错误处理和响应格式
- JWT 认证中间件

### 前端开发
- 使用 TypeScript 确保类型安全
- Tailwind CSS 进行样式设计
- Framer Motion 添加流畅动画
- Zustand 管理全局状态

## 🚀 部署指南

### Vercel 部署（推荐）
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署和更新

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量配置
生产环境需要配置：
- `DATABASE_URL`: 生产数据库连接
- `JWT_SECRET`: 强密钥
- `OPENAI_API_KEY`: OpenAI API密钥
- `NEXT_PUBLIC_APP_URL`: 生产域名

## 🔒 安全特性

- **JWT认证**: 安全的用户身份验证
- **密码加密**: bcryptjs 哈希密码
- **API保护**: 所有敏感接口需要认证
- **数据验证**: 输入数据严格验证
- **SQL注入防护**: Prisma ORM 自动防护

## 📊 性能优化

- **PWA缓存**: 离线访问和快速加载
- **图片优化**: Next.js 自动图片优化
- **代码分割**: 按需加载组件
- **数据库索引**: 优化查询性能
- **CDN支持**: 静态资源加速

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目主页: [https://github.com/your-username/bud-ai](https://github.com/your-username/bud-ai)
- 问题反馈: [Issues](https://github.com/your-username/bud-ai/issues)
- 功能建议: [Discussions](https://github.com/your-username/bud-ai/discussions)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**Bud AI** - 让每个孩子都能在AI的陪伴下快乐成长！ 🌟
