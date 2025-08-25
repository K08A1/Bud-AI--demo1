import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// 创建孩子档案
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
    const { nickname, grade, interests } = body

    // 验证输入
    if (!nickname || !grade) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      )
    }

    // 验证昵称长度
    if (nickname.length > 10) {
      return NextResponse.json(
        { error: '昵称不能超过10个字符' },
        { status: 400 }
      )
    }

    // 验证兴趣数量
    if (interests && interests.length > 5) {
      return NextResponse.json(
        { error: '兴趣标签最多选择5个' },
        { status: 400 }
      )
    }

    // 检查孩子数量限制（最多3个）
    const childCount = await prisma.child.count({
      where: { userId: user.userId },
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
        userId: user.userId,
        nickname,
        grade,
        interests: interests || [],
      },
    })

    return NextResponse.json({ child })
  } catch (error) {
    console.error('Create child error:', error)
    return NextResponse.json(
      { error: '创建档案失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 获取孩子档案列表
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
      where: { userId: user.userId },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        _count: {
          select: {
            taskRecords: true,
            works: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ children })
  } catch (error) {
    console.error('Get children error:', error)
    return NextResponse.json(
      { error: '获取档案失败，请稍后重试' },
      { status: 500 }
    )
  }
} 