import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

    const { childId, weekStart } = await request.json()

    // 验证输入
    if (!childId || !weekStart) {
      return NextResponse.json(
        { error: '请提供孩子ID和周开始日期' },
        { status: 400 }
      )
    }

    // 验证孩子所有权
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.id }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 计算周结束日期
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // 获取本周数据
    const growthRecords = await prisma.growthRecord.findMany({
      where: {
        childId,
        date: {
          gte: new Date(weekStart),
          lt: weekEnd
        }
      }
    })

    const taskRecords = await prisma.taskRecord.findMany({
      where: {
        childId,
        completedAt: {
          gte: new Date(weekStart),
          lt: weekEnd
        }
      }
    })

    const badgeAwards = await prisma.badgeAward.findMany({
      where: {
        childId,
        awardedAt: {
          gte: new Date(weekStart),
          lt: weekEnd
        }
      },
      include: { badge: true }
    })

    const coCreationContributions = await prisma.coCreationContribution.findMany({
      where: {
        childId,
        submittedAt: {
          gte: new Date(weekStart),
          lt: weekEnd
        }
      }
    })

    // 计算周统计
    const weeklyStats = {
      tasksCompleted: growthRecords.reduce((sum: number, record: any) => sum + record.tasksCompleted, 0),
      xpEarned: growthRecords.reduce((sum: number, record: any) => sum + record.xpEarned, 0),
      averageExpressionScore: growthRecords.length > 0 ? 
        growthRecords.reduce((sum: number, record: any) => sum + record.averageExpressionScore, 0) / growthRecords.length : 0,
      averageLogicScore: growthRecords.length > 0 ? 
        growthRecords.reduce((sum: number, record: any) => sum + record.averageLogicScore, 0) / growthRecords.length : 0,
      averageInquiryScore: growthRecords.length > 0 ? 
        growthRecords.reduce((sum: number, record: any) => sum + record.averageInquiryScore, 0) / growthRecords.length : 0,
      averageCreativityScore: growthRecords.length > 0 ? 
        growthRecords.reduce((sum: number, record: any) => sum + record.averageCreativityScore, 0) / growthRecords.length : 0,
      averageHabitScore: growthRecords.length > 0 ? 
        growthRecords.reduce((sum: number, record: any) => sum + record.averageHabitScore, 0) / growthRecords.length : 0
    }

    // 生成AI周报
    const aiReport = await generateWeeklyReport({
      childData: { nickname: child.nickname, grade: child.grade },
      weeklyStats,
      taskRecords,
      badgeAwards,
      coCreationContributions
    })

    // 保存周报
    const weeklyReport = await prisma.weeklyReport.create({
      data: {
        childId,
        weekStart: new Date(weekStart),
        weekEnd: weekEnd,
        tasksCompleted: weeklyStats.tasksCompleted,
        xpEarned: weeklyStats.xpEarned,
        averageExpressionScore: weeklyStats.averageExpressionScore,
        averageLogicScore: weeklyStats.averageLogicScore,
        averageInquiryScore: weeklyStats.averageInquiryScore,
        averageCreativityScore: weeklyStats.averageCreativityScore,
        averageHabitScore: weeklyStats.averageHabitScore,
        aiAnalysis: aiReport.analysis,
        improvementSuggestions: aiReport.suggestions,
        recommendedGames: aiReport.recommendedGames,
        nextWeekGoals: aiReport.nextWeekGoals
      }
    })

    return NextResponse.json({ weeklyReport, aiReport })

  } catch (error) {
    console.error('生成周报错误:', error)
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}

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

    // 验证孩子所有权
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.id }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 获取历史周报
    const weeklyReports = await prisma.weeklyReport.findMany({
      where: { childId },
      orderBy: { weekStart: 'desc' }
    })

    return NextResponse.json({ weeklyReports })

  } catch (error) {
    console.error('获取周报错误:', error)
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
} 