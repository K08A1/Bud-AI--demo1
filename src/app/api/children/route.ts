import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    // 返回空的孩子列表（实际应用中会从数据库查询）
    return NextResponse.json({ children: [] })

  } catch (error) {
    console.error('获取孩子列表错误:', error)
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { nickname, grade, interests } = await request.json()

    // 验证输入
    if (!nickname || !grade) {
      return NextResponse.json(
        { error: '请填写孩子昵称和年级' },
        { status: 400 }
      )
    }

    // 简化的孩子档案（实际应用中会保存到数据库）
    const child = {
      id: 'temp-child-id',
      userId: user.userId,
      nickname,
      grade,
      interests: interests || [],
      expressionScore: 3.0,
      logicScore: 3.0,
      explorationScore: 3.0,
      creativityScore: 3.0,
      habitScore: 3.0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({ child })

  } catch (error) {
    console.error('创建孩子档案错误:', error)
    return NextResponse.json(
      { error: '创建失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { childId, nickname, grade, interests } = await request.json()

    if (!childId) {
      return NextResponse.json(
        { error: '请提供孩子ID' },
        { status: 400 }
      )
    }

    // 简化的更新（实际应用中会更新数据库）
    const child = {
      id: childId,
      userId: user.userId,
      nickname,
      grade,
      interests,
      updatedAt: new Date()
    }

    return NextResponse.json({ child })

  } catch (error) {
    console.error('更新孩子档案错误:', error)
    return NextResponse.json(
      { error: '更新失败，请稍后重试' },
      { status: 500 }
    )
  }
} 