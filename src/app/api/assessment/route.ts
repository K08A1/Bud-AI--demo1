import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { performInitialAssessment } from '@/lib/openai'

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
    const { childId, responses } = body

    // 验证输入
    if (!childId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: '请提供完整的评估信息' },
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

    // 计算孩子年龄（根据年级估算）
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

    // 执行AI评估
    const assessmentResult = await performInitialAssessment(childAge, responses)

    // 保存评估记录
    const assessment = await prisma.assessment.create({
      data: {
        childId,
        type: 'INITIAL',
        expressionScore: assessmentResult.scores.expression,
        logicScore: assessmentResult.scores.logic,
        explorationScore: assessmentResult.scores.exploration,
        creativityScore: assessmentResult.scores.creativity,
        habitScore: assessmentResult.scores.habit,
        aiAnalysis: assessmentResult.analysis,
        suggestions: assessmentResult.suggestions,
      },
    })

    // 更新孩子的能力分数
    await prisma.child.update({
      where: { id: childId },
      data: {
        expressionScore: assessmentResult.scores.expression,
        logicScore: assessmentResult.scores.logic,
        explorationScore: assessmentResult.scores.exploration,
        creativityScore: assessmentResult.scores.creativity,
        habitScore: assessmentResult.scores.habit,
      },
    })

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        scores: assessmentResult.scores,
        analysis: assessmentResult.analysis,
        suggestions: assessmentResult.suggestions,
      },
    })
  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json(
      { error: '评估失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 获取历史评估记录
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

    // 获取评估记录
    const assessments = await prisma.assessment.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
      take: 10, // 最近10条
    })

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error('Get assessments error:', error)
    return NextResponse.json(
      { error: '获取评估记录失败' },
      { status: 500 }
    )
  }
} 