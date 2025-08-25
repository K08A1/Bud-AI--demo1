'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Target, 
  Trophy, 
  Users, 
  Brain,
  ArrowRight,
  Check
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🌱 Bud AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI 驱动儿童素质能力成长系统
          </p>
          <p className="text-lg text-gray-500 mb-12">
            基于5C能力模型，让每个孩子都能看见自己的成长轨迹
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">核心特色</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🤖</span>
                <span>AI个性化陪练</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">📊</span>
                <span>成长可视化</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">👨‍👩‍👧‍👦</span>
                <span>家庭共创空间</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 