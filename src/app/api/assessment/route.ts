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

    const { childId, responses } = await request.json()

    // 验证输入
    if (!childId || !responses) {
      return NextResponse.json(
        { error: '请提供孩子ID和评估回答' },
        { status: 400 }
      )
    }

    // 简化的AI评估（实际应用中会调用OpenAI API）
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

    // 简化的评估记录（实际应用中会保存到数据库）
    const assessment = {
      id: 'temp-assessment-id',
      childId,
      type: 'INITIAL',
      aiAnalysis: assessmentResult.analysis,
      expressionScore: assessmentResult.scores.expression,
      logicScore: assessmentResult.scores.logic,
      explorationScore: assessmentResult.scores.exploration,
      creativityScore: assessmentResult.scores.creativity,
      habitScore: assessmentResult.scores.habit,
      suggestions: assessmentResult.suggestions,
      createdAt: new Date()
    }

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

    // 返回空的评估历史（实际应用中会从数据库查询）
    return NextResponse.json({ assessments: [] })

  } catch (error) {
    console.error('获取评估历史错误:', error)
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
} 