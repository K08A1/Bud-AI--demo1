'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Download,
  Filter,
  Star,
  Clock,
  ChevronRight,
  Target,
  BarChart3,
  Sparkles,
  Users
} from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function GrowthPage() {
  const router = useRouter()
  const { currentChild } = useStore()
  
  const [activeTab, setActiveTab] = useState('radar')
  const [selectedAbility, setSelectedAbility] = useState('')
  const [timeRange, setTimeRange] = useState('week')

  // 模拟数据
  const radarData = [
    { ability: '表达力', score: 4.2, fullMark: 5 },
    { ability: '逻辑力', score: 3.8, fullMark: 5 },
    { ability: '探究力', score: 4.5, fullMark: 5 },
    { ability: '创造力', score: 4.0, fullMark: 5 },
    { ability: '习惯力', score: 4.3, fullMark: 5 },
  ]

  const trendData = [
    { date: '12/1', expression: 3.5, logic: 3.2, exploration: 3.8, creativity: 3.5, habit: 3.9 },
    { date: '12/8', expression: 3.8, logic: 3.5, exploration: 4.0, creativity: 3.7, habit: 4.0 },
    { date: '12/15', expression: 4.0, logic: 3.6, exploration: 4.2, creativity: 3.9, habit: 4.1 },
    { date: '12/22', expression: 4.2, logic: 3.8, exploration: 4.5, creativity: 4.0, habit: 4.3 },
  ]

  const badges = [
    { id: 1, name: '连续7天', description: '连续完成7天挑战', icon: '🔥', unlocked: true, unlockedAt: '2024-12-15' },
    { id: 2, name: '表达小达人', description: '表达力达到4.0', icon: '💬', unlocked: true, unlockedAt: '2024-12-20' },
    { id: 3, name: '探索精神', description: '探究力达到4.5', icon: '🔍', unlocked: true, unlockedAt: '2024-12-22' },
    { id: 4, name: '创意之星', description: '创造力达到4.0', icon: '⭐', unlocked: true, unlockedAt: '2024-12-23' },
    { id: 5, name: '坚持小达人', description: '连续14天完成任务', icon: '🏆', unlocked: false },
    { id: 6, name: '全能选手', description: '所有能力达到4.0', icon: '🎯', unlocked: false },
    { id: 7, name: '共创贡献者', description: '参与5次共创', icon: '🤝', unlocked: false },
    { id: 8, name: '成长飞轮', description: '连续3天再尝试', icon: '🚀', unlocked: false },
  ]

  const works = [
    {
      id: 1,
      title: '森林探险故事',
      type: '故事创作',
      date: '2024-12-23',
      score: 4.2,
      content: '小兔子在森林里的奇妙冒险...',
      aiComment: '故事情节生动有趣，想象力丰富！',
      parentLike: true
    },
    {
      id: 2,
      title: '为什么天空是蓝色的',
      type: '探究问题',
      date: '2024-12-22',
      score: 4.0,
      content: '天空之所以是蓝色，是因为阳光...',
      aiComment: '解释清晰，探究精神值得表扬！',
      parentLike: false
    },
    {
      id: 3,
      title: '我的周末计划',
      type: '逻辑表达',
      date: '2024-12-21',
      score: 3.8,
      content: '周末我打算先完成作业，然后...',
      aiComment: '计划安排有条理，继续加油！',
      parentLike: true
    },
  ]

  const tabs = [
    { id: 'radar', label: '能力雷达', icon: <Target className="w-4 h-4" /> },
    { id: 'trend', label: '成长趋势', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'badges', label: '我的徽章', icon: <Award className="w-4 h-4" /> },
    { id: 'works', label: '作品存档', icon: <BookOpen className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* 顶部导航 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <h1 className="text-lg font-bold text-gray-800">成长记录</h1>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Tab切换 */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 能力雷达 */}
        {activeTab === 'radar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">当前能力水平</h2>
              <select 
                className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm outline-none"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="all">全部</option>
              </select>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="ability" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="能力值"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 能力详情 */}
            <div className="mt-6 space-y-3">
              {radarData.map((item, index) => (
                <div
                  key={item.ability}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedAbility(item.ability)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                      ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500'][index]
                    }`}>
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.ability}</p>
                      <p className="text-xs text-gray-500">最近5次任务平均分</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{item.score}</p>
                    <p className="text-xs text-green-600">+0.3 ↑</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 成长趋势 */}
        {activeTab === 'trend' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">成长趋势</h2>
              <div className="flex gap-2">
                {['week', 'month', 'year'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range === 'week' ? '周' : range === 'month' ? '月' : '年'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[3, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="expression" stroke="#3b82f6" name="表达力" strokeWidth={2} />
                  <Line type="monotone" dataKey="logic" stroke="#8b5cf6" name="逻辑力" strokeWidth={2} />
                  <Line type="monotone" dataKey="exploration" stroke="#10b981" name="探究力" strokeWidth={2} />
                  <Line type="monotone" dataKey="creativity" stroke="#f59e0b" name="创造力" strokeWidth={2} />
                  <Line type="monotone" dataKey="habit" stroke="#ec4899" name="习惯力" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 成长统计 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">28</p>
                <p className="text-sm text-gray-600 mt-1">累计任务</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">7</p>
                <p className="text-sm text-gray-600 mt-1">连续天数</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600">85%</p>
                <p className="text-sm text-gray-600 mt-1">完成率</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 徽章展示 */}
        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">我的徽章</h2>
              <p className="text-sm text-gray-500">已获得 {badges.filter(b => b.unlocked).length}/{badges.length}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {badges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={badge.unlocked ? { scale: 1.05 } : {}}
                  className={`relative p-4 rounded-2xl text-center transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg'
                      : 'bg-gray-100 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-medium text-sm text-gray-800">{badge.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  {badge.unlocked && (
                    <p className="text-xs text-gray-500 mt-2">{badge.unlockedAt}</p>
                  )}
                  {!badge.unlocked && (
                    <div className="absolute inset-0 bg-gray-200/50 rounded-2xl flex items-center justify-center">
                      <p className="text-xs text-gray-600">未解锁</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 作品存档 */}
        {activeTab === 'works' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 筛选栏 */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm">
                    全部
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                    故事创作
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                    探究问题
                  </button>
                </div>
                <button className="flex items-center gap-2 text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">筛选</span>
                </button>
              </div>
            </div>

            {/* 作品列表 */}
            {works.map(work => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{work.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{work.type}</span>
                      <span>•</span>
                      <span>{work.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg font-bold text-gray-800">{work.score}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{work.content}</p>

                <div className="bg-blue-50 rounded-xl p-3 mb-4">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">AI点评：</span>
                    {work.aiComment}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {work.parentLike && (
                      <div className="flex items-center gap-1 text-red-500">
                        <span className="text-xl">❤️</span>
                        <span className="text-sm">妈妈点赞了</span>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700">
                    <span className="text-sm font-medium">查看详情</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 底部标签栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link href="/child/home" className="flex flex-col items-center p-2 text-gray-600">
              <Sparkles className="w-6 h-6" />
              <span className="text-xs mt-1">首页</span>
            </Link>
            <Link href="/child/task/daily" className="flex flex-col items-center p-2 text-gray-600">
              <Target className="w-6 h-6" />
              <span className="text-xs mt-1">挑战</span>
            </Link>
            <Link href="/child/growth" className="flex flex-col items-center p-2 text-purple-500">
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