import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { evaluateTaskSubmission } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { taskRecordId, submission } = await request.json()

    // 验证输入
    if (!taskRecordId || !submission) {
      return NextResponse.json(
        { error: '请提供任务记录ID和提交内容' },
        { status: 400 }
      )
    }

    // 获取任务记录
    const taskRecord = await prisma.taskRecord.findFirst({
      where: { 
        id: taskRecordId,
        child: { userId: user.id }
      },
      include: {
        task: true,
        child: true
      }
    })

    if (!taskRecord) {
      return NextResponse.json(
        { error: '任务记录不存在' },
        { status: 404 }
      )
    }

    // AI评估提交内容
    const evaluation = await evaluateTaskSubmission(
      submission,
      taskRecord.task.prompt,
      taskRecord.task.constraints
    )

    // 更新任务记录
    const updatedTaskRecord = await prisma.taskRecord.update({
      where: { id: taskRecordId },
      data: {
        submission,
        status: 'completed',
        completedAt: new Date(),
        expressionScore: evaluation.scores.expression,
        logicScore: evaluation.scores.logic,
        inquiryScore: evaluation.scores.inquiry,
        creativityScore: evaluation.scores.creativity,
        habitScore: evaluation.scores.habit,
        aiFeedback: evaluation.feedback,
        suggestions: evaluation.suggestions,
        exemplarAnswer: evaluation.exemplarAnswer
      }
    })

    // 更新孩子的5C分数（加权平均）
    const child = taskRecord.child
    const weight = 0.3 // 新任务权重
    const newScores = {
      expressionScore: child.expressionScore * (1 - weight) + evaluation.scores.expression * weight,
      logicScore: child.logicScore * (1 - weight) + evaluation.scores.logic * weight,
      inquiryScore: child.inquiryScore * (1 - weight) + evaluation.scores.inquiry * weight,
      creativityScore: child.creativityScore * (1 - weight) + evaluation.scores.creativity * weight,
      habitScore: child.habitScore * (1 - weight) + evaluation.scores.habit * weight
    }

    await prisma.child.update({
      where: { id: child.id },
      data: newScores
    })

    // 增加XP
    const xpEarned = 100
    await prisma.child.update({
      where: { id: child.id },
      data: { xp: child.xp + xpEarned }
    })

    // 创建成长记录
    await prisma.growthRecord.create({
      data: {
        childId: child.id,
        date: new Date(),
        tasksCompleted: 1,
        xpEarned,
        averageExpressionScore: evaluation.scores.expression,
        averageLogicScore: evaluation.scores.logic,
        averageInquiryScore: evaluation.scores.inquiry,
        averageCreativityScore: evaluation.scores.creativity,
        averageHabitScore: evaluation.scores.habit
      }
    })

    // 存档作品
    await prisma.work.create({
      data: {
        childId: child.id,
        title: `任务完成 - ${taskRecord.task.title}`,
        content: submission,
        type: 'task',
        aiComment: evaluation.feedback,
        createdAt: new Date()
      }
    })

    // 检查并授予徽章
    await checkAndAwardBadges(child.id)

    return NextResponse.json({ 
      taskRecord: updatedTaskRecord,
      evaluation 
    })

  } catch (error) {
    console.error('任务评估错误:', error)
    return NextResponse.json(
      { error: '评估失败，请稍后重试' },
      { status: 500 }
    )
  }
}

async function checkAndAwardBadges(childId: string) {
  try {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        badges: true,
        taskRecords: true
      }
    })

    if (!child) return

    // 检查连续天数徽章
    if (child.streak >= 7 && !child.badges.some(b => b.badge.name === '坚持7天')) {
      await awardBadge(childId, '坚持7天')
    }

    if (child.streak >= 14 && !child.badges.some(b => b.badge.name === '坚持14天')) {
      await awardBadge(childId, '坚持14天')
    }

    // 检查能力徽章
    if (child.expressionScore >= 4 && !child.badges.some(b => b.badge.name === '表达力小达人')) {
      await awardBadge(childId, '表达力小达人')
    }

    if (child.logicScore >= 4 && !child.badges.some(b => b.badge.name === '逻辑力小达人')) {
      await awardBadge(childId, '逻辑力小达人')
    }

  } catch (error) {
    console.error('检查徽章错误:', error)
  }
}

async function awardBadge(childId: string, badgeName: string) {
  try {
    let badge = await prisma.badge.findUnique({
      where: { name: badgeName }
    })

    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeName,
          description: `${badgeName}徽章`,
          icon: '🏆',
          criteria: badgeName
        }
      })
    }

    await prisma.badgeAward.create({
      data: {
        childId,
        badgeId: badge.id,
        awardedAt: new Date()
      }
    })
  } catch (error) {
    console.error('授予徽章错误:', error)
  }
} 