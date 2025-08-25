import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken, validatePhone } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { phone, password, nickname, childGrade, childInterests } = await request.json()

    // 验证输入
    if (!phone || !password || !nickname || !childGrade) {
      return NextResponse.json(
        { error: '请填写所有必填信息' },
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

    // 检查手机号是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该手机号已注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 创建用户和孩子档案
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        role: 'PARENT',
        children: {
          create: {
            nickname,
            grade: childGrade,
            interests: childInterests || [],
            expressionScore: 3.0,
            logicScore: 3.0,
            explorationScore: 3.0,
            creativityScore: 3.0,
            habitScore: 3.0
          }
        }
      },
      include: {
        children: true
      }
    })

    // 生成JWT token
    const token = generateToken({ userId: user.id, role: user.role })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 