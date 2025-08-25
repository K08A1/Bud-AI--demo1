'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Target, 
  Trophy, 
  Users, 
  BookOpen, 
  Brain,
  Star,
  ArrowRight,
  Check
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI智能陪练',
      description: '个性化引导，温柔耐心的AI老师24小时陪伴'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: '5C能力培养',
      description: '全面提升表达、逻辑、探究、创造、习惯五大核心能力'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: '游戏化激励',
      description: '等级、徽章、称号系统，让学习充满乐趣'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '家庭共创',
      description: '亲子互动游戏，共同创作故事，增进感情'
    }
  ]

  const abilities = [
    { name: '表达力', color: 'bg-blue-500', width: '80%' },
    { name: '逻辑力', color: 'bg-purple-500', width: '75%' },
    { name: '探究力', color: 'bg-green-500', width: '85%' },
    { name: '创造力', color: 'bg-yellow-500', width: '70%' },
    { name: '习惯力', color: 'bg-pink-500', width: '90%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Bud AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                  登录
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105">
                  免费体验
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主hero区域 */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                AI驱动的
              </span>
              <br />
              <span className="text-gray-800">儿童成长伙伴</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              每天10分钟，在游戏中提升表达力、逻辑力、探究力、创造力和习惯力
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <button
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="flex items-center gap-2">
                    开始免费体验
                    <ArrowRight className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                  </span>
                </button>
              </Link>
              <button className="px-8 py-4 bg-white text-gray-800 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                观看介绍视频
              </button>
            </div>

            {/* 能力雷达展示 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">孩子的成长看得见</h3>
              <div className="space-y-4">
                {abilities.map((ability, index) => (
                  <motion.div
                    key={ability.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">{ability.name}</span>
                      <span className="text-sm text-gray-500">成长中...</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`${ability.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: ability.width }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            为什么选择 <span className="text-green-500">Bud AI</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 价格方案 */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            选择适合的方案
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 免费版 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">免费体验</h3>
              <p className="text-4xl font-bold mb-6">
                ¥0<span className="text-lg text-gray-500">/月</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>每日1个主任务</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>基础AI陪练</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>成长雷达图</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>简版周报</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-100 text-gray-800 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                立即开始
              </button>
            </motion.div>

            {/* 订阅版 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                推荐
              </div>
              <h3 className="text-2xl font-bold mb-4">完整版</h3>
              <p className="text-4xl font-bold mb-6">
                ¥39<span className="text-lg opacity-80">/月</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>无限任务挑战</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>高级AI陪练</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>完整周报分析</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>家庭游戏库</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>共创空间</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>专属头像装扮</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-gray-800 rounded-full font-semibold hover:shadow-lg transition-all">
                免费试用7天
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold">Bud AI</span>
              </div>
              <p className="text-gray-400">让每个孩子都能快乐成长</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">功能介绍</a></li>
                <li><a href="#" className="hover:text-white transition-colors">价格方案</a></li>
                <li><a href="#" className="hover:text-white transition-colors">使用指南</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">公司</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">加入我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">法律</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">用户协议</a></li>
                <li><a href="#" className="hover:text-white transition-colors">儿童隐私保护</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bud AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
