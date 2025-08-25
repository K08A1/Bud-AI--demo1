'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Trophy, 
  Target,
  Zap,
  BookOpen,
  Users,
  BarChart3,
  Award,
  Flame,
  Star,
  Gift,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function ChildHomePage() {
  const router = useRouter()
  const { currentChild, todayProgress, logout } = useStore()
  
  const [greeting, setGreeting] = useState('')
  const [xpAnimation, setXpAnimation] = useState(false)

  useEffect(() => {
    // 设置问候语
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('早上好')
    } else if (hour < 18) {
      setGreeting('下午好')
    } else {
      setGreeting('晚上好')
    }
  }, [])

  // 模拟数据（实际应从API获取）
  const childData = currentChild || {
    nickname: '小明',
    level: 3,
    xp: 450,
    streak: 7,
    globalTitle: '小探索家Ⅰ',
    expressionScore: 4.2,
    logicScore: 3.8,
    explorationScore: 4.5,
    creativityScore: 4.0,
    habitScore: 4.3,
  }

  const xpForNextLevel = 600
  const xpProgress = (childData.xp / xpForNextLevel) * 100

  const quickActions = [
    {
      id: 'daily',
      title: '今日挑战',
      subtitle: todayProgress.mainTaskCompleted ? '已完成' : '开始挑战',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-500',
      path: '/child/task/daily',
      highlight: !todayProgress.mainTaskCompleted,
    },
    {
      id: 'special',
      title: '专项训练',
      subtitle: '提升技能',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      path: '/child/task/special',
    },
    {
      id: 'cocreate',
      title: '共创空间',
      subtitle: '创作故事',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-teal-500',
      path: '/child/cocreate',
    },
    {
      id: 'growth',
      title: '成长记录',
      subtitle: '查看进步',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-pink-500 to-red-500',
      path: '/child/growth',
    },
  ]

  const achievements = [
    { id: 1, name: '连续7天', icon: '🔥', unlocked: true },
    { id: 2, name: '表达小达人', icon: '💬', unlocked: true },
    { id: 3, name: '探索精神', icon: '🔍', unlocked: false },
    { id: 4, name: '创意之星', icon: '⭐', unlocked: false },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部导航栏 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">{greeting}，</p>
                <p className="text-lg font-bold text-gray-800">{childData.nickname}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/child/settings')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 等级和经验值卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* 头像 */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {childData.nickname[0]}
              </div>
              
              {/* 等级信息 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-800">Lv.{childData.level}</span>
                </div>
                <p className="text-sm text-gray-600">{childData.globalTitle}</p>
              </div>
            </div>

            {/* 连续天数 */}
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-3xl font-bold text-orange-500">{childData.streak}</span>
              </div>
              <p className="text-xs text-gray-600">连续天数</p>
            </div>
          </div>

          {/* 经验值进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">经验值</span>
              <span className="text-gray-800 font-medium">{childData.xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              还需 {xpForNextLevel - childData.xp} XP 升级
            </p>
          </div>

          {/* 今日收获 */}
          {todayProgress.xpEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-green-50 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-700">今日已获得</span>
              </div>
              <span className="text-lg font-bold text-green-600">+{todayProgress.xpEarned} XP</span>
            </motion.div>
          )}
        </motion.div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.path}>
                <div className={`relative bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer ${
                  action.highlight ? 'ring-2 ring-green-500 ring-offset-2' : ''
                }`}>
                  {action.highlight && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.subtitle}</p>
                  <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 成就徽章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              我的成就
            </h2>
            <Link href="/child/badges" className="text-sm text-blue-500 hover:text-blue-600">
              查看全部
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`text-center p-3 rounded-xl transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs text-gray-700">{achievement.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 每日小贴士 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <Gift className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <p className="text-sm font-medium text-purple-800 mb-1">今日小贴士</p>
              <p className="text-sm text-purple-700">
                坚持每天完成挑战，连续7天可以获得"坚持小达人"徽章哦！加油！
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 底部标签栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link href="/child/home" className="flex flex-col items-center p-2 text-blue-500">
              <Sparkles className="w-6 h-6" />
              <span className="text-xs mt-1">首页</span>
            </Link>
            <Link href="/child/task/daily" className="flex flex-col items-center p-2 text-gray-600">
              <Target className="w-6 h-6" />
              <span className="text-xs mt-1">挑战</span>
            </Link>
            <Link href="/child/growth" className="flex flex-col items-center p-2 text-gray-600">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs mt-1">成长</span>
            </Link>
            <Link href="/child/cocreate" className="flex flex-col items-center p-2 text-gray-600">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">共创</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 