'use client'

import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-indigo-600"
              >
                🌱 Bud AI
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                立即体验
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 英雄区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI 驱动儿童
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              素质能力成长
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            基于5C能力模型（表达力、逻辑力、探究力、创造力、习惯力），
            通过AI个性化陪练，让每个孩子都能看见自己的成长轨迹
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all"
          >
            开始免费体验
          </motion.button>
        </motion.div>

        {/* 能力雷达图演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            5C能力雷达图
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="relative w-64 h-64 mx-auto">
              {/* 简化的雷达图 */}
              <div className="absolute inset-0 border-2 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-4 border-2 border-indigo-300 rounded-full"></div>
              <div className="absolute inset-8 border-2 border-indigo-400 rounded-full"></div>
              <div className="absolute inset-12 border-2 border-indigo-500 rounded-full"></div>
              
              {/* 能力点 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                <div className="text-xs text-center mt-2">表达力</div>
              </div>
              <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                <div className="text-xs text-center mt-2">逻辑力</div>
              </div>
              <div className="absolute bottom-1/4 right-0 transform translate-x-1/2 translate-y-1/2">
                <div className="w-4 h-4 bg-pink-600 rounded-full"></div>
                <div className="text-xs text-center mt-2">探究力</div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                <div className="text-xs text-center mt-2">创造力</div>
              </div>
              <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <div className="text-xs text-center mt-2">习惯力</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 特色功能 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            核心特色
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI个性化陪练",
                description: "基于孩子能力水平，生成专属学习任务和反馈"
              },
              {
                icon: "📊",
                title: "成长可视化",
                description: "雷达图、趋势线、徽章系统，让进步一目了然"
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "家庭共创空间",
                description: "亲子协作创作，AI辅助生成绘本和音频"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 价格方案 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            选择适合您的方案
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">免费版</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-6">¥0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  每日1个主任务
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  基础成长记录
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  简单周报
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold">
                开始使用
              </button>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">专业版</h3>
              <div className="text-4xl font-bold mb-6">¥29/月</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-300 mr-2">✓</span>
                  无限任务选择
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-2">✓</span>
                  详细AI分析报告
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-2">✓</span>
                  家庭游戏扩展包
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-2">✓</span>
                  共创内容下载
                </li>
              </ul>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold hover:bg-gray-50">
                立即升级
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">🌱 Bud AI</div>
            <p className="text-gray-400 mb-6">
              AI 驱动儿童素质能力成长系统
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Bud AI. 让每个孩子都能看见自己的成长轨迹。
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
