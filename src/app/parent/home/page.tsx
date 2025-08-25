'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Users,
  BarChart3,
  Gamepad2,
  BookOpen,
  Calendar,
  TrendingUp,
  Star,
  Target,
  Trophy,
  Flame,
  Gift,
  ChevronRight,
  Settings,
  LogOut,
  Bell,
  Heart,
  Lightbulb
} from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function ParentHomePage() {
  const router = useRouter()
  const { currentChild, user, logout } = useStore()
  
  const [children, setChildren] = useState<any[]>([])
  const [weeklyReport, setWeeklyReport] = useState<any>(null)
  const [familyGames, setFamilyGames] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    loadChildren()
    loadWeeklyReport()
    loadFamilyGames()
    loadNotifications()
  }, [])

  const loadChildren = async () => {
    // 模拟数据
    const mockChildren = [
      {
        id: '1',
        nickname: '小明',
        grade: '三年级',
        level: 3,
        xp: 450,
        streak: 7,
        avatarUrl: null,
        expressionScore: 4.2,
        logicScore: 3.8,
        explorationScore: 4.5,
        creativityScore: 4.0,
        habitScore: 4.3,
        todayProgress: {
          mainTaskCompleted: true,
          microTaskCompleted: false,
          xpEarned: 100,
        },
      },
      {
        id: '2',
        nickname: '小红',
        grade: '一年级',
        level: 2,
        xp: 280,
        streak: 3,
        avatarUrl: null,
        expressionScore: 3.5,
        logicScore: 3.2,
        explorationScore: 4.0,
        creativityScore: 3.8,
        habitScore: 3.5,
        todayProgress: {
          mainTaskCompleted: false,
          microTaskCompleted: false,
          xpEarned: 0,
        },
      },
    ]
    setChildren(mockChildren)
  }

  const loadWeeklyReport = async () => {
    // 模拟周报数据
    setWeeklyReport({
      weekStart: '2024-12-16',
      weekEnd: '2024-12-22',
      summary: '本周孩子表现优秀，表达力和创造力有明显提升！',
      insights: {
        highlights: ['完成7次任务挑战', '表达力提升0.3分', '获得2个新徽章'],
        improvements: ['逻辑力需要加强', '建议多做思维训练'],
      },
      suggestions: ['继续鼓励孩子表达', '增加逻辑游戏', '保持良好习惯'],
      familyGameIds: ['1', '2'],
    })
  }

  const loadFamilyGames = async () => {
    // 模拟家庭游戏数据
    const mockGames = [
      {
        id: '1',
        name: '逻辑接龙',
        description: '一人说因，一人补果，轮流5回合',
        targetSkill: '逻辑力',
        duration: 10,
        materials: ['无'],
        instructions: '从"因为今天下雨了"开始...',
        closure: '复盘"最妙的一句"',
        isRecommended: true,
      },
      {
        id: '2',
        name: '科学厨房',
        description: '水+糖/盐/油，观察差异',
        targetSkill: '探究力',
        duration: 15,
        materials: ['水', '糖', '盐', '油', '透明杯子'],
        instructions: '分别将不同物质加入水中...',
        closure: '用孩子语言描述现象',
        isRecommended: true,
      },
      {
        id: '3',
        name: '家庭故事会',
        description: '每人一句接龙，AI当旁白',
        targetSkill: '表达力',
        duration: 20,
        materials: ['无'],
        instructions: '从"从前有一只小兔子"开始...',
        closure: 'AI生成完整故事音频',
        isRecommended: false,
      },
    ]
    setFamilyGames(mockGames)
  }

  const loadNotifications = async () => {
    // 模拟通知数据
    const mockNotifications = [
      {
        id: '1',
        type: 'ACHIEVEMENT',
        title: '小明获得新徽章！',
        content: '恭喜获得"表达小达人"徽章',
        isRead: false,
        createdAt: '2024-12-23 10:30',
      },
      {
        id: '2',
        type: 'WEEKLY_REPORT',
        title: '本周周报已生成',
        content: '查看小明的本周成长报告',
        isRead: false,
        createdAt: '2024-12-22 20:00',
      },
      {
        id: '3',
        type: 'DAILY_REMINDER',
        title: '今日挑战提醒',
        content: '小明还没有完成今日挑战',
        isRead: true,
        createdAt: '2024-12-23 09:00',
      },
    ]
    setNotifications(mockNotifications)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">家长端</p>
                <p className="text-lg font-bold text-gray-800">{user?.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => router.push('/parent/settings')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 孩子概览卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            我的孩子
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {children.map(child => (
              <div
                key={child.id}
                className="border-2 border-gray-100 rounded-2xl p-4 hover:border-blue-200 transition-colors cursor-pointer"
                onClick={() => router.push(`/parent/child/${child.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {child.nickname[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{child.nickname}</h3>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold">Lv.{child.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-gray-600">{child.streak}天</span>
                    </div>
                  </div>
                </div>

                {/* 今日进度 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">今日挑战</span>
                    <div className="flex items-center gap-2">
                      {child.todayProgress.mainTaskCompleted ? (
                        <span className="text-green-600 text-xs">✓ 已完成</span>
                      ) : (
                        <span className="text-orange-600 text-xs">! 待完成</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">获得XP</span>
                    <span className="text-blue-600 font-medium">+{child.todayProgress.xpEarned}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>点击查看详情</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 本周周报 */}
        {weeklyReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                本周周报
              </h2>
              <Link href="/parent/weekly-report">
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  查看完整版
                </button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 mb-3">{weeklyReport.summary}</p>
              <div className="text-sm text-gray-600">
                <p>{weeklyReport.weekStart} 至 {weeklyReport.weekEnd}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">亮点表现</h4>
                <ul className="space-y-1">
                  {weeklyReport.insights.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">改进建议</h4>
                <ul className="space-y-1">
                  {weeklyReport.insights.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-3 h-3 text-blue-500" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* 家庭游戏推荐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-green-500" />
              家庭游戏推荐
            </h2>
            <Link href="/parent/family-games">
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                更多游戏
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {familyGames.filter(g => g.isRecommended).map(game => (
              <div
                key={game.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors cursor-pointer"
                onClick={() => router.push(`/parent/family-game/${game.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{game.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>目标：{game.targetSkill}</span>
                      <span>时长：{game.duration}分钟</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        推荐
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 快捷功能 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/parent/children">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">孩子管理</h3>
              <p className="text-sm text-gray-600">档案设置、权限管理</p>
            </div>
          </Link>

          <Link href="/parent/insights">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl flex items-center justify-center text-white mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">成长洞察</h3>
              <p className="text-sm text-gray-600">深度分析、趋势预测</p>
            </div>
          </Link>

          <Link href="/parent/reminders">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center text-white mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">提醒设置</h3>
              <p className="text-sm text-gray-600">学习提醒、习惯养成</p>
            </div>
          </Link>

          <Link href="/parent/support">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-xl flex items-center justify-center text-white mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">帮助支持</h3>
              <p className="text-sm text-gray-600">使用指南、客服联系</p>
            </div>
          </Link>
        </motion.div>

        {/* 每日小贴士 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">今日小贴士</p>
              <p className="text-sm text-blue-700">
                和孩子一起完成家庭游戏不仅能提升能力，还能增进亲子感情。建议每天花15-20分钟进行互动游戏！
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 