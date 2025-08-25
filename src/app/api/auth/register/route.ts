import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, validatePhone } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password, code } = body

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

    // TODO: 验证短信验证码
    // if (!verifyCode(phone, code)) {
    //   return NextResponse.json(
    //     { error: '验证码错误或已过期' },
    //     { status: 400 }
    //   )
    // }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该手机号已注册' },
        { status: 400 }
      )
    }

    // 创建用户
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        phone: true,
        role: true,
      },
    })

    // 生成token
    const token = generateToken({
      userId: user.id,
      role: user.role,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 