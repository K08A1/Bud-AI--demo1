'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Brain,
  Lightbulb,
  Target,
  CheckCircle2,
  Star,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Trophy,
  Users
} from 'lucide-react'
import { useStore } from '@/lib/store'

export default function AssessmentPage() {
  const router = useRouter()
  const { currentChild, token } = useStore()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)

  // 模拟评估题目
  const questions = [
    {
      id: 1,
      type: 'expression',
      question: '请描述一下你最喜欢的一个玩具，说说它是什么样子的，为什么喜欢它？',
      hint: '可以从颜色、形状、功能等方面来描述',
      category: '表达力',
    },
    {
      id: 2,
      type: 'logic',
      question: '如果今天下雨了，明天会怎么样？请说说你的想法。',
      hint: '想想下雨会对明天产生什么影响',
      category: '逻辑力',
    },
    {
      id: 3,
      type: 'exploration',
      question: '你最近发现了什么有趣的事情？能详细说说吗？',
      hint: '可以是生活中的小发现，或者让你好奇的事情',
      category: '探究力',
    },
    {
      id: 4,
      type: 'creativity',
      question: '如果小动物们可以说话，你觉得它们会说什么？',
      hint: '发挥你的想象力，想想小动物们会聊什么',
      category: '创造力',
    },
    {
      id: 5,
      type: 'habit',
      question: '你每天都会做什么事情？能按顺序说说吗？',
      hint: '从早上起床开始，说说一天的活动安排',
      category: '习惯力',
    },
  ]

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitAssessment = async () => {
    if (answers.filter(a => a && a.trim()).length < questions.length) {
      alert('请完成所有题目')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          childId: currentChild?.id,
          responses: answers,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAssessmentResult(data.assessment)
        setShowResult(true)
      }
    } catch (error) {
      console.error('Assessment error:', error)
      // 模拟评估结果
      setAssessmentResult({
        scores: {
          expression: 4.2,
          logic: 3.8,
          exploration: 4.0,
          creativity: 4.5,
          habit: 4.1,
        },
        analysis: '孩子表现很棒！表达清晰，想象力丰富，逻辑思维正在发展中。建议多进行逻辑训练游戏。',
        suggestions: [
          '继续保持良好的表达习惯',
          '多做逻辑推理游戏',
          '鼓励探索新事物',
          '培养创意表达能力',
        ],
      })
      setShowResult(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult && assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* 顶部导航 */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowResult(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回评估</span>
              </button>
              <h1 className="text-lg font-bold text-gray-800">AI评估结果</h1>
              <div className="w-8"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 评估完成庆祝 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">评估完成！</h2>
            <p className="text-gray-600">AI已经分析了孩子的能力表现</p>
          </motion.div>

          {/* 能力雷达图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">能力雷达图</h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(assessmentResult.scores).map(([ability, score]: [string, any]) => (
                <div key={ability} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-2">
                    {score.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-700">
                    {ability === 'expression' ? '表达力' :
                     ability === 'logic' ? '逻辑力' :
                     ability === 'exploration' ? '探究力' :
                     ability === 'creativity' ? '创造力' :
                     '习惯力'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI分析 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              AI分析
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">{assessmentResult.analysis}</p>
            </div>
          </motion.div>

          {/* 改进建议 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              改进建议
            </h3>
            <div className="space-y-3">
              {assessmentResult.suggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 下一步行动 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl shadow-xl p-6 text-white text-center"
          >
            <h3 className="text-xl font-bold mb-2">准备开始成长之旅！</h3>
            <p className="mb-6 opacity-90">基于评估结果，AI将为孩子定制个性化学习计划</p>
            <button
              onClick={() => router.push('/child/home')}
              className="px-8 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              进入儿童主页
            </button>
          </motion.div>
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
            <h1 className="text-lg font-bold text-gray-800">AI能力评估</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 进度条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">评估进度</h2>
            <span className="text-sm text-gray-600">{currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* 当前题目 */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                第{currentQuestion + 1}题：{questions[currentQuestion].category}
              </h3>
              <p className="text-sm text-gray-600">请认真思考后回答</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              {questions[currentQuestion].question}
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">小提示</span>
            </div>
            <p className="text-sm text-gray-500">{questions[currentQuestion].hint}</p>
          </div>

          <textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="请写下你的答案..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              已写 {answers[currentQuestion]?.length || 0} 字
            </p>
            <div className="flex gap-3">
              {currentQuestion > 0 && (
                <button
                  onClick={prevQuestion}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  上一题
                </button>
              )}
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]?.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  下一题
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submitAssessment}
                  disabled={isSubmitting || answers.filter(a => a && a.trim()).length < questions.length}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      评估中...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      提交评估
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 评估说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            评估说明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 本次评估包含5个能力维度的测试题目</p>
            <p>• 请根据孩子的实际情况认真回答每个问题</p>
            <p>• AI将基于回答内容分析孩子的能力水平</p>
            <p>• 评估结果将用于个性化学习计划制定</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 