import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { generatePersonalizedTask, AbilityType } from '@/lib/openai'

// 获取今日任务
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

    // 验证孩子档案归属
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: user.userId,
      },
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 检查今天是否已有任务
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingTask = await prisma.taskRecord.findFirst({
      where: {
        childId,
        createdAt: {
          gte: today,
        },
        task: {
          type: 'MAIN_TASK',
        },
      },
      include: {
        task: true,
      },
    })

    if (existingTask) {
      return NextResponse.json({
        task: existingTask.task,
        taskRecord: existingTask,
      })
    }

    // 生成新的个性化任务
    // 找出最弱的能力维度
    const abilities = [
      { type: 'expression' as AbilityType, score: child.expressionScore },
      { type: 'logic' as AbilityType, score: child.logicScore },
      { type: 'exploration' as AbilityType, score: child.explorationScore },
      { type: 'creativity' as AbilityType, score: child.creativityScore },
      { type: 'habit' as AbilityType, score: child.habitScore },
    ]
    
    const weakestAbility = abilities.reduce((min, current) => 
      current.score < min.score ? current : min
    )

    // 计算难度（基于孩子的平均能力）
    const avgScore = abilities.reduce((sum, a) => sum + a.score, 0) / abilities.length
    const difficulty = Math.min(5, Math.max(1, Math.round(avgScore)))

    // 生成任务内容
    const gradeToAge: Record<string, number> = {
      '幼儿园小班': 3,
      '幼儿园中班': 4,
      '幼儿园大班': 5,
      '一年级': 6,
      '二年级': 7,
      '三年级': 8,
      '四年级': 9,
      '五年级': 10,
      '六年级': 11,
    }
    const childAge = gradeToAge[child.grade] || 7

    const taskContent = await generatePersonalizedTask(
      childAge,
      weakestAbility.type,
      difficulty,
      child.interests
    )

    // 创建任务记录
    let task = await prisma.task.findFirst({
      where: {
        type: 'MAIN_TASK',
        difficulty,
        isActive: true,
      },
    })

    if (!task) {
      // 如果没有找到合适的任务，创建一个新的
      task = await prisma.task.create({
        data: {
          title: taskContent.title,
          type: 'MAIN_TASK',
          difficulty,
          description: taskContent.description,
          prompt: taskContent.prompt,
          constraints: taskContent.constraints,
          expectedMinutes: taskContent.expectedMinutes,
          xpReward: 100,
          expressionWeight: weakestAbility.type === 'expression' ? 0.4 : 0.2,
          logicWeight: weakestAbility.type === 'logic' ? 0.4 : 0.2,
          explorationWeight: weakestAbility.type === 'exploration' ? 0.4 : 0.2,
          creativityWeight: weakestAbility.type === 'creativity' ? 0.4 : 0.2,
          habitWeight: 0.2,
          tags: child.interests,
        },
      })
    }

    // 创建任务记录
    const taskRecord = await prisma.taskRecord.create({
      data: {
        childId,
        taskId: task.id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
      include: {
        task: true,
      },
    })

    return NextResponse.json({
      task: taskRecord.task,
      taskRecord,
    })
  } catch (error) {
    console.error('Get daily task error:', error)
    return NextResponse.json(
      { error: '获取任务失败' },
      { status: 500 }
    )
  }
} 