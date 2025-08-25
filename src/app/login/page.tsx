'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff, Phone, Lock } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken, setCurrentChild } = useStore()
  
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 保存用户信息和token
      setUser(data.user)
      setToken(data.token)
      
      // 如果有孩子档案，设置第一个为当前孩子
      if (data.user.children && data.user.children.length > 0) {
        setCurrentChild(data.user.children[0])
        // 跳转到儿童主页
        router.push('/child/home')
      } else {
        // 没有孩子档案，跳转到创建档案页
        router.push('/child/create')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Sparkles className="w-10 h-10 text-green-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Bud AI
            </span>
          </Link>
          <p className="mt-2 text-gray-600">欢迎回来，继续成长之旅</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">登录账号</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 手机号输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号码
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 其他选项 */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-gray-600 hover:text-green-500 transition-colors">
              忘记密码？
            </Link>
            <Link href="/register" className="text-green-500 hover:text-green-600 font-semibold transition-colors">
              注册新账号
            </Link>
          </div>

          {/* 分割线 */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">或</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* 快速登录 */}
          <div className="mt-6">
            <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              验证码快速登录
            </button>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          登录即表示同意
          <Link href="/terms" className="text-green-500 hover:underline mx-1">
            用户协议
          </Link>
          和
          <Link href="/privacy" className="text-green-500 hover:underline mx-1">
            隐私政策
          </Link>
        </div>
      </motion.div>
    </div>
  )
} 