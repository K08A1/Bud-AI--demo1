import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// import { generatePersonalizedTask } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { childId } = await request.json()

    if (!childId) {
      return NextResponse.json(
        { error: '请提供孩子ID' },
        { status: 400 }
      )
    }

    // 验证孩子所有权
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.userId }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 分析孩子能力，找出最弱项
    const scores = [
      { ability: 'expression' as const, score: child.expressionScore },
      { ability: 'logic' as const, score: child.logicScore },
      { ability: 'exploration' as const, score: child.explorationScore },
      { ability: 'creativity' as const, score: child.creativityScore },
      { ability: 'habit' as const, score: child.habitScore }
    ]

    const weakestAbility = scores.reduce((min, current) => 
      current.score < min.score ? current : min
    )

    // 根据能力值确定难度
    const difficulty = Math.max(1, Math.min(5, Math.ceil(weakestAbility.score)))

    // 生成个性化任务（简化版本）
    const taskData = {
      title: '今日挑战',
      description: '完成一个有趣的小任务，提升你的能力！',
      prompt: '请描述你今天的想法和感受',
      constraints: ['要有创意', '表达要清晰'],
      expectedMinutes: 10
    }

    // 创建任务记录
    const taskRecord = await prisma.taskRecord.create({
      data: {
        childId,
        taskId: 'daily-task', // 简化处理
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    })

    return NextResponse.json({ 
      task: taskData,
      taskRecord 
    })

  } catch (error) {
    console.error('生成每日任务错误:', error)
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
} 