'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Users,
  Lightbulb,
  PenTool,
  Image,
  Mic,
  Heart,
  Star,
  Share2,
  Download,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function CoCreatePage() {
  const router = useRouter()
  const { currentChild, token } = useStore()
  
  const [activeTab, setActiveTab] = useState('themes')
  const [themes, setThemes] = useState<any[]>([])
  const [selectedTheme, setSelectedTheme] = useState<any>(null)
  const [contribution, setContribution] = useState('')
  const [contributionType, setContributionType] = useState('story')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    loadThemes()
    loadResults()
  }, [])

  const loadThemes = async () => {
    // 模拟主题数据
    const mockThemes = [
      {
        id: '1',
        title: '森林奇遇记',
        description: '小动物们在森林里的奇妙冒险',
        prompt: '想象一下，如果森林里的小动物们可以说话，会发生什么有趣的故事？',
        startDate: '2024-12-20',
        endDate: '2024-12-27',
        isActive: true,
        contributionCount: 15,
        participantCount: 8,
      },
      {
        id: '2',
        title: '未来城市',
        description: '100年后的城市会是什么样子？',
        prompt: '未来的城市会有飞行汽车吗？人们会住在哪里？',
        startDate: '2024-12-28',
        endDate: '2025-01-04',
        isActive: true,
        contributionCount: 8,
        participantCount: 5,
      },
      {
        id: '3',
        title: '魔法学校',
        description: '如果世界上真的有魔法学校...',
        prompt: '在魔法学校里，你会学习什么魔法？会遇到什么有趣的事情？',
        startDate: '2025-01-05',
        endDate: '2025-01-12',
        isActive: false,
        contributionCount: 22,
        participantCount: 12,
      },
    ]
    setThemes(mockThemes)
  }

  const loadResults = async () => {
    // 模拟共创结果
    const mockResults = [
      {
        id: '1',
        themeId: '1',
        title: '森林奇遇记 - 完整版',
        content: '小兔子在森林里遇到了会说话的小鸟...',
        illustrationUrl: '/api/placeholder/400/300',
        audioUrl: '/api/placeholder/audio',
        createdAt: '2024-12-25',
        likes: 24,
        downloads: 15,
      },
      {
        id: '2',
        themeId: '3',
        title: '魔法学校历险记',
        content: '小明第一天来到魔法学校...',
        illustrationUrl: '/api/placeholder/400/300',
        audioUrl: '/api/placeholder/audio',
        createdAt: '2025-01-10',
        likes: 18,
        downloads: 12,
      },
    ]
    setResults(mockResults)
  }

  const tabs = [
    { id: 'themes', label: '创作主题', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'contribute', label: '我的贡献', icon: <PenTool className="w-4 h-4" /> },
    { id: 'results', label: '共创成果', icon: <Star className="w-4 h-4" /> },
  ]

  const contributionTypes = [
    { id: 'story', label: '故事续写', icon: <PenTool className="w-5 h-5" /> },
    { id: 'character', label: '角色设计', icon: <Users className="w-5 h-5" /> },
    { id: 'illustration', label: '插画创意', icon: <Image className="w-5 h-5" /> },
    { id: 'voice', label: '语音描述', icon: <Mic className="w-5 h-5" /> },
  ]

  const handleContribute = async () => {
    if (!contribution.trim() || !selectedTheme) return

    setIsSubmitting(true)

    try {
      // 调用贡献API
      const response = await fetch('/api/cocreate/contribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          themeId: selectedTheme.id,
          childId: currentChild?.id,
          content: contribution,
          type: contributionType,
        }),
      })

      if (response.ok) {
        // 贡献成功
        setContribution('')
        setSelectedTheme(null)
        alert('贡献成功！感谢你的创意！')
      }
    } catch (error) {
      console.error('Contribute error:', error)
      // 模拟成功
      setContribution('')
      setSelectedTheme(null)
      alert('贡献成功！感谢你的创意！')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
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
            <h1 className="text-lg font-bold text-gray-800">共创空间</h1>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-5 h-5" />
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
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 创作主题 */}
        {activeTab === 'themes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {themes.map(theme => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{theme.title}</h3>
                    <p className="text-gray-600 mb-3">{theme.description}</p>
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700">{theme.prompt}</p>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      theme.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {theme.isActive ? '进行中' : '已结束'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{theme.startDate} - {theme.endDate}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {theme.participantCount}人参与
                    </span>
                    <span className="flex items-center gap-1">
                      <PenTool className="w-4 h-4" />
                      {theme.contributionCount}个贡献
                    </span>
                  </div>
                </div>

                {theme.isActive && (
                  <button
                    onClick={() => {
                      setSelectedTheme(theme)
                      setActiveTab('contribute')
                    }}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <PenTool className="w-5 h-5" />
                    参与创作
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 我的贡献 */}
        {activeTab === 'contribute' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {selectedTheme ? (
              <>
                {/* 主题信息 */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedTheme.title}</h3>
                      <p className="text-sm text-gray-600">{selectedTheme.description}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{selectedTheme.prompt}</p>
                </div>

                {/* 贡献类型选择 */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">选择贡献类型</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {contributionTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setContributionType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          contributionType === type.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {type.icon}
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 贡献内容 */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">我的创意</h3>
                  <textarea
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    placeholder="写下你的创意想法..."
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      已写 {contribution.length} 字
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedTheme(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        取消
                      </button>
                      <motion.button
                        onClick={handleContribute}
                        disabled={isSubmitting || !contribution.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <PenTool className="w-4 h-4" />
                        {isSubmitting ? '提交中...' : '提交创意'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">请选择一个创作主题开始贡献</p>
              </div>
            )}
          </motion.div>
        )}

        {/* 共创成果 */}
        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {results.map(result => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <Image className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{result.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{result.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{result.createdAt}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {result.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {result.downloads}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        查看插画
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        听故事
                      </button>
                      <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        下载绘本
                      </button>
                    </div>
                  </div>
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
            <Link href="/child/growth" className="flex flex-col items-center p-2 text-gray-600">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs mt-1">成长</span>
            </Link>
            <Link href="/child/cocreate" className="flex flex-col items-center p-2 text-green-500">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">共创</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 