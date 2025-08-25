import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

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

    // 简化的任务生成（实际应用中会分析孩子能力并生成个性化任务）
    const taskData = {
      title: '今日挑战',
      description: '完成一个有趣的小任务，提升你的能力！',
      prompt: '请描述你今天的想法和感受',
      constraints: ['要有创意', '表达要清晰'],
      expectedMinutes: 10
    }

    // 简化的任务记录（实际应用中会保存到数据库）
    const taskRecord = {
      id: 'temp-task-record-id',
      childId,
      taskId: 'daily-task',
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

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