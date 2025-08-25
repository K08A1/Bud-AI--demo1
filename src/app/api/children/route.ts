import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    if (!nickname || !grade || !interests) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    if (nickname.length > 10) {
      return NextResponse.json(
        { error: '昵称不能超过10个字符' },
        { status: 400 }
      )
    }

    if (interests.length > 5) {
      return NextResponse.json(
        { error: '兴趣不能超过5个' },
        { status: 400 }
      )
    }

    // 检查孩子数量限制
    const childCount = await prisma.child.count({
      where: { userId: user.id }
    })

    if (childCount >= 3) {
      return NextResponse.json(
        { error: '最多只能创建3个孩子档案' },
        { status: 400 }
      )
    }

    // 创建孩子档案
    const child = await prisma.child.create({
      data: {
        nickname,
        grade,
        interests,
        userId: user.id,
        level: 1,
        xp: 0,
        streak: 0,
        expressionScore: 3,
        logicScore: 3,
        inquiryScore: 3,
        creativityScore: 3,
        habitScore: 3
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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const children = await prisma.child.findMany({
      where: { userId: user.id },
      include: {
        badges: true,
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