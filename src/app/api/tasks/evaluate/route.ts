import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
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

    const body = await request.json()
    const { taskId, submission, timeSpent, childId } = body

    // 验证输入
    if (!taskId || !submission || !childId) {
      return NextResponse.json(
        { error: '请提供完整信息' },
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

    // 获取任务信息
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    // 查找任务记录
    let taskRecord = await prisma.taskRecord.findFirst({
      where: {
        childId,
        taskId,
        status: 'IN_PROGRESS',
      },
    })

    if (!taskRecord) {
      // 如果没有进行中的记录，创建一个新的
      taskRecord = await prisma.taskRecord.create({
        data: {
          childId,
          taskId,
          status: 'IN_PROGRESS',
          startedAt: new Date(Date.now() - timeSpent * 1000),
        },
      })
    }

    // AI评估
    const evaluation = await evaluateTaskSubmission(task, submission, timeSpent)

    // 更新任务记录
    const updatedTaskRecord = await prisma.taskRecord.update({
      where: { id: taskRecord.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent,
        submission,
        expressionScore: evaluation.scores.expression,
        logicScore: evaluation.scores.logic,
        explorationScore: evaluation.scores.exploration,
        creativityScore: evaluation.scores.creativity,
        habitScore: evaluation.scores.habit,
        feedback: evaluation.feedback,
        suggestions: evaluation.suggestions,
        exemplarAnswer: evaluation.exemplarAnswer,
        xpEarned: task.xpReward,
        aiEvaluation: evaluation,
      },
    })

    // 更新孩子的能力分数（加权平均）
    const updateWeight = 0.1 // 新分数的权重
    await prisma.child.update({
      where: { id: childId },
      data: {
        expressionScore: child.expressionScore * (1 - updateWeight) + evaluation.scores.expression * updateWeight,
        logicScore: child.logicScore * (1 - updateWeight) + evaluation.scores.logic * updateWeight,
        explorationScore: child.explorationScore * (1 - updateWeight) + evaluation.scores.exploration * updateWeight,
        creativityScore: child.creativityScore * (1 - updateWeight) + evaluation.scores.creativity * updateWeight,
        habitScore: child.habitScore * (1 - updateWeight) + evaluation.scores.habit * updateWeight,
        xp: {
          increment: task.xpReward,
        },
      },
    })

    // 创建成长记录
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    await prisma.growthRecord.upsert({
      where: {
        childId_date: {
          childId,
          date: today,
        },
      },
      update: {
        tasksCompleted: {
          increment: 1,
        },
        xpEarned: {
          increment: task.xpReward,
        },
      },
      create: {
        childId,
        date: today,
        expressionScore: evaluation.scores.expression,
        logicScore: evaluation.scores.logic,
        explorationScore: evaluation.scores.exploration,
        creativityScore: evaluation.scores.creativity,
        habitScore: evaluation.scores.habit,
        tasksCompleted: 1,
        xpEarned: task.xpReward,
        retryCount: 0,
      },
    })

    // 创建作品存档
    await prisma.work.create({
      data: {
        childId,
        title: task.title,
        content: submission,
        type: task.type,
        aiScore: (evaluation.scores.expression + evaluation.scores.logic + evaluation.scores.exploration + evaluation.scores.creativity + evaluation.scores.habit) / 5,
        aiComment: evaluation.feedback,
      },
    })

    // 检查并颁发徽章
    await checkAndAwardBadges(childId)

    return NextResponse.json({
      scores: evaluation.scores,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions,
      exemplarAnswer: evaluation.exemplarAnswer,
      xpEarned: task.xpReward,
    })
  } catch (error) {
    console.error('Evaluate task error:', error)
    return NextResponse.json(
      { error: '评估失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 检查并颁发徽章
async function checkAndAwardBadges(childId: string) {
  try {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        taskRecords: {
          where: {
            status: 'COMPLETED',
          },
        },
        badges: true,
      },
    })

    if (!child) return

    // 检查连续天数徽章
    if (child.streak >= 7) {
      await awardBadgeIfNotExists(childId, 'streak_7')
    }
    if (child.streak >= 14) {
      await awardBadgeIfNotExists(childId, 'streak_14')
    }

    // 检查能力徽章
    if (child.expressionScore >= 4.0) {
      await awardBadgeIfNotExists(childId, 'expression_master')
    }
    if (child.logicScore >= 4.0) {
      await awardBadgeIfNotExists(childId, 'logic_master')
    }
    if (child.explorationScore >= 4.0) {
      await awardBadgeIfNotExists(childId, 'exploration_master')
    }
    if (child.creativityScore >= 4.0) {
      await awardBadgeIfNotExists(childId, 'creativity_master')
    }
    if (child.habitScore >= 4.0) {
      await awardBadgeIfNotExists(childId, 'habit_master')
    }

    // 检查全能徽章
    if (
      child.expressionScore >= 4.0 &&
      child.logicScore >= 4.0 &&
      child.explorationScore >= 4.0 &&
      child.creativityScore >= 4.0 &&
      child.habitScore >= 4.0
    ) {
      await awardBadgeIfNotExists(childId, 'all_rounder')
    }
  } catch (error) {
    console.error('Check badges error:', error)
  }
}

async function awardBadgeIfNotExists(childId: string, badgeCode: string) {
  try {
    // 查找或创建徽章定义
    let badge = await prisma.badge.findFirst({
      where: { 
        name: badgeCode,
      },
    })

    if (!badge) {
      // 创建徽章定义
      const badgeInfo = getBadgeInfo(badgeCode)
      badge = await prisma.badge.create({
        data: badgeInfo,
      })
    }

    // 检查是否已经拥有
    const existing = await prisma.badgeAward.findUnique({
      where: {
        childId_badgeId: {
          childId,
          badgeId: badge.id,
        },
      },
    })

    if (!existing) {
      // 颁发徽章
      await prisma.badgeAward.create({
        data: {
          childId,
          badgeId: badge.id,
        },
      })
    }
  } catch (error) {
    console.error('Award badge error:', error)
  }
}

function getBadgeInfo(badgeCode: string) {
  const badges: Record<string, any> = {
    streak_7: {
      name: 'streak_7',
      description: '连续7天完成挑战',
      iconUrl: '🔥',
      category: 'PERSISTENCE',
      criteria: { type: 'streak', value: 7 },
    },
    streak_14: {
      name: 'streak_14',
      description: '连续14天完成挑战',
      iconUrl: '🏆',
      category: 'PERSISTENCE',
      criteria: { type: 'streak', value: 14 },
    },
    expression_master: {
      name: 'expression_master',
      description: '表达力达到4.0',
      iconUrl: '💬',
      category: 'SKILL',
      criteria: { type: 'ability', ability: 'expression', value: 4.0 },
    },
    logic_master: {
      name: 'logic_master',
      description: '逻辑力达到4.0',
      iconUrl: '🧩',
      category: 'SKILL',
      criteria: { type: 'ability', ability: 'logic', value: 4.0 },
    },
    exploration_master: {
      name: 'exploration_master',
      description: '探究力达到4.0',
      iconUrl: '🔍',
      category: 'SKILL',
      criteria: { type: 'ability', ability: 'exploration', value: 4.0 },
    },
    creativity_master: {
      name: 'creativity_master',
      description: '创造力达到4.0',
      iconUrl: '⭐',
      category: 'SKILL',
      criteria: { type: 'ability', ability: 'creativity', value: 4.0 },
    },
    habit_master: {
      name: 'habit_master',
      description: '习惯力达到4.0',
      iconUrl: '🎯',
      category: 'SKILL',
      criteria: { type: 'ability', ability: 'habit', value: 4.0 },
    },
    all_rounder: {
      name: 'all_rounder',
      description: '所有能力达到4.0',
      iconUrl: '👑',
      category: 'ACHIEVEMENT',
      criteria: { type: 'all_abilities', value: 4.0 },
    },
  }

  return badges[badgeCode] || badges.streak_7
} 