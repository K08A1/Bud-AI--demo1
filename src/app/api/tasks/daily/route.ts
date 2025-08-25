import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePersonalizedTask } from '@/lib/openai'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')

    if (!childId) {
      return NextResponse.json(
        { error: '请提供孩子ID' },
        { status: 400 }
      )
    }

    // 检查今天是否已有任务
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingTask = await prisma.taskRecord.findFirst({
      where: {
        childId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        task: true
      }
    })

    if (existingTask) {
      return NextResponse.json({ task: existingTask })
    }

    // 获取孩子信息
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.id }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 找出最弱的能力
    const scores = [
      { ability: 'expression', score: child.expressionScore },
      { ability: 'logic', score: child.logicScore },
      { ability: 'inquiry', score: child.inquiryScore },
      { ability: 'creativity', score: child.creativityScore },
      { ability: 'habit', score: child.habitScore }
    ]
    
    const weakestAbility = scores.reduce((min, current) => 
      current.score < min.score ? current : min
    )

    // 计算难度等级
    const difficulty = Math.max(1, Math.min(5, Math.ceil(weakestAbility.score)))

    // 生成个性化任务
    const taskData = await generatePersonalizedTask(weakestAbility.ability, difficulty)

    // 创建任务记录
    const taskRecord = await prisma.taskRecord.create({
      data: {
        childId,
        taskId: 'daily-task', // 使用固定ID
        status: 'assigned',
        assignedAt: new Date()
      }
    })

    // 创建任务（如果不存在）
    let task = await prisma.task.findUnique({
      where: { id: 'daily-task' }
    })

    if (!task) {
      task = await prisma.task.create({
        data: {
          id: 'daily-task',
          title: taskData.title,
          description: taskData.description,
          prompt: taskData.prompt,
          constraints: taskData.constraints,
          difficulty,
          targetAbility: weakestAbility.ability,
          estimatedTime: 10
        }
      })
    }

    return NextResponse.json({ 
      task: { ...taskRecord, task } 
    })

  } catch (error) {
    console.error('获取每日任务错误:', error)
    return NextResponse.json(
      { error: '获取任务失败，请稍后重试' },
      { status: 500 }
    )
  }
} 