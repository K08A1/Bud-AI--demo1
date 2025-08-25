import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { generateWeeklyReport } from '@/lib/openai'

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
    const { childId, weekStart, weekEnd } = body

    // 验证输入
    if (!childId || !weekStart || !weekEnd) {
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

    // 获取本周的成长记录
    const startDate = new Date(weekStart)
    const endDate = new Date(weekEnd)
    
    const growthRecords = await prisma.growthRecord.findMany({
      where: {
        childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // 获取本周的任务记录
    const taskRecords = await prisma.taskRecord.findMany({
      where: {
        childId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      include: {
        task: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // 获取本周的徽章
    const badgeAwards = await prisma.badgeAward.findMany({
      where: {
        childId,
        awardedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        badge: true,
      },
    })

    // 获取本周的共创贡献
    const contributions = await prisma.coCreationContribution.findMany({
      where: {
        childId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // 计算本周统计数据
    const weeklyStats = {
      tasksCompleted: growthRecords.reduce((sum: number, record: any) => sum + record.tasksCompleted, 0),
      xpEarned: growthRecords.reduce((sum: number, record: any) => sum + record.xpEarned, 0),
      badgesEarned: badgeAwards.length,
      contributions: contributions.length,
      averageExpression: growthRecords.reduce((sum: number, record: any) => sum + record.expressionScore, 0) / Math.max(growthRecords.length, 1),
      averageLogic: growthRecords.reduce((sum: number, record: any) => sum + record.logicScore, 0) / Math.max(growthRecords.length, 1),
      averageExploration: growthRecords.reduce((sum: number, record: any) => sum + record.explorationScore, 0) / Math.max(growthRecords.length, 1),
      averageCreativity: growthRecords.reduce((sum: number, record: any) => sum + record.creativityScore, 0) / Math.max(growthRecords.length, 1),
      averageHabit: growthRecords.reduce((sum: number, record: any) => sum + record.habitScore, 0) / Math.max(growthRecords.length, 1),
    }

    // 生成AI周报
    const aiReport = await generateWeeklyReport(
      { nickname: child.nickname, grade: child.grade },
      weeklyStats
    )

    // 保存周报到数据库
    const weeklyReport = await prisma.weeklyReport.create({
      data: {
        childId,
        weekStart: startDate,
        weekEnd: endDate,
        summary: aiReport.summary,
        insights: aiReport.insights,
        suggestions: aiReport.suggestions,
        familyGameIds: aiReport.recommendedGames || [],
        aiGenerated: true,
        stats: weeklyStats,
      },
    })

    return NextResponse.json({
      weeklyReport,
      aiReport,
      weeklyStats,
    })
  } catch (error) {
    console.error('Generate weekly report error:', error)
    return NextResponse.json(
      { error: '生成周报失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 获取周报列表
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
    const limit = parseInt(searchParams.get('limit') || '10')

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

    // 获取周报列表
    const weeklyReports = await prisma.weeklyReport.findMany({
      where: {
        childId,
      },
      orderBy: {
        weekStart: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({
      weeklyReports,
    })
  } catch (error) {
    console.error('Get weekly reports error:', error)
    return NextResponse.json(
      { error: '获取周报失败' },
      { status: 500 }
    )
  }
} 