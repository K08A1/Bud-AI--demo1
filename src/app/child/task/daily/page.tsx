'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Send,
  MessageCircle,
  Lightbulb,
  RefreshCw,
  Star,
  Trophy,
  Sparkles,
  Brain,
  Clock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'
import { useStore } from '@/lib/store'

export default function DailyTaskPage() {
  const router = useRouter()
  const { currentChild, token, updateTodayProgress, setCurrentTask } = useStore()
  
  const [task, setTask] = useState<any>(null)
  const [submission, setSubmission] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCoach, setShowCoach] = useState(false)
  const [coachMessages, setCoachMessages] = useState<any[]>([])
  const [coachInput, setCoachInput] = useState('')
  const [isCoaching, setIsCoaching] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    // 加载今日任务
    loadTodayTask()
    
    // 计时器
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const loadTodayTask = async () => {
    // 模拟任务数据（实际应从API获取）
    const mockTask = {
      id: '1',
      title: '森林探险故事',
      type: 'MAIN_TASK',
      description: '续写一个关于森林探险的故事',
      prompt: '小兔子在森林里发现了一条从未见过的小路，路边开满了发光的蘑菇。它好奇地沿着小路走去...\n\n请续写这个故事，想象小兔子会遇到什么？',
      constraints: [
        '包含至少一个转折',
        '描述小兔子的心情变化',
        '故事要有趣味性'
      ],
      expectedMinutes: 10,
      xpReward: 100,
      difficulty: 3,
    }
    
    setTask(mockTask)
    setCurrentTask(mockTask)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 提交任务
  const handleSubmit = async () => {
    if (!submission.trim()) {
      return
    }

    if (submission.length < 20) {
      alert('回答太短了，再多写一些吧！')
      return
    }

    setIsSubmitting(true)

    try {
      // 调用评估API
      const response = await fetch('/api/tasks/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: task.id,
          submission,
          timeSpent,
          childId: currentChild?.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setEvaluation(data)
        
        // 更新今日进度
        updateTodayProgress({
          mainTaskCompleted: true,
          xpEarned: task.xpReward,
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      // 模拟评估结果
      setEvaluation({
        scores: {
          expression: 4.2,
          logic: 3.8,
          exploration: 4.0,
          creativity: 4.5,
          habit: 4.0,
        },
        feedback: '你的故事很有创意！小兔子的冒险很精彩，情节转折设计得不错。',
        suggestions: [
          '可以再详细描述一下森林的环境',
          '加入更多小兔子的内心想法',
          '故事结尾可以更有意义'
        ],
        exemplarAnswer: '小兔子沿着发光的小路前进，心里既兴奋又有些害怕。突然，它听到了美妙的歌声...',
        xpEarned: task.xpReward,
      })
      
      updateTodayProgress({
        mainTaskCompleted: true,
        xpEarned: task.xpReward,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // AI陪练对话
  const handleCoachChat = async () => {
    if (!coachInput.trim()) return

    const userMessage = { role: 'user', content: coachInput }
    setCoachMessages([...coachMessages, userMessage])
    setCoachInput('')
    setIsCoaching(true)

    try {
      // 调用AI陪练API
      const response = await fetch('/api/tasks/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: task.id,
          submission,
          message: coachInput,
          previousMessages: coachMessages,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCoachMessages([
          ...coachMessages,
          userMessage,
          { role: 'assistant', content: data.response }
        ])
      }
    } catch (error) {
      console.error('Coach error:', error)
      // 模拟AI回复
      setCoachMessages([
        ...coachMessages,
        userMessage,
        { 
          role: 'assistant', 
          content: '很好的想法！你可以想想小兔子看到发光蘑菇时会有什么感受？它可能会遇到谁呢？' 
        }
      ])
    } finally {
      setIsCoaching(false)
    }
  }

  // 再次尝试
  const handleRetry = () => {
    setEvaluation(null)
    setSubmission('')
    setCoachMessages([])
    setStartTime(Date.now())
    setTimeSpent(0)
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">加载任务中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="w-4 h-4" />
                <span>+{task.xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!evaluation ? (
          <>
            {/* 任务内容 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6 mb-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">{task.title}</h1>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{task.prompt}</p>
              </div>

              {/* 任务要求 */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">任务要求：</p>
                {task.constraints.map((constraint: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-600">{constraint}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 答题区域 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">我的回答</h2>
                <button
                  onClick={() => setShowCoach(!showCoach)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">AI陪练</span>
                </button>
              </div>

              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="开始写下你的答案..."
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  已写 {submission.length} 字
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSubmission('')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    清空
                  </button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !submission.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        提交答案
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* AI陪练对话框 */}
            <AnimatePresence>
              {showCoach && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-3xl shadow-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-bold text-gray-800">AI陪练助手</h3>
                  </div>

                  <div className="h-64 overflow-y-auto mb-4 space-y-3">
                    {coachMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>有什么不明白的地方吗？</p>
                        <p className="text-sm mt-1">我可以帮你理解题目，给你一些提示哦！</p>
                      </div>
                    ) : (
                      coachMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-xl ${
                            msg.role === 'user'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coachInput}
                      onChange={(e) => setCoachInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCoachChat()}
                      placeholder="问问AI老师..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      disabled={isCoaching}
                    />
                    <button
                      onClick={handleCoachChat}
                      disabled={isCoaching || !coachInput.trim()}
                      className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCoaching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* 评估结果 */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="text-center mb-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">任务完成！</h2>
              <p className="text-lg text-gray-600">获得 {evaluation.xpEarned} XP</p>
            </div>

            {/* 能力评分 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">能力评分</p>
              <div className="grid grid-cols-5 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {evaluation.scores.expression.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">表达力</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {evaluation.scores.logic.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">逻辑力</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {evaluation.scores.exploration.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">探究力</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {evaluation.scores.creativity.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">创造力</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {evaluation.scores.habit.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">习惯力</p>
                </div>
              </div>
            </div>

            {/* AI反馈 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">AI老师点评</p>
              <p className="text-gray-600">{evaluation.feedback}</p>
            </div>

            {/* 改进建议 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">改进建议</p>
              <ul className="space-y-1">
                {evaluation.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm text-gray-600">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 示例答案 */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">参考答案</p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{evaluation.exemplarAnswer}</p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                再试一次
              </button>
              <button
                onClick={() => router.push('/child/home')}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                返回首页
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 