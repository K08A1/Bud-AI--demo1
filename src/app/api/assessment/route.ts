import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// import { performInitialAssessment } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { childId, responses } = await request.json()

    // 验证输入
    if (!childId || !responses) {
      return NextResponse.json(
        { error: '请提供孩子ID和评估回答' },
        { status: 400 }
      )
    }

    // 获取孩子信息
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.userId }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 计算孩子年龄（基于年级）
    const gradeToAge: { [key: string]: number } = {
      '小班': 3, '中班': 4, '大班': 5,
      '一年级': 6, '二年级': 7, '三年级': 8,
      '四年级': 9, '五年级': 10, '六年级': 11
    }
    const age = gradeToAge[child.grade] || 6

    // 执行AI评估（简化版本）
    const assessmentResult = {
      scores: {
        expression: 3.5,
        logic: 3.2,
        exploration: 3.8,
        creativity: 3.6,
        habit: 3.4
      },
      analysis: '孩子表现很棒，在各项能力上都有不错的基础！',
      suggestions: ['多练习表达', '培养好奇心', '坚持每日挑战']
    }

    // 保存评估记录
    const assessment = await prisma.assessment.create({
      data: {
        childId,
        type: 'INITIAL',
        aiAnalysis: assessmentResult.analysis,
        expressionScore: assessmentResult.scores.expression,
        logicScore: assessmentResult.scores.logic,
        explorationScore: assessmentResult.scores.exploration,
        creativityScore: assessmentResult.scores.creativity,
        habitScore: assessmentResult.scores.habit,
        suggestions: assessmentResult.suggestions
      }
    })

    // 更新孩子的5C分数
    await prisma.child.update({
      where: { id: childId },
      data: {
        expressionScore: assessmentResult.scores.expression,
        logicScore: assessmentResult.scores.logic,
        explorationScore: assessmentResult.scores.exploration,
        creativityScore: assessmentResult.scores.creativity,
        habitScore: assessmentResult.scores.habit
      }
    })

    return NextResponse.json({ assessment, assessmentResult })

  } catch (error) {
    console.error('AI评估错误:', error)
    return NextResponse.json(
      { error: '评估失败，请稍后重试' },
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

    // 获取孩子的评估历史
    const assessments = await prisma.assessment.findMany({
      where: { 
        child: { userId: user.userId }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ assessments })

  } catch (error) {
    console.error('获取评估历史错误:', error)
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
} 