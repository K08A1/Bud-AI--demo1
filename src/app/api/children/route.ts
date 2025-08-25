import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    // 获取用户的所有孩子
    const children = await prisma.child.findMany({
      where: { userId: user.userId },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        _count: {
          select: {
            taskRecords: true,
            works: true
          }
        }
      }
    })

    return NextResponse.json({ children })

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

    // 创建孩子档案
    const child = await prisma.child.create({
      data: {
        userId: user.userId,
        nickname,
        grade,
        interests: interests || [],
        expressionScore: 3.0,
        logicScore: 3.0,
        explorationScore: 3.0,
        creativityScore: 3.0,
        habitScore: 3.0
      }
    })

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

    // 更新孩子档案
    const child = await prisma.child.update({
      where: { 
        id: childId, 
        userId: user.userId 
      },
      data: {
        nickname,
        grade,
        interests
      }
    })

    return NextResponse.json({ child })

  } catch (error) {
    console.error('更新孩子档案错误:', error)
    return NextResponse.json(
      { error: '更新失败，请稍后重试' },
      { status: 500 }
    )
  }
} 