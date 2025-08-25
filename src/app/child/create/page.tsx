'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  User, 
  GraduationCap, 
  Heart,
  Palette,
  Music,
  Book,
  Gamepad2,
  Microscope,
  Trees,
  Camera,
  Plane,
  ChevronRight
} from 'lucide-react'
import { useStore } from '@/lib/store'

export default function CreateChildPage() {
  const router = useRouter()
  const { token, setCurrentChild } = useStore()
  
  const [nickname, setNickname] = useState('')
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const grades = [
    '幼儿园小班',
    '幼儿园中班',
    '幼儿园大班',
    '一年级',
    '二年级',
    '三年级',
    '四年级',
    '五年级',
    '六年级',
  ]

  const interestOptions = [
    { id: 'art', label: '绘画艺术', icon: <Palette className="w-5 h-5" /> },
    { id: 'music', label: '音乐舞蹈', icon: <Music className="w-5 h-5" /> },
    { id: 'reading', label: '阅读故事', icon: <Book className="w-5 h-5" /> },
    { id: 'games', label: '益智游戏', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'science', label: '科学探索', icon: <Microscope className="w-5 h-5" /> },
    { id: 'nature', label: '自然观察', icon: <Trees className="w-5 h-5" /> },
    { id: 'photo', label: '摄影记录', icon: <Camera className="w-5 h-5" /> },
    { id: 'travel', label: '旅行冒险', icon: <Plane className="w-5 h-5" /> },
  ]

  const toggleInterest = (interestId: string) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter(i => i !== interestId))
    } else {
      if (interests.length < 5) {
        setInterests([...interests, interestId])
      } else {
        setError('最多选择5个兴趣')
        setTimeout(() => setError(''), 3000)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nickname || !grade) {
      setError('请填写完整信息')
      return
    }

    if (nickname.length > 10) {
      setError('昵称不能超过10个字符')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          nickname, 
          grade,
          interests: interests.map(id => 
            interestOptions.find(opt => opt.id === id)?.label || id
          )
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '创建失败')
      }

      // 设置当前孩子
      setCurrentChild(data.child)
      
      // 跳转到AI诊断页面
      router.push('/child/assessment')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* 顶部导航 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Bud AI
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">创建孩子档案</h1>
            <p className="text-gray-600">让我们先了解一下小朋友</p>
          </div>

          {/* 表单 */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 昵称输入 */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <User className="w-5 h-5 text-blue-500" />
                  孩子的昵称
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入昵称（最多10个字）"
                  maxLength={10}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 text-right">{nickname.length}/10</p>
              </div>

              {/* 年级选择 */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <GraduationCap className="w-5 h-5 text-green-500" />
                  所在年级
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {grades.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        grade === g
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 兴趣选择 */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  兴趣爱好
                  <span className="text-sm font-normal text-gray-500">（最多选择5个）</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map(option => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => toggleInterest(option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all ${
                        interests.includes(option.id)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  已选择 {interests.length} 个
                </p>
              </div>

              {/* 错误提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* 提交按钮 */}
              <motion.button
                type="submit"
                disabled={isLoading || !nickname || !grade}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  '创建中...'
                ) : (
                  <>
                    开始AI评估
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">
              💡 完成档案创建后，AI将进行3-5分钟的能力评估，帮助我们更好地了解孩子的成长需求
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 