import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, validatePhone } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password } = body

    // 验证输入
    if (!phone || !password) {
      return NextResponse.json(
        { error: '请输入手机号和密码' },
        { status: 400 }
      )
    }

    // 验证手机号格式
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: '手机号格式不正确' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        children: {
          select: {
            id: true,
            nickname: true,
            grade: true,
            interests: true,
            avatarUrl: true,
            level: true,
            xp: true,
            streak: true,
            globalTitle: true,
            expressionScore: true,
            logicScore: true,
            explorationScore: true,
            creativityScore: true,
            habitScore: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: '手机号或密码错误' },
        { status: 401 }
      )
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '手机号或密码错误' },
        { status: 401 }
      )
    }

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // 生成token
    const token = generateToken({
      userId: user.id,
      role: user.role,
    })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
} 